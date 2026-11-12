import https from 'https';

// Multilingual greeting and phrasing helper
const MULTILINGUAL_LABELS = {
  English: {
    groundedLesson: '📖 [From Lesson Content]',
    aiExplanation: '💡 [AI Conceptual Extension]',
    examTip: '🎯 Exam Tip:',
  },
  Hindi: {
    groundedLesson: '📖 [पाठ्य सामग्री से]',
    aiExplanation: '💡 [एआई अवधारणा स्पष्टीकरण]',
    examTip: '🎯 परीक्षा युक्ति:',
  },
  Spanish: {
    groundedLesson: '📖 [Del Contenido de la Lección]',
    aiExplanation: '💡 [Explicación Conceptual de la IA]',
    examTip: '🎯 Consejo de Examen:',
  },
  French: {
    groundedLesson: '📖 [Du Contenu de la Leçon]',
    aiExplanation: '💡 [Explication Conceptuelle de l\'IA]',
    examTip: '🎯 Conseil d\'Examen:',
  },
  German: {
    groundedLesson: '📖 [Aus dem Lektionsinhalt]',
    aiExplanation: '💡 [KI-Konzeptuelle Erklärung]',
    examTip: '🎯 Prüfungstipp:',
  },
  Tamil: {
    groundedLesson: '📖 [பாட உள்ளடக்கத்திலிருந்து]',
    aiExplanation: '💡 [AI கருத்தியல் விளக்கம்]',
    examTip: '🎯 தேர்வு குறிப்பு:',
  },
  Telugu: {
    groundedLesson: '📖 [పాఠం కంటెంట్ నుండి]',
    aiExplanation: '💡 [AI సంభావిత వివరణ]',
    examTip: '🎯 పరీక్ష చిట్కా:',
  },
  Bengali: {
    groundedLesson: '📖 [পাঠ বিষয়বস্তু থেকে]',
    aiExplanation: '💡 [এআই ধারণাগত ব্যাখ্যা]',
    examTip: '🎯 পরীক্ষার পরামর্শ:',
  },
};

// Fallback educational knowledge base for instant zero-latency responses
const KNOWLEDGE_BASE = {
  'process-vs-thread': {
    title: 'Process vs Thread',
    summary: 'A Process is an isolated program in execution with its own private virtual address space and heavy PCB context. A Thread is a lightweight dispatchable unit of CPU execution within a process that shares code, global data, and file descriptors but maintains a private Program Counter, register set, and call stack.',
    analogy: 'Imagine a factory (Process) containing multiple assembly line workers (Threads). The factory provides the warehouse, electricity, and raw materials (shared memory). Each worker has their own hands and to-do notebook (registers and stack). Switching between two factories is expensive, while two workers in the same room communicate instantly.',
    keyPoints: [
      'Processes have independent address spaces; crash in one process does not affect another.',
      'Threads share memory, so failure in one unhandled thread can terminate the whole process.',
      'Context switching between threads is much faster because the MMU TLB (Translation Lookaside Buffer) does not need to be flushed.',
      'Process creation uses fork() / exec(); Thread creation uses pthread_create().'
    ],
    examPoints: [
      'In GATE/University exams, always draw the memory layout diagram showing shared Code/Data/Heap vs private Stack/Registers.',
      'Define Thread Control Block (TCB) vs Process Control Block (PCB).',
      'Explain User Level Threads (ULT) vs Kernel Level Threads (KLT) mapping models (1:1, M:1, M:N).'
    ]
  },
  'cpu-scheduling': {
    title: 'CPU Scheduling Algorithms',
    summary: 'CPU Scheduling determines which process in the ready queue is allocated the CPU core. Key metrics: Throughput, Turnaround Time (Completion - Arrival), Waiting Time (Turnaround - Burst), and Response Time.',
    analogy: 'Like a hospital emergency triage: First-Come First-Served (FCFS) serves whoever walked in first, while Shortest Job First (SJF) gives medicine to the quickest headache first to minimize the average waiting room crowd. Round Robin gives everyone 2 minutes with the doctor before going back to the queue.',
    keyPoints: [
      'FCFS suffers from the Convoy Effect where small processes wait behind a massive CPU-bound process.',
      'Shortest Job First (SJF) is mathematically optimal for minimum average waiting time, but impossible to implement in pure form without predicting future CPU burst time (exponential smoothing is used).',
      'Round Robin (RR) with a small time quantum approaches processor sharing; too small causes excessive context switch overhead, too large degrades to FCFS.',
      'Priority scheduling can cause Starvation (indefinite blocking), mitigated through Aging (gradually increasing priority over time).'
    ],
    examPoints: [
      'Always draw Gantt Charts clearly with exact integer arrival and completion timestamps.',
      'Calculate Turnaround Time (TAT) and Waiting Time (WT) in a structured table.',
      'Explain why Shortest Remaining Time First (SRTF) is the preemptive variant of SJF.'
    ]
  },
  'deadlock': {
    title: 'Deadlock & Banker’s Algorithm',
    summary: 'A deadlock occurs in a concurrent system when a set of processes are blocked because each process holds a resource and waits for another resource held by another process in the same set. Handled by Prevention, Avoidance (Banker’s), Detection & Recovery, or Ignorance (Ostrich algorithm).',
    analogy: 'Four cars arrive simultaneously at a 4-way intersection, each wanting to turn left. Each car blocks the intersection path needed by the car behind it. None can move forward unless one car backs up.',
    keyPoints: [
      'Coffman 4 Necessary Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
      'Breaking any ONE of the 4 conditions completely prevents deadlocks.',
      'Deadlock Avoidance requires safe state tracking. An unsafe state is NOT necessarily a deadlock, but can lead to one.',
      'Banker’s Algorithm maintains Allocation, Max, and Need matrices where Need = Max - Allocation. If Available >= Need[i], process i can finish.'
    ],
    examPoints: [
      'State and prove Coffman’s 4 conditions.',
      'Demonstrate Banker’s algorithm step-by-step showing the safe execution sequence.',
      'Explain Resource Allocation Graph (RAG) and why a cycle is a sufficient condition for deadlock only when resources have single instances.'
    ]
  }
};

export const aiService = {
  // Interactive AI Tutor Chat
  tutorChat: async ({ message, history = [], topic = '', videoTitle = '', transcript = null, language = 'English', persona = 'balanced', userApiKey = '' }) => {
    const effectiveApiKey = userApiKey || process.env.GEMINI_API_KEY;
    const labels = MULTILINGUAL_LABELS[language] || MULTILINGUAL_LABELS.English;

    // If Gemini API Key is configured, attempt live Gemini call
    if (effectiveApiKey) {
      try {
        const liveResponse = await callGeminiApi({
          apiKey: effectiveApiKey,
          systemPrompt: createSystemPrompt({ topic, videoTitle, transcript, language, persona, labels }),
          userMessage: message,
          history,
        });
        return {
          response: liveResponse,
          source: 'Gemini Live AI Tutor',
          groundedInTranscript: !!(transcript && transcript.canGroundAi),
          language,
        };
      } catch (err) {
        console.warn('[Gemini API] Fallback to internal Educational Engine:', err.message);
      }
    }

    // Built-in Smart Pedagogical Response Generator
    const lower = message.toLowerCase();
    let reply = '';
    const isGrounded = transcript && transcript.canGroundAi;

    // Detect intent
    if (lower.includes('process') && lower.includes('thread')) {
      const kb = KNOWLEDGE_BASE['process-vs-thread'];
      reply = `${labels.aiExplanation} **Understanding Process vs Thread:**\n\n` +
        `• **Process:** ${kb.summary.split('.')[0]}.\n` +
        `• **Thread:** ${kb.summary.split('.')[1]}.\n\n` +
        `**🧠 Real-World Analogy:**\n${kb.analogy}\n\n` +
        `**⚖️ Key Distinctions:**\n` +
        kb.keyPoints.map(p => `• ${p}`).join('\n') + '\n\n' +
        `**${labels.examTip}**\n` +
        kb.examPoints.map(p => `✓ ${p}`).join('\n');
    } else if (lower.includes('cpu scheduling') || lower.includes('fcfs') || lower.includes('sjf') || lower.includes('round robin')) {
      const kb = KNOWLEDGE_BASE['cpu-scheduling'];
      reply = `${labels.aiExplanation} **CPU Scheduling Demystified:**\n\n` +
        `${kb.summary}\n\n` +
        `**🏎️ The Analogy:**\n${kb.analogy}\n\n` +
        `**📊 Algorithm Comparisons:**\n` +
        kb.keyPoints.map(p => `• ${p}`).join('\n') + '\n\n' +
        `**${labels.examTip}**\n` +
        kb.examPoints.map(p => `✓ ${p}`).join('\n');
    } else if (lower.includes('deadlock') || lower.includes('banker')) {
      const kb = KNOWLEDGE_BASE['deadlock'];
      reply = `${labels.aiExplanation} **Deadlock & Safe States:**\n\n` +
        `${kb.summary}\n\n` +
        `**🚦 Intuitive Analogy:**\n${kb.analogy}\n\n` +
        `**🔒 The 4 Coffman Conditions:**\n` +
        kb.keyPoints.map(p => `• ${p}`).join('\n') + '\n\n' +
        `**${labels.examTip}**\n` +
        kb.examPoints.map(p => `✓ ${p}`).join('\n');
    } else if (lower.includes('simply') || lower.includes('eli5') || lower.includes('beginner')) {
      reply = `${labels.aiExplanation} **Simplified Beginner Breakdown (${topic || 'This Concept'}):**\n\n` +
        `Let’s strip away the technical jargon:\n\n` +
        `1. **What is it really?** It is a mechanism designed to solve a fundamental coordination problem in computer hardware.\n` +
        `2. **Why do we need it?** Without it, multiple tasks trying to use the same CPU or memory at the exact same millisecond would corrupt each other's data.\n` +
        `3. **Key takeaway:** Think of it like a smart traffic conductor ensuring everyone gets their turn fairly, safely, and efficiently.\n\n` +
        `Would you like me to give you a concrete code example or test you with an interactive quiz?`;
    } else if (lower.includes('hindi') || language === 'Hindi') {
      reply = `📖 **नमस्ते! आइए इसे बहुत सरल हिंदी में समझते हैं (${topic || 'इस विषय को'}):**\n\n` +
        `• **मुख्य अवधारणा:** यह कंप्यूटर सिस्टम में हार्डवेयर और उपयोगकर्ता के बीच एक पुल (Bridge) का काम करता है।\n` +
        `• **उदाहरण:** जैसे एक रेस्टोरेंट में वेटर ग्राहक और शेफ के बीच तालमेल बिठाता है, वैसे ही ऑपरेटिंग सिस्टम आपके सॉफ्टवेयर और सीपीयू/मेमोरी के बीच काम करता है।\n` +
        `• **महत्वपूर्ण परीक्षा बिंदु:**\n` +
        `  1. यूजर मोड (User Mode) बनाम कर्नल मोड (Kernel Mode)\n` +
        `  2. सिस्टम कॉल (System Call) कैसे काम करता है।\n` +
        `  3. प्रोसेस का जीवन चक्र (Process Life Cycle)।\n\n` +
        `क्या आप चाहते हैं कि मैं इस पर आपसे एक सवाल पूछूं?`;
    } else if (lower.includes('exam') || lower.includes('gate') || lower.includes('important')) {
      reply = `🎯 **High-Yield University & Exam Points for "${topic || 'This Module'}":**\n\n` +
        `1. **Standard 5-Mark Question:** "Define the core components and draw the architectural diagram." Make sure to label kernel space vs user space clearly.\n` +
        `2. **Numerical Problems:** Practice calculating Turnaround Time (TAT = Completion - Arrival) and Waiting Time (WT = TAT - Burst).\n` +
        `3. **Viva / Interview Trap:** Interviewers love asking: *"Can a thread execute independently without a process?"* (Answer: No, threads exist strictly within a process context and share its memory map).\n` +
        `4. **Key Equations:** Be prepared to write the Banker's safety check loop: \`Need[i][j] <= Work[j]\`.`;
    } else {
      // General pedagogical response grounded in context
      const lessonSnippet = isGrounded && transcript.segments.length > 0
        ? `\n\n${labels.groundedLesson} Relevant lecture segment:\n*"${transcript.segments[1]?.text || transcript.segments[0]?.text}"*`
        : '';

      reply = `${labels.aiExplanation} **Regarding "${message}":**\n\n` +
        `In the context of **${topic || 'Computer Systems'}** and this lecture:\n\n` +
        `• **Core Mechanism:** This concept ensures system reliability, concurrency safety, and optimal hardware utilization.\n` +
        `• **Practical Application:** Modern operating systems and distributed backends (like Linux, Docker, and Node.js) rely heavily on these exact abstractions to serve millions of requests without deadlock or memory starvation.\n` +
        `• **Next Steps:** You can click **"Test Yourself"** to test your grasp with MCQs, or ask me for a **Socratic Viva** to challenge your understanding!${lessonSnippet}`;
    }

    return {
      response: reply,
      source: 'LearnTube Educational Engine',
      groundedInTranscript: isGrounded,
      language,
    };
  },

  // Structured Video Summary Generator
  generateSummary: async ({ topic, videoTitle, transcript, level = 'Intermediate', userApiKey = '' }) => {
    const effectiveApiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (effectiveApiKey) {
      try {
        const prompt = `Generate a structured, exhaustive academic study guide for the video "${videoTitle}" on the subject "${topic}". Output valid JSON with fields: quickSummary, detailedSummary, importantConcepts (array), keyDefinitions (array of {term, definition}), formulas (array of {name, formula, explanation}), practicalExamples (array of {title, description}), examNotes (array), commonMistakes (array), keyTakeaways (array), revisionNotes (string).`;
        const res = await callGeminiApi({
          apiKey: effectiveApiKey,
          systemPrompt: 'You are an elite university computer science professor. Always respond with pure valid JSON.',
          userMessage: prompt,
        });
        const parsed = JSON.parse(res.replace(/```json|```/g, '').trim());
        return { success: true, summary: parsed, source: 'Gemini AI' };
      } catch (err) {
        console.warn('[AI Summary] Gemini failed, falling back:', err.message);
      }
    }

    // High quality deterministic fallback summary
    return {
      success: true,
      source: 'LearnTube Academic Engine',
      summary: {
        topic: topic || 'Core Computer Science',
        videoTitle: videoTitle || 'Lecture Video',
        quickSummary: `This lecture provides a comprehensive deep dive into ${topic || 'the topic'}, highlighting the mathematical foundations, architectural components, performance trade-offs, and synchronization guarantees.`,
        detailedSummary: `The lesson explores both theoretical mechanisms and real-world implementations. Students learn how operating systems and software runtimes abstract hardware complexity to provide safe, isolated, and high-performance execution. Key topics include resource allocation, context management, algorithmic complexity bounds, and fault-tolerance strategies.`,
        importantConcepts: [
          'Dual-Mode Execution (User Space vs Kernel Space protection rings)',
          'Virtual Address Space Layout (Stack, Heap, BSS, Data, Text segments)',
          'Algorithmic Scheduling Paradigms (Preemptive vs Non-Preemptive)',
          'Concurrency Invariants (Mutual Exclusion, Progress, Bounded Waiting)',
          'Memory Translation Hierarchies (Paging, TLB hits/misses, Page Faults)'
        ],
        keyDefinitions: [
          {
            term: 'Kernel',
            definition: 'The core program running at all times on the computer with full hardware access and privilege ring 0.'
          },
          {
            term: 'Context Switch',
            definition: 'The operational procedure of saving the state of the current executing thread/process into its PCB/TCB and restoring another.'
          },
          {
            term: 'Critical Section',
            definition: 'A segment of code where shared resources (variables, memory, tables) are accessed, requiring synchronized entry.'
          },
          {
            term: 'Throughput',
            definition: 'The number of complete execution tasks or processes completed per unit of time.'
          }
        ],
        formulas: [
          {
            name: 'Turnaround Time (TAT)',
            formula: 'TAT = Completion Time - Arrival Time',
            explanation: 'The total wall-clock duration spent by a process from submission to total termination.'
          },
          {
            name: 'Waiting Time (WT)',
            formula: 'WT = Turnaround Time - Burst Time',
            explanation: 'The cumulative duration a process spent sitting in the ready queue waiting for CPU access.'
          },
          {
            name: 'Effective Memory Access Time (EMAT)',
            formula: 'EMAT = Hit_Ratio × (TLB_time + Mem_time) + (1 - Hit_Ratio) × (TLB_time + 2 × Mem_time)',
            explanation: 'Average latency of physical address translation incorporating Translation Lookaside Buffer cache hits.'
          }
        ],
        practicalExamples: [
          {
            title: 'Multithreaded Web Server',
            description: 'Instead of spawning heavy processes for every client HTTP request, a pool of worker threads shares sockets and static memory, dramatically cutting latency.'
          },
          {
            title: 'Database Locking Protocols',
            description: 'Two-Phase Locking (2PL) uses read/write semaphores to prevent dirty reads and ensure ACID transaction serializability.'
          }
        ],
        examNotes: [
          'High probability exam question: "Differentiate between internal and external fragmentation and state how paging eliminates external fragmentation."',
          'Always state the time complexity for scheduling queues: Priority queues are O(log N) for insert, whereas Round Robin is O(1) circular FIFO.',
          'In Banker’s algorithm problems, write the Need matrix calculation explicitly before stating the safe sequence.'
        ],
        commonMistakes: [
          'Confusing Program Counter with Instruction Register.',
          'Assuming threads have separate heaps (Threads share heap and global data; only stack and registers are thread-local).',
          'Forgetting that Preemption occurs on timer interrupts or higher-priority arrival, not solely on voluntary yield.'
        ],
        keyTakeaways: [
          'Modern systems trade off simplicity for concurrency and hardware utilization.',
          'Abstraction layers hide low-level register and bus details behind standard POSIX/Win32 APIs.',
          'Correctness must never be compromised for speed in concurrency primitives.'
        ],
        revisionNotes: `Summary Sheet: Review process state transitions (New -> Ready -> Running -> Waiting -> Terminated). Review Peterson’s algorithm requirements (flag array + turn variable). Memorize Coffman’s 4 deadlock conditions.`
      }
    };
  },

  // AI Quiz Generator
  generateQuiz: async ({ topic = 'Operating Systems', videoTitle = '', count = 5, difficulty = 'Medium', type = 'MCQ', language = 'English', userApiKey = '' }) => {
    const effectiveApiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (effectiveApiKey) {
      try {
        const prompt = `Generate a ${difficulty} difficulty ${type} educational quiz with exactly ${count} questions on the topic "${topic}" (${videoTitle}). 
Output pure JSON array of question objects with format:
[
  {
    "id": "q1",
    "question": "Clear question text?",
    "type": "MCQ",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Deep pedagogical explanation of why this answer is correct and why other options are wrong.",
    "concept": "Sub-concept name",
    "recommendedReview": "Review CPU scheduling notes"
  }
]`;
        const res = await callGeminiApi({
          apiKey: effectiveApiKey,
          systemPrompt: 'You are a test preparation expert for engineering exams. Output pure valid JSON array only.',
          userMessage: prompt,
        });
        const parsed = JSON.parse(res.replace(/```json|```/g, '').trim());
        return { success: true, questions: parsed, count: parsed.length, source: 'Gemini AI' };
      } catch (err) {
        console.warn('[Quiz Generator] Gemini fallback:', err.message);
      }
    }

    // High quality deterministic quiz bank
    const QUIZ_BANK = [
      {
        id: 'q1',
        question: 'Which of the following is SHARED between all threads in a multi-threaded process?',
        type: 'MCQ',
        options: ['Program Counter', 'Stack Memory', 'Heap & Global Variables', 'Register Set'],
        correctIndex: 2,
        explanation: 'Threads share the same virtual address space, including the Heap, Data segment, and Open OS file descriptors. Each thread retains its own private Program Counter, Register set, and Stack to maintain its independent execution thread.',
        concept: 'Threads Memory Architecture',
        recommendedReview: 'Module 3: Threads & Concurrency Models'
      },
      {
        id: 'q2',
        question: 'Which CPU scheduling algorithm is mathematically proven to produce the minimum average waiting time for a given set of stationary processes?',
        type: 'MCQ',
        options: ['First-Come First-Served (FCFS)', 'Round Robin (RR)', 'Shortest Job First (SJF)', 'Priority Scheduling'],
        correctIndex: 2,
        explanation: 'Shortest Job First (SJF) is provably optimal for minimizing average waiting time because scheduling shorter bursts earlier reduces the cumulative queue wait times for all subsequent processes.',
        concept: 'CPU Scheduling Optimization',
        recommendedReview: 'Module 4: CPU Scheduling Algorithms'
      },
      {
        id: 'q3',
        question: 'True or False: In a system with only single-instance resources, a cycle in the Resource Allocation Graph (RAG) is both a necessary and sufficient condition for a deadlock.',
        type: 'MCQ',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. When all resource types have exactly one unit/instance, any directed cycle in the Resource Allocation Graph strictly implies a circular wait condition that cannot be resolved, guaranteeing deadlock.',
        concept: 'Deadlock Graph Theory',
        recommendedReview: 'Module 6: Deadlocks & Resource Allocation'
      },
      {
        id: 'q4',
        question: 'What is the primary purpose of the Translation Lookaside Buffer (TLB)?',
        type: 'MCQ',
        options: [
          'To cache disk sectors in main memory',
          'To speed up virtual-to-physical page address translations',
          'To schedule high priority I/O interrupts',
          'To store process stack frames'
        ],
        correctIndex: 1,
        explanation: 'The TLB is a high-speed hardware associative associative cache located inside the Memory Management Unit (MMU). It caches recent Page-to-Frame mappings so the CPU avoids making 2 memory accesses per read/write.',
        concept: 'Memory Management & Paging',
        recommendedReview: 'Module 7: Paging & Address Translation'
      },
      {
        id: 'q5',
        question: 'Belady’s Anomaly is a counter-intuitive phenomenon where increasing the number of physical page frames results in more page faults. Which algorithm exhibits this anomaly?',
        type: 'MCQ',
        options: ['Least Recently Used (LRU)', 'Optimal Page Replacement (OPT)', 'First-In, First-Out (FIFO)', 'Least Frequently Used (LFU)'],
        correctIndex: 2,
        explanation: 'FIFO page replacement exhibits Belady’s anomaly because FIFO is not a stack algorithm (the set of pages in an n-frame memory is not always a subset of an (n+1)-frame memory). LRU and OPT are immune.',
        concept: 'Virtual Memory & Page Replacement',
        recommendedReview: 'Module 8: Page Replacement Algorithms'
      },
      {
        id: 'q6',
        question: 'In Unix/Linux process creation, what does the fork() system call return to the parent process?',
        type: 'MCQ',
        options: ['0', 'The PID (Process ID) of the newly spawned child process', '-1 always', 'The parent’s own PID'],
        correctIndex: 1,
        explanation: 'fork() returns 0 to the child process, and returns the positive PID of the new child to the parent process (or negative on error). This return value allows code to branch into parent vs child logic.',
        concept: 'Process Lifecycle & System Calls',
        recommendedReview: 'Module 2: Processes & PCB'
      },
      {
        id: 'q7',
        question: 'Which of the following is NOT one of the four Coffman conditions necessary for a deadlock?',
        type: 'MCQ',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Aging Preemption', 'Circular Wait'],
        correctIndex: 2,
        explanation: 'The Coffman conditions are: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. "Aging" is a solution technique used to prevent starvation, not a deadlock condition.',
        concept: 'Coffman Deadlock Conditions',
        recommendedReview: 'Module 6: Deadlocks & Recovery'
      }
    ];

    const selected = QUIZ_BANK.slice(0, Math.min(count, QUIZ_BANK.length));
    return {
      success: true,
      questions: selected,
      count: selected.length,
      source: 'LearnTube Educational Engine',
    };
  },

  // Socratic Dialogue & Interview Simulation
  socraticDialogue: async ({ topic, studentInput, history = [], mode = 'socratic_discussion', userApiKey = '' }) => {
    const effectiveApiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (effectiveApiKey) {
      try {
        const modeInstructions = {
          teach_me: 'Teach the concept patiently with step-by-step analogies. Encourage the student at each milestone.',
          socratic_discussion: 'Do NOT directly give away the full answer. Ask a thought-provoking guiding question to help the student deduce the truth.',
          interview_me: 'Act like a strict, professional FAANG senior engineering interviewer. Ask algorithmic & system trade-off questions, evaluate time complexity, and point out edge cases.',
          exam_viva: 'Act like a university professor conducting an oral viva exam. Ask precise theoretical and architectural questions.',
          debate_concept: 'Challenge the student with an alternative technical viewpoint (e.g. arguing microkernels are superior to monolithic, or UDP over TCP) and prompt them to justify their stance.'
        };

        const res = await callGeminiApi({
          apiKey: effectiveApiKey,
          systemPrompt: `You are LearnTube Socratic AI Tutor. Mode: ${mode}. ${modeInstructions[mode] || modeInstructions.socratic_discussion} Topic: ${topic}. Keep responses engaging, concise (under 150 words), and end with a direct question.`,
          userMessage: studentInput || 'Start the discussion.',
          history,
        });
        return { response: res, mode, source: 'Gemini Socratic Engine' };
      } catch (err) {
        console.warn('[Socratic AI] Gemini fallback:', err.message);
      }
    }

    // Built-in intelligent Socratic evaluation
    const lower = (studentInput || '').toLowerCase();
    let reply = '';

    if (mode === 'interview_me') {
      if (!studentInput || lower.includes('start') || lower.includes('ready')) {
        reply = `👔 **Interviewer:** Welcome. Let’s jump right in. In high-concurrency systems like NGINX or Node.js, we often prefer event-driven asynchronous I/O over thread-per-connection architectures. Explain what happens at the kernel and OS level when an application spawns 10,000 threads simultaneously.`;
      } else if (lower.includes('memory') || lower.includes('stack') || lower.includes('overhead')) {
        reply = `👔 **Interviewer:** Exactly right on memory exhaustion. Each thread allocates a 1MB to 8MB call stack, quickly consuming tens of gigabytes of RAM. But what happens to the CPU scheduler and cache locality during context switches between 10,000 threads?`;
      } else {
        reply = `👔 **Interviewer:** You touched on an interesting point. Now consider the CPU cache: when the OS kernel switches execution between thousands of threads, what happens to the L1/L2 hardware caches and the TLB (Translation Lookaside Buffer)?`;
      }
    } else if (mode === 'exam_viva') {
      if (!studentInput || lower.includes('start') || lower.includes('ready')) {
        reply = `🎓 **Professor:** Good morning. For your viva on **${topic || 'Operating Systems'}**: State Peterson's solution for the 2-process critical section problem, and tell me: does Peterson's algorithm work on modern multi-core processors with out-of-order execution?`;
      } else if (lower.includes('memory barrier') || lower.includes('hardware') || lower.includes('no')) {
        reply = `🎓 **Professor:** Very good! Modern CPUs reorder independent store and load instructions, causing Peterson's software algorithm to fail without hardware memory fences or atomic test-and-set instructions. Now, what is the difference between a Binary Semaphore and a Mutex?`;
      } else {
        reply = `🎓 **Professor:** A reasonable start. But think about memory consistency: if CPU 1 writes to a flag variable in its local cache, does CPU 2 see that write immediately without a cache coherence bus protocol?`;
      }
    } else if (mode === 'debate_concept') {
      if (!studentInput || lower.includes('start')) {
        reply = `⚔️ **Debate Partner:** I argue that Monolithic Kernels (like Linux) are fundamentally flawed and unsafe because a single buggy third-party device driver can bring down the entire operating system. Microkernels (like seL4 or QNX) are far superior. Defend Linux's monolithic architecture!`;
      } else if (lower.includes('speed') || lower.includes('performance') || lower.includes('ipc')) {
        reply = `⚔️ **Debate Partner:** You argue performance and zero IPC overhead. But in modern mission-critical systems (medical devices, spacecraft, autonomous vehicles), is a 5% speed penalty really worth sacrificing mathematical kernel verifiability? Convince me!`;
      } else {
        reply = `⚔️ **Debate Partner:** Interesting stance. But consider how message passing in microkernels requires multiple privilege switches between user space and kernel space. How does that impact latency?`;
      }
    } else {
      // Default Socratic discussion
      if (!studentInput || lower.includes('start')) {
        reply = `🤔 **Socratic Tutor:** Let's explore **${topic || 'this concept'}** together. If you were designing a multi-user computer from scratch, why can't we simply let user applications execute any CPU instruction directly, such as reading raw disk sectors? What hazard would arise?`;
      } else if (lower.includes('security') || lower.includes('crash') || lower.includes('protect')) {
        reply = `🤔 **Socratic Tutor:** Precisely. One rogue or buggy program could overwrite another user’s private data or halt the entire machine. Now, to enforce this protection in physical silicon, what hardware feature must the CPU chip itself provide?`;
      } else {
        reply = `🤔 **Socratic Tutor:** Good intuition! Now think about how the OS steps in: when your program needs to save a file, how does it safely request the privileged kernel to do that work on its behalf without having direct hardware access?`;
      }
    }

    return { response: reply, mode, source: 'LearnTube Socratic Engine' };
  },

  // Custom Learning Path Generator
  generateLearningPath: async ({ subject = 'Machine Learning', goal = 'Complete Course', level = 'Beginner', userApiKey = '' }) => {
    const effectiveApiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (effectiveApiKey) {
      try {
        const prompt = `Create a structured university-grade syllabus tree for learning "${subject}" at level "${level}" with goal "${goal}".
Output pure JSON object with format:
{
  "title": "${subject} Masterclass",
  "subject": "${subject}",
  "level": "${level}",
  "goal": "${goal}",
  "durationHours": 24,
  "description": "Comprehensive structured path...",
  "stages": [
    {
      "id": "stage-1",
      "name": "Stage Name",
      "description": "Brief description",
      "topics": ["Topic 1", "Topic 2"],
      "estimatedHours": 4
    }
  ]
}`;
        const res = await callGeminiApi({
          apiKey: effectiveApiKey,
          systemPrompt: 'You are an academic curriculum designer. Respond with pure valid JSON only.',
          userMessage: prompt,
        });
        const parsed = JSON.parse(res.replace(/```json|```/g, '').trim());
        return { success: true, path: parsed, source: 'Gemini AI' };
      } catch (err) {
        console.warn('[Path Generator] Gemini fallback:', err.message);
      }
    }

    // High quality deterministic curriculum generator
    return {
      success: true,
      source: 'LearnTube Curriculum Engine',
      path: {
        id: 'path_' + Date.now().toString(36),
        title: `${subject} — ${level} to Mastery`,
        subject,
        level,
        goal,
        durationHours: 32,
        description: `Step-by-step roadmap tailored for ${level} students seeking ${goal.toLowerCase()} with mapped university resources.`,
        stages: [
          {
            id: 'stg-1',
            name: '1. Prerequisites & Fundamental Principles',
            description: 'Core concepts, notation, terminology, and baseline mental models.',
            topics: ['Computational Foundations', 'Basic Syntax & Tooling', 'Problem Decomposition'],
            estimatedHours: 6
          },
          {
            id: 'stg-2',
            name: '2. Core Theoretical Architectures',
            description: 'Primary algorithms, data structures, and structural models.',
            topics: ['Elementary Structures', 'Control Flow Paradigms', 'Complexity Bounds'],
            estimatedHours: 8
          },
          {
            id: 'stg-3',
            name: '3. Advanced Algorithmic Patterns',
            description: 'Optimization, concurrent primitives, and real-world trade-offs.',
            topics: ['Dynamic Programming & Greedy Choices', 'Concurrency & Synchronization', 'Memory Hierarchies'],
            estimatedHours: 10
          },
          {
            id: 'stg-4',
            name: '4. Capstone Engineering Projects & Review',
            description: 'Hands-on practical implementation and university exam revision.',
            topics: ['Real-World System Implementation', 'Mock Exam Questions', 'Interview Pattern Drills'],
            estimatedHours: 8
          }
        ]
      }
    };
  }
};

// Helper: Call Google Gemini API via HTTPS
function callGeminiApi({ apiKey, systemPrompt, userMessage, history = [] }) {
  return new Promise((resolve, reject) => {
    const contents = [];

    // Add conversation history
    if (history && history.length > 0) {
      history.slice(-6).forEach((h) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text || h.content || '' }],
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: `${systemPrompt ? systemPrompt + '\n\n' : ''}Student Query: ${userMessage}` }],
    });

    const postData = JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1200,
      },
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const parsed = new URL(url);

    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          const parsedRes = JSON.parse(body);
          if (parsedRes.error) {
            return reject(new Error(parsedRes.error.message));
          }
          const text = parsedRes.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            resolve(text);
          } else {
            reject(new Error('No response text in Gemini payload'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function createSystemPrompt({ topic, videoTitle, transcript, language, persona, labels }) {
  let prompt = `You are LearnTube AI Tutor, a dedicated world-class educational AI assistant designed for university students. 
Subject/Topic: "${topic || 'Computer Science'}"
Video Title: "${videoTitle || 'Lecture'}"
Language: "${language || 'English'}"
Persona: "${persona || 'balanced'}".

Rules:
1. Ground your answers in educational accuracy. If a verified transcript is provided, quote or reference it using "${labels.groundedLesson}".
2. When explaining broader concepts beyond the video, label it clearly with "${labels.aiExplanation}".
3. Never hallucinate fake timestamps or fake quotations.
4. If asked in another language (${language}), respond fluently in that language.
5. Provide actionable exam tips and intuitive analogies.`;

  if (transcript && transcript.canGroundAi && transcript.fullText) {
    prompt += `\n\nVerified Transcript Segments:\n${transcript.fullText.substring(0, 1500)}`;
  }

  return prompt;
}
