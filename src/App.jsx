import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import './index.css';
import { months, generateRoadmapData, resources, syllabus } from './data';

const supabaseUrl = 'https://fqzxkmzotgvpmauqyvfg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxenhrbXpvdGd2cG1hdXF5dmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMTc1MjMsImV4cCI6MjA5MjU5MzUyM30.cvsmtSH3Qs2zT_xou3fGl5NLx2M50RxPO9nhVmfuGws';
const supabase = createClient(supabaseUrl, supabaseKey);

const ALLOWED_USERS = {
  'sindhu': { password: 'password123', syncCode: 'SINDHU' },
  'ravi': { password: '12345', syncCode: 'RAVI' },
  'sadiya': { password: '12345', syncCode: 'SADIYA' }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeMonth, setActiveMonth] = useState('june');
  const [activeTab, setActiveTab] = useState('roadmap'); // roadmap, resources, sync
  const [tasks, setTasks] = useState({});
  const [todayTime, setTodayTime] = useState(new Date().setHours(0, 0, 0, 0));
  
  const [syncCode, setSyncCode] = useState('');
  const [inputSyncCode, setInputSyncCode] = useState('');
  const [syncStatus, setSyncStatus] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Check for existing session
  useEffect(() => {
    const savedSession = localStorage.getItem('gateSession');
    if (savedSession && ALLOWED_USERS[savedSession]) {
      setIsAuthenticated(true);
      setSyncCode(ALLOWED_USERS[savedSession].syncCode);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = username.toLowerCase().trim();
    if (ALLOWED_USERS[user] && ALLOWED_USERS[user].password === password) {
      setIsAuthenticated(true);
      setSyncCode(ALLOWED_USERS[user].syncCode);
      localStorage.setItem('gateSession', user);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gateSession');
    setUsername('');
    setPassword('');
  };

  // Initialize data on mount when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const defaultData = generateRoadmapData();

    const savedData = localStorage.getItem('gateRoadmapData_cs');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const merged = { ...defaultData };
      Object.keys(parsed).forEach(month => {
        if (merged[month]) {
          merged[month] = merged[month].map(task => {
            const savedTask = parsed[month].find(t => t.id === task.id);
            return savedTask ? { ...task, isCompleted: savedTask.isCompleted } : task;
          });
        }
      });
      setTasks(merged);
    } else {
      setTasks(defaultData);
    }
  }, [isAuthenticated]);

  // Save to local storage whenever tasks change and trigger background sync
  useEffect(() => {
    if (Object.keys(tasks).length > 0 && syncCode) {
      localStorage.setItem('gateRoadmapData_cs', JSON.stringify(tasks));
      
      // Debounced Background Sync
      const timeoutId = setTimeout(async () => {
        try {
          await supabase.from('gate_progress').upsert({ 
            id: `cs_${syncCode}`, 
            data: tasks,
            updated_at: new Date().toISOString()
          });
        } catch (err) {
          console.error("Sync error. Please create the table in Supabase.", err);
        }
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [tasks, syncCode]);

  const loadFromCloud = async () => {
    if (!inputSyncCode) return;
    setIsSyncing(true);
    setSyncStatus('Fetching...');
    try {
      const { data, error } = await supabase
        .from('gate_progress')
        .select('data')
        .eq('id', `cs_${inputSyncCode.toUpperCase()}`)
        .single();
        
      if (error || !data) {
        setSyncStatus('Error: Code not found or table missing.');
      } else {
        setTasks(data.data);
        setSyncCode(inputSyncCode.toUpperCase());
        localStorage.setItem('gateSyncCode', inputSyncCode.toUpperCase());
        setSyncStatus('Success! Data synced.');
      }
    } catch (err) {
      setSyncStatus('Error connecting to database.');
    }
    setIsSyncing(false);
  };

  const handleToggleTask = (monthId, taskId) => {
    setTasks(prev => {
      const updatedMonth = prev[monthId].map(task => 
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      );
      return { ...prev, [monthId]: updatedMonth };
    });
  };

  // Find all tasks from the past that are NOT completed (Rollover Tasks)
  const rolloverTasks = useMemo(() => {
    const pending = [];
    Object.keys(tasks).forEach(monthId => {
      tasks[monthId].forEach(task => {
        if (!task.isCompleted && task.dateValue < todayTime) {
          pending.push({ ...task, originalMonthId: monthId });
        }
      });
    });
    // Sort by oldest first
    return pending.sort((a, b) => a.dateValue - b.dateValue);
  }, [tasks, todayTime]);

  const calculateProgress = (monthId) => {
    if (!tasks[monthId] || tasks[monthId].length === 0) return 0;
    const completed = tasks[monthId].filter(t => t.isCompleted).length;
    return Math.round((completed / tasks[monthId].length) * 100);
  };

  const sortedActiveMonthTasks = useMemo(() => {
    if (!tasks[activeMonth]) return [];
    return [...tasks[activeMonth]].sort((a, b) => {
      // If completion status is the same, keep chronological order
      if (a.isCompleted === b.isCompleted) {
        return a.dateValue - b.dateValue;
      }
      // Otherwise, incomplete tasks (-1) come before completed tasks (1)
      return a.isCompleted ? 1 : -1;
    });
  }, [tasks, activeMonth]);

  if (!isAuthenticated) {
    return (
      <div className="app-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div className="logo" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
              <span className="logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
              </span>
            </div>
            <h2>GATE CS <span className="gradient-text">Mastery</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Private access restricted to authorized users.</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-tertiary)', color: 'white', outline: 'none' }}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-tertiary)', color: 'white', outline: 'none' }}
              required
            />
            {loginError && <div style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{loginError}</div>}
            <button type="submit" className="glow-btn" style={{ marginTop: '0.5rem', width: '100%' }}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="app-container nav-content">
          <div className="logo">
            <span className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
            </span>
            GATE CS <span className="gradient-text">Mastery</span>
          </div>
          <div className="nav-links">
            <div 
              className={`nav-link ${activeTab === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('roadmap')}
            >
              Roadmap & Todo
            </div>
            <div 
              className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              Resources & PYQs
            </div>
            <div 
              className={`nav-link ${activeTab === 'sync' ? 'active' : ''}`}
              onClick={() => setActiveTab('sync')}
            >
              Cloud Sync
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="glow-btn">Target: Rank &lt;50</button>
            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="app-container">
        <header className="hero animate-fade-in">
          <h1>Your Path to <span className="gradient-text">AIR &lt;50</span></h1>
          <p>The ultimate day-wise preparation roadmap for GATE Computer Science. Complete every task, let nothing roll over.</p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value" style={{ color: rolloverTasks.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
                {rolloverTasks.length}
              </span>
              <span className="stat-label">Pending Rollover Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {tasks['june'] ? Object.keys(tasks).reduce((acc, monthId) => acc + tasks[monthId].filter(t => t.isCompleted).length, 0) : 0}
              </span>
              <span className="stat-label">Total Completed Days</span>
            </div>
          </div>
        </header>

        {activeTab === 'roadmap' && (
          <div className="main-grid">
            <aside className="sidebar animate-fade-in delay-100">
              <h3>Timeline (June - Feb)</h3>
              <div className="month-selector">
                {months.map(month => (
                  <button 
                    key={month.id}
                    className={`month-btn ${activeMonth === month.id ? 'active' : ''}`}
                    onClick={() => setActiveMonth(month.id)}
                  >
                    <span>{month.name}</span>
                    <span className="month-progress" style={{ color: calculateProgress(month.id) === 100 ? 'var(--success)' : 'inherit' }}>
                      {calculateProgress(month.id)}%
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <main className="content-area animate-fade-in delay-200">
              
              {/* Rollover Tasks Section */}
              {rolloverTasks.length > 0 && (
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)', marginBottom: '2rem' }}>
                  <h3 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    Action Required: Rollover Tasks
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    You missed these tasks from previous days. Complete them ASAP to stay on track for AIR &lt;50!
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {rolloverTasks.slice(0, 5).map(task => (
                      <div key={`rollover-${task.id}`} className="task-item" style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div 
                          className="day-status"
                          onClick={() => handleToggleTask(task.originalMonthId, task.id)}
                          style={{ minWidth: '24px' }}
                        >
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>{task.date}</div>
                          <div style={{ fontSize: '0.95rem' }}>{task.task}</div>
                        </div>
                      </div>
                    ))}
                    {rolloverTasks.length > 5 && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        + {rolloverTasks.length - 5} more pending tasks across different months. Navigate to specific months to view them.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <h2 className="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                {months.find(m => m.id === activeMonth)?.name} Plan
              </h2>
              
              {tasks[activeMonth] ? (
                <div className="days-grid">
                  {sortedActiveMonthTasks.map(day => (
                    <div key={day.id} className={`day-card glass-panel ${day.isCompleted ? 'completed' : ''}`}>
                      <div className="day-header">
                        <span className="day-date">{day.dateString}</span>
                        <div 
                          className="day-status"
                          onClick={() => handleToggleTask(activeMonth, day.id)}
                          title={day.isCompleted ? "Mark as pending" : "Mark as completed"}
                        >
                          {day.isCompleted && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </div>
                      </div>
                      
                      <div className="day-subject">{day.subject}</div>
                      <div className="day-title">{day.title}</div>
                      
                      <div className="day-tasks">
                        <div className="task-item">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: '16px' }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          <span style={{ textDecoration: day.isCompleted ? 'line-through' : 'none', opacity: day.isCompleted ? 0.6 : 1 }}>
                            {day.task}
                          </span>
                        </div>
                        {day.resourceUrl && !day.isCompleted && (
                          <div style={{ marginTop: '0.75rem', paddingLeft: '1.5rem' }}>
                            <a href={day.resourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                              Search Topic Resources
                            </a>
                          </div>
                        )}
                      </div>
                      
                      {day.isCompleted && (
                        <div style={{ marginTop: '1rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          Completed
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <h3>Loading plan...</h3>
                </div>
              )}
            </main>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="animate-fade-in" style={{ marginBottom: '4rem' }}>
            <h2 className="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              Study Materials & Previous Papers
            </h2>
            
            <div className="resources-grid">
              {resources.map(resource => (
                <div key={resource.id} className="resource-card glass-panel">
                  <div className="resource-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {resource.type.includes('Video') ? (
                        <><polygon points="5 3 19 12 5 21 5 3"/></>
                      ) : resource.type.includes('Database') ? (
                        <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>
                      ) : (
                        <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></>
                      )}
                    </svg>
                  </div>
                  <h3 className="resource-title">{resource.title}</h3>
                  <div className="meta-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>{resource.type}</div>
                  <p className="resource-desc">{resource.desc}</p>
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{ width: '100%', textDecoration: 'none' }}>
                    <button className="outline-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      Access Resource
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                    </button>
                  </a>
                </div>
              ))}
            </div>
            
            <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Important Note on Target &lt;50 Rank</h3>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '0.5rem' }}>PYQs are the golden key. Attempt GATE Overflow PYQs at least 3 times before February.</li>
                <li style={{ marginBottom: '0.5rem' }}>Do not skip Mathematics and General Aptitude; they carry 28-30 marks easily scorable.</li>
                <li style={{ marginBottom: '0.5rem' }}>Write full-length mock tests between 9:30 AM - 12:30 PM or 2:30 PM - 5:30 PM to align your biological clock.</li>
                <li>While we provide links to Telugu explanations for conceptual clarity, we highly recommend practicing all Mock tests strictly in <strong>English</strong>.</li>
              </ul>
            </div>
            
            <h2 className="section-title" style={{ marginTop: '4rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Official GATE CS Syllabus Checklist
            </h2>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {syllabus.map((syl, index) => (
                  <div key={index} style={{ borderBottom: index < syllabus.length - 1 ? '1px solid var(--glass-border)' : 'none', paddingBottom: index < syllabus.length - 1 ? '1.5rem' : '0' }}>
                    <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{syl.section}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{syl.topics}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'sync' && (
          <div className="animate-fade-in" style={{ marginBottom: '4rem' }}>
            <h2 className="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              Cloud Database Sync (No Login)
            </h2>
            
            <div className="main-grid">
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Your Unique Sync Code</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Your progress is automatically saved to the cloud under this code. Keep it safe. 
                  If you open this site on your phone, just enter this code below to restore your progress!
                </p>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', fontSize: '2rem', fontWeight: '800', textAlign: 'center', letterSpacing: '4px', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                  {syncCode}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Restore from Cloud</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Accessing from a new device? Enter your Sync Code here to download your progress from the database.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit Code" 
                    value={inputSyncCode}
                    onChange={(e) => setInputSyncCode(e.target.value)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-tertiary)', color: 'white', textTransform: 'uppercase', outline: 'none' }}
                  />
                  <button className="glow-btn" onClick={loadFromCloud} disabled={isSyncing}>
                    {isSyncing ? 'Loading...' : 'Load Data'}
                  </button>
                </div>
                {syncStatus && (
                  <p style={{ marginTop: '1rem', color: syncStatus.includes('Error') ? 'var(--danger)' : 'var(--success)' }}>
                    {syncStatus}
                  </p>
                )}
              </div>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', borderLeft: '4px solid var(--accent-primary)' }}>
              <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Database Setup Instructions</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                For this cloud sync to work perfectly, please run this exact SQL command in your Supabase SQL Editor:
                <br/><br/>
                <code style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: '6px', display: 'block', color: 'var(--text-primary)' }}>
                  CREATE TABLE IF NOT EXISTS gate_progress (<br/>
                    &nbsp;&nbsp;id text PRIMARY KEY,<br/>
                    &nbsp;&nbsp;data jsonb NOT NULL,<br/>
                    &nbsp;&nbsp;updated_at timestamp with time zone<br/>
                  );
                </code>
              </p>
            </div>
          </div>
        )}
      </div>

      <footer>
        <div className="app-container">
          <p>© 2026 GATE CS Mastery. Designed for AIR &lt;50 Aspirants.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
