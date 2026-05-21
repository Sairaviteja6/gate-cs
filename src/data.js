export const syllabus = [
  { section: 'General Aptitude', topics: 'Verbal Aptitude, Quantitative Aptitude, Analytical Aptitude, Spatial Aptitude.' },
  { section: 'Engineering Mathematics', topics: 'Discrete Mathematics (Logic, Graphs, Combinatorics), Linear Algebra, Calculus, Probability & Statistics.' },
  { section: 'Digital Logic', topics: 'Boolean algebra, Combinational and Sequential circuits, Minimization, Number representations.' },
  { section: 'Computer Organization', topics: 'Machine instructions, ALU, Data path and control unit, Instruction pipelining, Memory hierarchy (Cache, RAM), I/O interface.' },
  { section: 'Programming & DSA', topics: 'Programming in C, Recursion. Arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs.' },
  { section: 'Algorithms', topics: 'Searching, sorting, hashing. Asymptotic worst case time and space complexity. Algorithm design techniques: greedy, dynamic programming and divide-and-conquer. Graph traversals, shortest paths.' },
  { section: 'Theory of Computation', topics: 'Regular expressions, finite automata. Context-free grammars, push-down automata. Regular and context-free languages, pumping lemma. Turing machines and undecidability.' },
  { section: 'Compiler Design', topics: 'Lexical analysis, parsing, syntax-directed translation. Runtime environments. Intermediate code generation. Local optimization, Data flow analyses.' },
  { section: 'Operating System', topics: 'System calls, processes, threads, inter-process communication, concurrency and synchronization. Deadlock. CPU and I/O scheduling. Memory management and virtual memory. File systems.' },
  { section: 'Databases', topics: 'ER-model. Relational model: relational algebra, tuple calculus, SQL. Integrity constraints, normal forms. File organization, indexing (e.g., B and B+ trees). Transactions and concurrency control.' },
  { section: 'Computer Networks', topics: 'Concept of layering: OSI and TCP/IP. Basics of framing, error detection, MAC. Routing protocols. TCP/UDP, congestion control. Application layer: DNS, SMTP, HTTP. IPv4/IPv6, subnets.' }
];

export const resources = [
  {
    id: 1,
    title: 'NPTEL Computer Science',
    type: 'Video Lectures (English)',
    desc: 'Official IIT lectures covering the complete syllabus in depth.',
    link: 'https://nptel.ac.in/course.html',
  },
  {
    id: 2,
    title: 'GATE Smashers',
    type: 'Video Lectures (Hindi/English)',
    desc: 'Simplified explanations for core subjects like OS, DBMS, CN.',
    link: 'https://www.youtube.com/c/GATESmashers',
  },
  {
    id: 3,
    title: 'Vamsi Bhavani (Telugu)',
    type: 'Video Lectures (Telugu)',
    desc: 'Curated playlists explaining complex topics and coding in Telugu.',
    link: 'https://www.youtube.com/c/VamsiBhavani',
  },
  {
    id: 4,
    title: 'GeeksforGeeks GATE Notes',
    type: 'Reading Material',
    desc: 'Comprehensive topic-wise notes and previous year questions.',
    link: 'https://www.geeksforgeeks.org/gate-cs-notes-gq/',
  },
  {
    id: 5,
    title: 'GATE Overflow',
    type: 'PYQ Database',
    desc: 'The best resource for authentic GATE previous year questions with detailed explanations.',
    link: 'https://gateoverflow.in/',
  },
  {
    id: 6,
    title: 'Previous Year Papers (Official)',
    type: 'PDFs & Mock Tests',
    desc: 'Direct link to IISc GATE 2024 Question Papers archive.',
    link: 'https://gate2024.iisc.ac.in/question-papers/',
  }
];

const plan = [
  // JUNE: Math & Digital Logic
  { title: 'Propositional & First Order Logic', subject: 'Discrete Math', days: 6 },
  { title: 'Combinatorics & Graph Theory', subject: 'Discrete Math', days: 6 },
  { title: 'Linear Algebra', subject: 'Engineering Math', days: 5 },
  { title: 'Calculus & Probability', subject: 'Engineering Math', days: 6 },
  { title: 'Boolean Algebra & Combinational Circuits', subject: 'Digital Logic', days: 7 },
  // JULY: COA & Basic C Programming
  { title: 'Sequential Circuits & Minimization', subject: 'Digital Logic', days: 5 },
  { title: 'Machine Instructions & Addressing Modes', subject: 'COA', days: 6 },
  { title: 'Memory Hierarchy, Cache & I/O', subject: 'COA', days: 7 },
  { title: 'Instruction Pipelining & Datapath', subject: 'COA', days: 6 },
  { title: 'C Programming & Recursion', subject: 'Programming', days: 7 },
  // AUGUST: Data Structures & Algorithms
  { title: 'Arrays, Stacks, Queues, Linked Lists', subject: 'Data Structures', days: 7 },
  { title: 'Trees, BST, Heaps & Graphs', subject: 'Data Structures', days: 8 },
  { title: 'Sorting, Searching & Hashing', subject: 'Algorithms', days: 6 },
  { title: 'Greedy & Divide-and-Conquer', subject: 'Algorithms', days: 5 },
  { title: 'Dynamic Programming & Graph Traversal', subject: 'Algorithms', days: 5 },
  // SEPTEMBER: TOC & Compilers
  { title: 'Regular Languages & Finite Automata', subject: 'TOC', days: 7 },
  { title: 'Context-Free Languages & Pushdown Automata', subject: 'TOC', days: 7 },
  { title: 'Turing Machines & Undecidability', subject: 'TOC', days: 6 },
  { title: 'Lexical Analysis & Parsing', subject: 'Compiler Design', days: 6 },
  { title: 'Syntax Directed Translation & Optimization', subject: 'Compiler Design', days: 4 },
  // OCTOBER: Operating Systems
  { title: 'Processes, Threads & System Calls', subject: 'Operating Systems', days: 7 },
  { title: 'Process Synchronization & Semaphores', subject: 'Operating Systems', days: 8 },
  { title: 'Deadlocks & CPU Scheduling', subject: 'Operating Systems', days: 6 },
  { title: 'Memory Management & Virtual Memory', subject: 'Operating Systems', days: 6 },
  { title: 'File Systems & I/O Scheduling', subject: 'Operating Systems', days: 4 },
  // NOVEMBER: Databases & Networks
  { title: 'ER Model & Relational Algebra', subject: 'Databases', days: 5 },
  { title: 'SQL & Integrity Constraints', subject: 'Databases', days: 5 },
  { title: 'Normalization, Transactions & Concurrency', subject: 'Databases', days: 5 },
  { title: 'OSI, TCP/IP, Framing & MAC', subject: 'Computer Networks', days: 5 },
  { title: 'Routing, IPv4/IPv6 & Subnetting', subject: 'Computer Networks', days: 5 },
  { title: 'TCP/UDP, Congestion & Application Layer', subject: 'Computer Networks', days: 5 },
  // DECEMBER: Revision Phase 1 (Subject Wise Tests)
  { title: 'Math & Digital Logic Revision', subject: 'Revision', days: 7 },
  { title: 'COA & Programming Revision', subject: 'Revision', days: 6 },
  { title: 'DSA & TOC Revision', subject: 'Revision', days: 6 },
  { title: 'OS, DBMS & CN Revision', subject: 'Revision', days: 7 },
  { title: 'Compilers & Aptitude Revision', subject: 'Revision', days: 5 },
  // JANUARY: Full Length Mock Tests
  { title: 'Full Length Mock Tests 1-3 & Analysis', subject: 'Mock Tests', days: 8 },
  { title: 'Full Length Mock Tests 4-6 & Analysis', subject: 'Mock Tests', days: 8 },
  { title: 'Full Length Mock Tests 7-9 & Analysis', subject: 'Mock Tests', days: 8 },
  { title: 'Formula Memorization & Weak Area Focus', subject: 'Revision', days: 7 },
  // FEBRUARY: Final Week
  { title: 'Exam Readiness & Mental Prep', subject: 'GATE EXAM', days: 6 }
];

export const generateRoadmapData = () => {
  const fullData = [];
  
  // Starting exactly on June 1, 2026
  let currentDate = new Date(2026, 5, 1); // Month is 0-indexed in JS (5 = June)
  
  plan.forEach(block => {
    for (let i = 0; i < block.days; i++) {
      
      let dailyTask = "";
      const dayCycle = i % 7;
      
      if (block.subject === 'Mock Tests' || block.subject === 'Revision' || block.subject === 'GATE EXAM') {
        dailyTask = `Focus on ${block.title}. Analyze mistakes deeply.`;
      } else {
        if (dayCycle === 0 || dayCycle === 1) {
          dailyTask = `Watch Lectures & Read Notes for: ${block.title}`;
        } else if (dayCycle === 2 || dayCycle === 3) {
          dailyTask = `Solve Topic Practice Questions: ${block.title}`;
        } else if (dayCycle === 4) {
          dailyTask = `Solve Previous Year Questions (GATE Overflow) for: ${block.title}`;
        } else if (dayCycle === 5) {
          dailyTask = `Revise concepts and write short notes for ${block.title}`;
        } else {
          dailyTask = `Take Topic Wise Mock Test for ${block.subject}`;
        }
      }

      // Generate a dynamic YouTube search link for the specific topic
      const query = encodeURIComponent(`GATE CS ${block.title} ${block.subject}`);
      const resourceUrl = `https://www.youtube.com/results?search_query=${query}`;
      
      const monthName = currentDate.toLocaleString('default', { month: 'long' });
      const monthId = monthName.toLowerCase();

      fullData.push({
        id: `${monthId}-${currentDate.getDate()}`, // e.g. june-1
        monthId: monthId,
        dateString: currentDate.toDateString(), // e.g. "Mon Jun 01 2026"
        dateValue: currentDate.getTime(),
        subject: block.subject,
        title: block.title,
        task: dailyTask,
        resourceUrl: resourceUrl,
        isCompleted: false
      });
      
      // Increment day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  // Group by monthId
  const groupedByMonth = {};
  months.forEach(m => {
    groupedByMonth[m.id] = fullData.filter(d => d.monthId === m.id);
  });

  return groupedByMonth;
};

// Extracted months for sidebar usage
export const months = [
  { id: 'june', name: 'June' },
  { id: 'july', name: 'July' },
  { id: 'august', name: 'August' },
  { id: 'september', name: 'September' },
  { id: 'october', name: 'October' },
  { id: 'november', name: 'November' },
  { id: 'december', name: 'December' },
  { id: 'january', name: 'January' },
  { id: 'february', name: 'February' }
];
