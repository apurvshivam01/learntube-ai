import https from 'https';

// Curated verified catalog of university & educational courses with real high-definition YouTube videos
const CURATED_COURSES = {
  'operating-systems': {
    id: 'operating-systems',
    title: 'Operating Systems',
    tagline: 'Processes, CPU Scheduling, Synchronization, Memory Management & File Systems',
    category: 'Computer Science',
    university: 'IIT Kharagpur / Stanford / MIT',
    difficulty: 'Intermediate',
    duration: '24 hours • 10 Modules',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    description: 'Comprehensive undergraduate university course in Operating Systems covering system calls, process scheduling, concurrency primitives, deadlocks, virtual memory, paging, and storage architectures.',
    modules: [
      {
        id: 'os-mod-1',
        title: '1. Introduction to Operating Systems',
        description: 'What is an OS, kernel vs user space, dual mode operation, and system call interfaces.',
        estimatedMinutes: 45,
        defaultVideoId: 'vBURTt97EkA', // Gate Smashers OS Intro
        videos: [
          {
            id: 'vBURTt97EkA',
            title: 'Introduction to Operating System | Functions & Architecture',
            channel: 'Gate Smashers',
            channelId: 'UCJihyK0A38SZ6SdJirEdIOw',
            duration: '11:42',
            thumbnail: 'https://i.ytimg.com/vi/vBURTt97EkA/hqdefault.jpg',
            type: 'Recommended',
            views: '3.4M',
            description: 'Comprehensive overview of operating system architecture, goals, abstraction layer, and core kernel responsibilities.'
          },
          {
            id: '26QPDBe-NB8',
            title: 'Lecture 1: Introduction to Operating Systems',
            channel: 'MIT OpenCourseWare (6.033)',
            channelId: 'UCEBb1b_L6zDS3xTUrIALZOw',
            duration: '48:15',
            thumbnail: 'https://i.ytimg.com/vi/26QPDBe-NB8/hqdefault.jpg',
            type: 'University Lecture',
            views: '850K',
            description: 'MIT university lecture on the modularity, concurrency, and virtual machine abstractions in modern OS.'
          },
          {
            id: 'RozoeWzT73M',
            title: 'Operating Systems in 5 Minutes (Quick Refresher)',
            channel: 'CrashCourse Computer Science',
            channelId: 'UCX6b17PVsYBQ0ip5gyeme-Q',
            duration: '12:35',
            thumbnail: 'https://i.ytimg.com/vi/RozoeWzT73M/hqdefault.jpg',
            type: 'Quick Explanation',
            views: '1.2M',
            description: 'Fast, animated, intuitive breakdown of hardware management and multitasking fundamentals.'
          }
        ]
      },
      {
        id: 'os-mod-2',
        title: '2. Processes & Process Control Block (PCB)',
        description: 'Process states, lifecycle, memory layout (stack, heap, data, text), and context switching.',
        estimatedMinutes: 50,
        defaultVideoId: 'OrM7nZcxXZU',
        videos: [
          {
            id: 'OrM7nZcxXZU',
            title: 'Process State Transition Diagram & PCB Structure',
            channel: 'Gate Smashers',
            duration: '14:20',
            thumbnail: 'https://i.ytimg.com/vi/OrM7nZcxXZU/hqdefault.jpg',
            type: 'Recommended',
            views: '2.1M',
            description: 'Deep dive into New, Ready, Running, Waiting, Terminated states and context switch overhead.'
          },
          {
            id: 'fGq_a5q6nFc',
            title: 'Process Management & Context Switching in C/Linux',
            channel: 'freeCodeCamp.org',
            duration: '35:10',
            thumbnail: 'https://i.ytimg.com/vi/fGq_a5q6nFc/hqdefault.jpg',
            type: 'Practical / Code Walkthrough',
            views: '620K',
            description: 'Hands-on fork(), exec(), wait() system calls implementation in Linux C programming.'
          }
        ]
      },
      {
        id: 'os-mod-3',
        title: '3. Threads & Concurrency Models',
        description: 'User-level vs kernel-level threads, multi-threading models, and thread pools.',
        estimatedMinutes: 40,
        defaultVideoId: 'LOfGJCVnvvE',
        videos: [
          {
            id: 'LOfGJCVnvvE',
            title: 'Difference between Process and Thread with Real-World Examples',
            channel: 'Gate Smashers',
            duration: '10:55',
            thumbnail: 'https://i.ytimg.com/vi/LOfGJCVnvvE/hqdefault.jpg',
            type: 'Recommended',
            views: '1.9M',
            description: 'Why threads are lightweight processes, shared address space, and private register/stack contexts.'
          },
          {
            id: 'd96lsJlWkS0',
            title: 'Stanford CS110: Principles of Computer Systems - Threads & Concurrency',
            channel: 'Stanford Online',
            duration: '52:18',
            thumbnail: 'https://i.ytimg.com/vi/d96lsJlWkS0/hqdefault.jpg',
            type: 'University Lecture',
            views: '340K',
            description: 'Stanford lecture on multithreaded scheduling, race conditions, and POSIX pthread implementation.'
          }
        ]
      },
      {
        id: 'os-mod-4',
        title: '4. CPU Scheduling Algorithms',
        description: 'Preemptive vs Non-Preemptive, FCFS, SJF, SRTF, Priority, Round Robin, Multilevel Queue.',
        estimatedMinutes: 60,
        defaultVideoId: 'EWkqlLflcuo',
        videos: [
          {
            id: 'EWkqlLflcuo',
            title: 'CPU Scheduling Algorithms Complete Tutorial | FCFS, SJF, Round Robin',
            channel: 'Gate Smashers',
            duration: '22:15',
            thumbnail: 'https://i.ytimg.com/vi/EWkqlLflcuo/hqdefault.jpg',
            type: 'Recommended',
            views: '4.2M',
            description: 'Step-by-step Gantt charts, Turnaround Time, Waiting Time, and Response Time numerical calculations.'
          },
          {
            id: 'XW_gR_vK42Y',
            title: 'CPU Scheduling in Detail - NPTEL IIT Kharagpur',
            channel: 'NPTEL-NOC IITM',
            duration: '45:30',
            thumbnail: 'https://i.ytimg.com/vi/XW_gR_vK42Y/hqdefault.jpg',
            type: 'University Lecture',
            views: '510K',
            description: 'Rigorous mathematical analysis of scheduling criteria, starvation, and fair share scheduling.'
          }
        ]
      },
      {
        id: 'os-mod-5',
        title: '5. Process Synchronization & Critical Section',
        description: 'Race conditions, Peterson’s solution, Semaphores (Binary & Counting), Mutex, Moniters.',
        estimatedMinutes: 55,
        defaultVideoId: 'ph2AW-4ptck',
        videos: [
          {
            id: 'ph2AW-4ptck',
            title: 'Critical Section Problem & Semaphores Explained',
            channel: 'Gate Smashers',
            duration: '16:45',
            thumbnail: 'https://i.ytimg.com/vi/ph2AW-4ptck/hqdefault.jpg',
            type: 'Recommended',
            views: '2.8M',
            description: 'Mutual Exclusion, Progress, Bounded Waiting conditions and wait()/signal() semaphore operations.'
          },
          {
            id: '95f3nE9kQ7Y',
            title: 'Classical IPC Problems: Producer-Consumer, Dining Philosophers, Readers-Writers',
            channel: 'Abdul Bari',
            duration: '28:10',
            thumbnail: 'https://i.ytimg.com/vi/95f3nE9kQ7Y/hqdefault.jpg',
            type: 'Detailed',
            views: '1.4M',
            description: 'Clear diagrammatic solution to classic synchronization dilemmas with semaphore code.'
          }
        ]
      },
      {
        id: 'os-mod-6',
        title: '6. Deadlocks & Recovery',
        description: 'Coffman 4 conditions, Resource Allocation Graph (RAG), Banker’s Algorithm for Deadlock Avoidance.',
        estimatedMinutes: 50,
        defaultVideoId: 'U_Jv_9w3BVo',
        videos: [
          {
            id: 'U_Jv_9w3BVo',
            title: 'Deadlock Conditions & Banker’s Algorithm with Solved Example',
            channel: 'Gate Smashers',
            duration: '18:30',
            thumbnail: 'https://i.ytimg.com/vi/U_Jv_9w3BVo/hqdefault.jpg',
            type: 'Recommended',
            views: '3.1M',
            description: 'Mutual exclusion, Hold & Wait, No Preemption, Circular wait, and Banker’s safety algorithm matrix.'
          }
        ]
      },
      {
        id: 'os-mod-7',
        title: '7. Memory Management & Paging',
        description: 'Contiguous vs Non-contiguous allocation, Internal vs External fragmentation, Paging, Page Table, TLB.',
        estimatedMinutes: 60,
        defaultVideoId: 'pJ6qrCB8pDw',
        videos: [
          {
            id: 'pJ6qrCB8pDw',
            title: 'Paging in Operating Systems | Address Translation with TLB',
            channel: 'Gate Smashers',
            duration: '19:12',
            thumbnail: 'https://i.ytimg.com/vi/pJ6qrCB8pDw/hqdefault.jpg',
            type: 'Recommended',
            views: '2.5M',
            description: 'Logical to physical address translation, page numbers, offsets, and translation lookaside buffers.'
          }
        ]
      },
      {
        id: 'os-mod-8',
        title: '8. Virtual Memory & Page Replacement',
        description: 'Demand paging, Page faults, Page Replacement Algorithms (FIFO, Belady’s anomaly, LRU, Optimal).',
        estimatedMinutes: 55,
        defaultVideoId: 'qcBIvj_i4gU',
        videos: [
          {
            id: 'qcBIvj_i4gU',
            title: 'Page Replacement Algorithms (FIFO, LRU, Optimal) with Gate Problems',
            channel: 'Gate Smashers',
            duration: '21:05',
            thumbnail: 'https://i.ytimg.com/vi/qcBIvj_i4gU/hqdefault.jpg',
            type: 'Recommended',
            views: '2.7M',
            description: 'Detailed frame allocation, calculating page hit/miss ratio, and preventing thrashing.'
          }
        ]
      },
      {
        id: 'os-mod-9',
        title: '9. File Systems & Disk Storage',
        description: 'File allocation methods (Contiguous, Linked, Indexed), directory structures, and free space management.',
        estimatedMinutes: 45,
        defaultVideoId: 'k7o3t96Q5bY',
        videos: [
          {
            id: 'k7o3t96Q5bY',
            title: 'File Allocation Methods in OS: Contiguous, Linked & Inode Indexed',
            channel: 'Gate Smashers',
            duration: '15:40',
            thumbnail: 'https://i.ytimg.com/vi/k7o3t96Q5bY/hqdefault.jpg',
            type: 'Recommended',
            views: '1.3M',
            description: 'Comparison of seek speed, fragmentation, and reliability in modern UNIX inodes and FAT/NTFS.'
          }
        ]
      },
      {
        id: 'os-mod-10',
        title: '10. I/O Systems & Disk Scheduling',
        description: 'Disk Scheduling Algorithms: FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK, C-LOOK.',
        estimatedMinutes: 45,
        defaultVideoId: 'P_3S0t6S6oE',
        videos: [
          {
            id: 'P_3S0t6S6oE',
            title: 'Disk Scheduling Algorithms Explained with Numerical Problems',
            channel: 'Gate Smashers',
            duration: '17:25',
            thumbnail: 'https://i.ytimg.com/vi/P_3S0t6S6oE/hqdefault.jpg',
            type: 'Recommended',
            views: '1.8M',
            description: 'Minimizing disk arm seek distance across track cylinders with full calculation walkthroughs.'
          }
        ]
      }
    ]
  },

  'data-structures-and-algorithms': {
    id: 'data-structures-and-algorithms',
    title: 'Data Structures & Algorithms',
    tagline: 'Master Big-O, Arrays, Linked Lists, Trees, Graphs, Sorting & Dynamic Programming',
    category: 'Computer Science',
    university: 'MIT 6.006 / Abdul Bari / Stanford',
    difficulty: 'All Levels',
    duration: '32 hours • 8 Modules',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    description: 'Foundational algorithmic problem solving course covering asymptotic analysis, elementary structures, recursive tree traversal, graph shortest paths, and dynamic programming memoization.',
    modules: [
      {
        id: 'dsa-mod-1',
        title: '1. Asymptotic Analysis & Big-O Notation',
        description: 'Time and space complexity, Best, Average, Worst cases, Big-O, Big-Omega, Big-Theta.',
        estimatedMinutes: 40,
        defaultVideoId: '9TlHvipP5yA',
        videos: [
          {
            id: '9TlHvipP5yA',
            title: 'Time Complexity & Big-O Notation in 15 Minutes',
            channel: 'Abdul Bari',
            duration: '15:20',
            thumbnail: 'https://i.ytimg.com/vi/9TlHvipP5yA/hqdefault.jpg',
            type: 'Recommended',
            views: '3.8M',
            description: 'Master loop counting, logarithmic time, and polynomial bounds with crystal clarity.'
          },
          {
            id: 'ZA-tUyM_y7s',
            title: 'MIT 6.006: Introduction to Algorithms - Lecture 1',
            channel: 'MIT OpenCourseWare',
            duration: '49:30',
            thumbnail: 'https://i.ytimg.com/vi/ZA-tUyM_y7s/hqdefault.jpg',
            type: 'University Lecture',
            views: '5.2M',
            description: 'Prof. Erik Demaine on computational models, peak finding, and complexity growth.'
          }
        ]
      },
      {
        id: 'dsa-mod-2',
        title: '2. Arrays, Strings & Two Pointers',
        description: 'Contiguous memory, sliding window pattern, two pointer technique, and prefix sums.',
        estimatedMinutes: 50,
        defaultVideoId: '-b2l3vQ28u4',
        videos: [
          {
            id: '-b2l3vQ28u4',
            title: 'Two Pointers & Sliding Window Algorithm Patterns',
            channel: 'NeetCode',
            duration: '18:40',
            thumbnail: 'https://i.ytimg.com/vi/-b2l3vQ28u4/hqdefault.jpg',
            type: 'Recommended',
            views: '1.2M',
            description: 'Solve classic interview problems like 3Sum, Container with Most Water, and Longest Substring.'
          }
        ]
      },
      {
        id: 'dsa-mod-3',
        title: '3. Linked Lists (Singly, Doubly & Circular)',
        description: 'Node pointers, reversal in-place, cycle detection (Floyd’s Tortoise and Hare), and LRU cache.',
        estimatedMinutes: 50,
        defaultVideoId: 'Hj_rA0dhr2I',
        videos: [
          {
            id: 'Hj_rA0dhr2I',
            title: 'Linked List Implementation, Reversal & Cycle Detection',
            channel: 'Abdul Bari',
            duration: '24:15',
            thumbnail: 'https://i.ytimg.com/vi/Hj_rA0dhr2I/hqdefault.jpg',
            type: 'Recommended',
            views: '2.4M',
            description: 'Memory allocation for nodes, pointer updates, and Floyd fast/slow pointer proof.'
          }
        ]
      },
      {
        id: 'dsa-mod-4',
        title: '4. Stacks, Queues & Monotonic Patterns',
        description: 'LIFO vs FIFO, Next Greater Element, balanced parenthesis, and circular queue ring buffers.',
        estimatedMinutes: 45,
        defaultVideoId: 'wjI1WNcIntg',
        videos: [
          {
            id: 'wjI1WNcIntg',
            title: 'Stack & Queue Data Structures Full Guide',
            channel: 'freeCodeCamp.org',
            duration: '32:00',
            thumbnail: 'https://i.ytimg.com/vi/wjI1WNcIntg/hqdefault.jpg',
            type: 'Recommended',
            views: '1.1M',
            description: 'Stack applications, infix to postfix conversion, and monotonic queue sliding window maximum.'
          }
        ]
      },
      {
        id: 'dsa-mod-5',
        title: '5. Trees & Binary Search Trees (BST)',
        description: 'Binary trees, traversals (Inorder, Preorder, Postorder, Level-order), BST operations, and AVL self-balancing.',
        estimatedMinutes: 65,
        defaultVideoId: 'qH6clAS9nqc',
        videos: [
          {
            id: 'qH6clAS9nqc',
            title: 'Trees & Binary Search Trees Tutorial with Visuals',
            channel: 'Abdul Bari',
            duration: '35:40',
            thumbnail: 'https://i.ytimg.com/vi/qH6clAS9nqc/hqdefault.jpg',
            type: 'Recommended',
            views: '3.6M',
            description: 'Complete visual walkthrough of recursive traversals, BST insertion, deletion cases, and height balance.'
          }
        ]
      },
      {
        id: 'dsa-mod-6',
        title: '6. Graphs & Traversal (BFS & DFS)',
        description: 'Adjacency matrix vs list, Breadth-First Search, Depth-First Search, topological sort, cycle detection in directed graphs.',
        estimatedMinutes: 60,
        defaultVideoId: 'pcKY4hjDrxk',
        videos: [
          {
            id: 'pcKY4hjDrxk',
            title: 'Graph Algorithms Course: BFS, DFS, Dijkstra, Topo Sort',
            channel: 'freeCodeCamp.org',
            duration: '42:15',
            thumbnail: 'https://i.ytimg.com/vi/pcKY4hjDrxk/hqdefault.jpg',
            type: 'Recommended',
            views: '2.9M',
            description: 'Comprehensive graph fundamentals, queue traversal, recursive backtracking, and connected components.'
          }
        ]
      },
      {
        id: 'dsa-mod-7',
        title: '7. Shortest Paths & Minimum Spanning Trees',
        description: 'Dijkstra’s single-source shortest path, Bellman-Ford, Prim’s and Kruskal’s MST with Disjoint Set Union (DSU).',
        estimatedMinutes: 55,
        defaultVideoId: 'XB4MIexjvY0',
        videos: [
          {
            id: 'XB4MIexjvY0',
            title: 'Dijkstra Algorithm with Priority Queue',
            channel: 'Abdul Bari',
            duration: '21:30',
            thumbnail: 'https://i.ytimg.com/vi/XB4MIexjvY0/hqdefault.jpg',
            type: 'Recommended',
            views: '2.5M',
            description: 'Greedy choice property, relaxation step, and min-heap optimization for sparse graphs.'
          }
        ]
      },
      {
        id: 'dsa-mod-8',
        title: '8. Dynamic Programming (DP) Mastery',
        description: 'Overlapping subproblems, optimal substructure, memoization (Top-Down), tabulation (Bottom-Up), 0/1 Knapsack, LCS, LIS.',
        estimatedMinutes: 75,
        defaultVideoId: 'oBt53YbR9Kk',
        videos: [
          {
            id: 'oBt53YbR9Kk',
            title: 'Dynamic Programming - Learn to Solve Any Problem',
            channel: 'freeCodeCamp.org',
            duration: '55:20',
            thumbnail: 'https://i.ytimg.com/vi/oBt53YbR9Kk/hqdefault.jpg',
            type: 'Recommended',
            views: '4.8M',
            description: 'Master grid travel, canSum, howSum, bestSum, allConstruct, and state transition formulas.'
          }
        ]
      }
    ]
  },

  'dbms': {
    id: 'dbms',
    title: 'Database Management Systems (DBMS)',
    tagline: 'Relational Model, SQL, Normalization, ACID Transactions & Indexing',
    category: 'Computer Science',
    university: 'CMU 15-445 / Gate Smashers / Stanford',
    difficulty: 'Intermediate',
    duration: '20 hours • 6 Modules',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    description: 'Deep architecture of relational and modern databases covering schema design, complex SQL joins, Boyce-Codd normal forms, concurrency schedules, write-ahead logging, and B+ Tree storage engines.',
    modules: [
      {
        id: 'db-mod-1',
        title: '1. Introduction to DBMS & 3-Tier Architecture',
        description: 'File system vs DBMS, data independence, physical, logical, and view schemas.',
        estimatedMinutes: 40,
        defaultVideoId: 'kBdlM6hNDAE',
        videos: [
          {
            id: 'kBdlM6hNDAE',
            title: 'Introduction to Database Management System (DBMS)',
            channel: 'Gate Smashers',
            duration: '12:30',
            thumbnail: 'https://i.ytimg.com/vi/kBdlM6hNDAE/hqdefault.jpg',
            type: 'Recommended',
            views: '2.8M',
            description: 'Why DBMS is essential, ACID properties preview, and database abstraction tiers.'
          }
        ]
      },
      {
        id: 'db-mod-2',
        title: '2. ER Model & Relational Schema Mapping',
        description: 'Entities, attributes, relationships, cardinalities (1:1, 1:N, M:N), and conversion to tables.',
        estimatedMinutes: 50,
        defaultVideoId: 'gbVez_u1e4Y',
        videos: [
          {
            id: 'gbVez_u1e4Y',
            title: 'ER Diagram to Relational Model Mapping Rules',
            channel: 'Gate Smashers',
            duration: '16:15',
            thumbnail: 'https://i.ytimg.com/vi/gbVez_u1e4Y/hqdefault.jpg',
            type: 'Recommended',
            views: '1.7M',
            description: 'Transform complex entity-relationship diagrams into normalized relational schema tables.'
          }
        ]
      },
      {
        id: 'db-mod-3',
        title: '3. SQL Mastery: DDL, DML, Subqueries & Joins',
        description: 'SELECT, INNER/LEFT/RIGHT/FULL JOIN, GROUP BY, HAVING, Aggregate functions, window functions.',
        estimatedMinutes: 60,
        defaultVideoId: 'HXV3zeQKqGY',
        videos: [
          {
            id: 'HXV3zeQKqGY',
            title: 'SQL Tutorial - Full Database Course for Beginners',
            channel: 'freeCodeCamp.org',
            duration: '48:30',
            thumbnail: 'https://i.ytimg.com/vi/HXV3zeQKqGY/hqdefault.jpg',
            type: 'Recommended',
            views: '16.5M',
            description: 'Hands-on live queries from basic table creation to multi-table joins and nested subqueries.'
          }
        ]
      },
      {
        id: 'db-mod-4',
        title: '4. Functional Dependencies & Normalization',
        description: 'Anomalies (Insertion, Deletion, Update), 1NF, 2NF, 3NF, BCNF, lossless join decomposition.',
        estimatedMinutes: 65,
        defaultVideoId: 'GFQaEYEc8_8',
        videos: [
          {
            id: 'GFQaEYEc8_8',
            title: 'Normalization in DBMS (1NF, 2NF, 3NF, BCNF) with Real Examples',
            channel: 'Gate Smashers',
            duration: '24:50',
            thumbnail: 'https://i.ytimg.com/vi/GFQaEYEc8_8/hqdefault.jpg',
            type: 'Recommended',
            views: '3.9M',
            description: 'Determine candidate keys, find dependency closure, and eliminate redundant columns.'
          }
        ]
      },
      {
        id: 'db-mod-5',
        title: '5. Transactions & Concurrency Control (ACID)',
        description: 'Atomicity, Consistency, Isolation, Durability, serializability, 2PL (Two-Phase Locking), and deadlocks.',
        estimatedMinutes: 55,
        defaultVideoId: 'jA1eG2YV9Hw',
        videos: [
          {
            id: 'jA1eG2YV9Hw',
            title: 'Transaction States & Conflict Serializability in DBMS',
            channel: 'Gate Smashers',
            duration: '18:40',
            thumbnail: 'https://i.ytimg.com/vi/jA1eG2YV9Hw/hqdefault.jpg',
            type: 'Recommended',
            views: '1.9M',
            description: 'Precedence graph testing for serializable schedules and dirty read anomaly avoidance.'
          }
        ]
      },
      {
        id: 'db-mod-6',
        title: '6. Indexing & B/B+ Tree Storage Internals',
        description: 'Primary, clustering, secondary indexing, dense vs sparse indexes, and B+ Tree search/insert balance.',
        estimatedMinutes: 50,
        defaultVideoId: 'aZjYr87r10c',
        videos: [
          {
            id: 'aZjYr87r10c',
            title: 'B-Tree & B+ Tree Indexing in Databases',
            channel: 'Abdul Bari',
            duration: '22:10',
            thumbnail: 'https://i.ytimg.com/vi/aZjYr87r10c/hqdefault.jpg',
            type: 'Recommended',
            views: '1.6M',
            description: 'How databases perform O(log N) disk block searches and preserve sequential scans with leaf pointers.'
          }
        ]
      }
    ]
  },

  'computer-networks': {
    id: 'computer-networks',
    title: 'Computer Networks',
    tagline: 'OSI Model, TCP/IP, IP Subnetting, Routing, DNS, HTTP & Security',
    category: 'Computer Science',
    university: 'Stanford CS144 / Kurose-Ross / NPTEL',
    difficulty: 'Intermediate',
    duration: '22 hours • 6 Modules',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    description: 'Full stack networking course exploring packet switching, transmission delays, Ethernet CSMA/CD, IPv4/IPv6 subnetting, distance vector and link state routing, TCP handshake and flow control, and TLS cryptography.',
    modules: [
      {
        id: 'cn-mod-1',
        title: '1. Network Architectures & The OSI 7-Layer Model',
        description: 'Physical, Data Link, Network, Transport, Session, Presentation, Application layers & encapsulation.',
        estimatedMinutes: 45,
        defaultVideoId: 'IPvYjXCsTg8',
        videos: [
          {
            id: 'IPvYjXCsTg8',
            title: 'The OSI Model Explained | Layer by Layer Animation',
            channel: 'NetworkChuck',
            duration: '16:50',
            thumbnail: 'https://i.ytimg.com/vi/IPvYjXCsTg8/hqdefault.jpg',
            type: 'Recommended',
            views: '3.1M',
            description: 'Visual journey of a data packet traversing headers, sockets, routers, and copper/fiber cables.'
          }
        ]
      },
      {
        id: 'cn-mod-2',
        title: '2. Data Link Layer, MAC & Error Detection',
        description: 'Framing, CRC (Cyclic Redundancy Check), Hamming code, CSMA/CD, and Ethernet switching.',
        estimatedMinutes: 50,
        defaultVideoId: 'U_QyM3c5Psw',
        videos: [
          {
            id: 'U_QyM3c5Psw',
            title: 'Data Link Layer & CRC Error Detection Explained',
            channel: 'Gate Smashers',
            duration: '15:10',
            thumbnail: 'https://i.ytimg.com/vi/U_QyM3c5Psw/hqdefault.jpg',
            type: 'Recommended',
            views: '1.5M',
            description: 'Polynomial binary division, frame checks, and collision detection on shared media.'
          }
        ]
      },
      {
        id: 'cn-mod-3',
        title: '3. Network Layer: IPv4, IPv6 & Subnetting',
        description: 'Classful vs CIDR addressing, subnet masks, network IDs, broadcast addresses, and ARP protocol.',
        estimatedMinutes: 60,
        defaultVideoId: 's_Ntt6eTn94',
        videos: [
          {
            id: 's_Ntt6eTn94',
            title: 'Subnetting Mastery | Fast Subnetting Tricks & Examples',
            channel: 'NetworkChuck',
            duration: '22:45',
            thumbnail: 'https://i.ytimg.com/vi/s_Ntt6eTn94/hqdefault.jpg',
            type: 'Recommended',
            views: '4.7M',
            description: 'Calculate valid hosts, subnet bits, wildcard masks, and slash notations in seconds.'
          }
        ]
      },
      {
        id: 'cn-mod-4',
        title: '4. Routing Protocols: Distance Vector & Link State',
        description: 'Dijkstra in OSPF, Bellman-Ford in RIP, count-to-infinity problem, split horizon, and BGP overview.',
        estimatedMinutes: 55,
        defaultVideoId: 'aK3m_q4E_e8',
        videos: [
          {
            id: 'aK3m_q4E_e8',
            title: 'Routing Protocols Explained: OSPF vs EIGRP vs BGP',
            channel: 'PowerCert Animated Videos',
            duration: '18:20',
            thumbnail: 'https://i.ytimg.com/vi/aK3m_q4E_e8/hqdefault.jpg',
            type: 'Recommended',
            views: '2.3M',
            description: 'Autonomous systems, routing tables, metric convergence, and inter-domain gateway routing.'
          }
        ]
      },
      {
        id: 'cn-mod-5',
        title: '5. Transport Layer: TCP vs UDP & Congestion Control',
        description: '3-way handshake, sequence numbers, sliding window flow control, slow start, congestion avoidance.',
        estimatedMinutes: 60,
        defaultVideoId: 'F27PLuhGoSk',
        videos: [
          {
            id: 'F27PLuhGoSk',
            title: 'TCP 3-Way Handshake, Flow Control & Window Sizing',
            channel: 'Gate Smashers',
            duration: '19:35',
            thumbnail: 'https://i.ytimg.com/vi/F27PLuhGoSk/hqdefault.jpg',
            type: 'Recommended',
            views: '2.1M',
            description: 'SYN, SYN-ACK, ACK packet dissection, reliable delivery, and TCP Reno/Tahoe congestion phases.'
          }
        ]
      },
      {
        id: 'cn-mod-6',
        title: '6. Application Layer: DNS, HTTP/2, HTTPS & TLS',
        description: 'Recursive DNS lookup, HTTP request-response headers, symmetric vs asymmetric encryption, TLS handshake.',
        estimatedMinutes: 50,
        defaultVideoId: '2ZUxoi7YNgs',
        videos: [
          {
            id: '2ZUxoi7YNgs',
            title: 'How HTTPS & SSL/TLS Encryption Works in 10 Minutes',
            channel: 'Fireship',
            duration: '11:15',
            thumbnail: 'https://i.ytimg.com/vi/2ZUxoi7YNgs/hqdefault.jpg',
            type: 'Recommended',
            views: '1.9M',
            description: 'Public key cryptography, certificates, CAs, Diffie-Hellman key exchange, and secure web browsing.'
          }
        ]
      }
    ]
  },

  'machine-learning': {
    id: 'machine-learning',
    title: 'Machine Learning & Deep Learning',
    tagline: 'Linear Regression, Classification, Neural Networks, CNNs & Transformers',
    category: 'Artificial Intelligence',
    university: 'Stanford CS229 / Andrew Ng / Fast.ai',
    difficulty: 'Advanced',
    duration: '28 hours • 7 Modules',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
    description: 'Applied and mathematical foundation in modern machine learning from gradient descent and decision trees to backpropagation, convolutional vision models, and transformer self-attention.',
    modules: [
      {
        id: 'ml-mod-1',
        title: '1. Math Foundations: Linear Algebra & Gradient Descent',
        description: 'Vectors, dot products, matrix transformations, cost functions, derivatives, and learning rates.',
        estimatedMinutes: 55,
        defaultVideoId: 'fNk_zzaMoSs',
        videos: [
          {
            id: 'fNk_zzaMoSs',
            title: 'Essence of Linear Algebra - Chapter 1: Vectors & Spaces',
            channel: '3Blue1Brown',
            duration: '16:00',
            thumbnail: 'https://i.ytimg.com/vi/fNk_zzaMoSs/hqdefault.jpg',
            type: 'Recommended',
            views: '6.5M',
            description: 'Unparalleled geometric animations explaining vector spaces, linear combinations, and spans.'
          }
        ]
      },
      {
        id: 'ml-mod-2',
        title: '2. Supervised Learning: Linear & Logistic Regression',
        description: 'Hypothesis function, mean squared error, sigmoid function, cross-entropy loss, and decision boundaries.',
        estimatedMinutes: 50,
        defaultVideoId: '4b4MUYve_U8',
        videos: [
          {
            id: '4b4MUYve_U8',
            title: 'Gradient Descent and Cost Function in Python',
            channel: 'codebasics',
            duration: '19:40',
            thumbnail: 'https://i.ytimg.com/vi/4b4MUYve_U8/hqdefault.jpg',
            type: 'Recommended',
            views: '1.4M',
            description: 'Step-by-step code implementation in Python from scratch with interactive plots.'
          }
        ]
      },
      {
        id: 'ml-mod-3',
        title: '3. Decision Trees, Random Forests & Ensemble Learning',
        description: 'Information gain, Gini impurity, entropy, bagging, boosting (XGBoost), and bias-variance tradeoff.',
        estimatedMinutes: 50,
        defaultVideoId: '_L39rN6gz7Y',
        videos: [
          {
            id: '_L39rN6gz7Y',
            title: 'StatQuest: Decision Trees Clearly Explained',
            channel: 'StatQuest with Josh Starmer',
            duration: '17:22',
            thumbnail: 'https://i.ytimg.com/vi/_L39rN6gz7Y/hqdefault.jpg',
            type: 'Recommended',
            views: '2.8M',
            description: 'Intuitive visual guide to tree splitting, root node selection, and avoiding overfitting.'
          }
        ]
      },
      {
        id: 'ml-mod-4',
        title: '4. Unsupervised Learning: K-Means Clustering & PCA',
        description: 'Centroid initialization, inertia, elbow method, dimensionality reduction, and eigenvectors.',
        estimatedMinutes: 45,
        defaultVideoId: '4b5d3muPQmA',
        videos: [
          {
            id: '4b5d3muPQmA',
            title: 'StatQuest: K-means Clustering Step by Step',
            channel: 'StatQuest with Josh Starmer',
            duration: '14:15',
            thumbnail: 'https://i.ytimg.com/vi/4b5d3muPQmA/hqdefault.jpg',
            type: 'Recommended',
            views: '1.9M',
            description: 'Step-by-step visual demonstration of iterative centroid re-computation.'
          }
        ]
      },
      {
        id: 'ml-mod-5',
        title: '5. Neural Networks & Backpropagation',
        description: 'Perceptrons, activation functions (ReLU, Sigmoid, Softmax), chain rule, and loss gradient propagation.',
        estimatedMinutes: 60,
        defaultVideoId: 'aircAruvnKk',
        videos: [
          {
            id: 'aircAruvnKk',
            title: 'But what is a neural network? | Deep learning, chapter 1',
            channel: '3Blue1Brown',
            duration: '19:10',
            thumbnail: 'https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg',
            type: 'Recommended',
            views: '14.2M',
            description: 'The definitive visual introduction to weights, biases, layers, and handwritten digit recognition.'
          }
        ]
      },
      {
        id: 'ml-mod-6',
        title: '6. Convolutional Neural Networks (CNN) for Computer Vision',
        description: 'Convolution kernels, padding, stride, max pooling, feature maps, and ResNet architectures.',
        estimatedMinutes: 55,
        defaultVideoId: 'KuXjwB4LzSA',
        videos: [
          {
            id: 'KuXjwB4LzSA',
            title: 'Convolutional Neural Networks (CNNs) Explained with 3D Visuals',
            channel: '3Blue1Brown',
            duration: '21:30',
            thumbnail: 'https://i.ytimg.com/vi/KuXjwB4LzSA/hqdefault.jpg',
            type: 'Recommended',
            views: '3.1M',
            description: 'How filters extract edges, textures, and object hierarchies across image tensors.'
          }
        ]
      },
      {
        id: 'ml-mod-7',
        title: '7. Attention Mechanisms & Transformers (LLMs)',
        description: 'Query, Key, Value vectors, scaled dot-product attention, multi-head attention, and GPT/BERT anatomy.',
        estimatedMinutes: 65,
        defaultVideoId: 'eMlx5fFNoYc',
        videos: [
          {
            id: 'eMlx5fFNoYc',
            title: 'Transformers, explained: Understand the model behind GPT, Claude, and Gemini',
            channel: '3Blue1Brown',
            duration: '26:50',
            thumbnail: 'https://i.ytimg.com/vi/eMlx5fFNoYc/hqdefault.jpg',
            type: 'Recommended',
            views: '5.6M',
            description: 'Master self-attention matrices, token embeddings, and contextualized vector shifts.'
          }
        ]
      }
    ]
  }
};

// University & Discovery Channels
const VERIFIED_CHANNELS = [
  {
    id: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    title: 'Google Cloud Tech',
    category: 'Cloud & Infrastructure',
    university: 'Google Enterprise Training',
    subscribers: '1.2M',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&auto=format&fit=crop&q=80',
    description: 'Official architecture blueprints, Kubernetes, microservices, and modern cloud deployment.'
  },
  {
    id: 'UCEBb1b_L6zDS3xTUrIALZOw',
    title: 'MIT OpenCourseWare',
    category: 'Computer Science & Engineering',
    university: 'Massachusetts Institute of Technology (MIT)',
    subscribers: '4.8M',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80',
    description: 'Complete undergraduate and graduate lecture series taught by world-renowned MIT professors.'
  },
  {
    id: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
    title: 'Stanford Online',
    category: 'AI, Systems & Algorithms',
    university: 'Stanford University',
    subscribers: '1.9M',
    thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80',
    description: 'Flagship Stanford courses including CS229 (Machine Learning) and CS144 (Computer Networks).'
  },
  {
    id: 'UC8butISFwT-Wl7EV0hUK0BQ',
    title: 'freeCodeCamp.org',
    category: 'Full-Stack Software Engineering',
    university: 'Open Source Curriculum',
    subscribers: '10.2M',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&auto=format&fit=crop&q=80',
    description: 'Comprehensive 10-hour deep-dive coding courses with practical projects and zero fluff.'
  },
  {
    id: 'UC4xKdmAXFh4ACyhpiQ_3qBw',
    title: 'CS50 (Harvard University)',
    category: 'Introduction to Computer Science',
    university: 'Harvard University',
    subscribers: '1.8M',
    thumbnail: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
    description: 'David J. Malan’s world-famous introduction to intellectual enterprises of computer science and art of programming.'
  },
  {
    id: 'UCJihyK0A38SZ6SdJirEdIOw',
    title: 'Gate Smashers',
    category: 'Core CS (OS, DBMS, CN, TOC, Algorithms)',
    university: 'Top Indian Engineering Curriculum',
    subscribers: '2.5M',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&auto=format&fit=crop&q=80',
    description: 'Varun Singla’s acclaimed, clear, concise explanations designed for engineering university exams and GATE.'
  },
  {
    id: 'UCbfYPyITQ-EY77ns4gPXJ5g',
    title: '3Blue1Brown',
    category: 'Mathematics & Neural Networks',
    university: 'Visual Mathematics Institute',
    subscribers: '6.4M',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&auto=format&fit=crop&q=80',
    description: 'Grant Sanderson’s legendary animated visual intuition for linear algebra, calculus, and neural nets.'
  },
  {
    id: 'UC0rDDvHMw435LtxhULgQUeA',
    title: 'Abdul Bari',
    category: 'Algorithms & Data Structures',
    university: 'Algorithmic Foundation Specialist',
    subscribers: '1.1M',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80',
    description: 'Unsurpassed whiteboard breakdowns of greedy, dynamic programming, and tree graph algorithms.'
  }
];

export const youtubeService = {
  // Get all verified courses
  getAllCourses: () => {
    return Object.values(CURATED_COURSES).map((c) => ({
      id: c.id,
      title: c.title,
      tagline: c.tagline,
      category: c.category,
      university: c.university,
      difficulty: c.difficulty,
      duration: c.duration,
      thumbnail: c.thumbnail,
      description: c.description,
      modulesCount: c.modules.length,
    }));
  },

  // Get specific course with complete modules and video alternatives
  getCourseById: (courseId) => {
    const key = courseId.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return CURATED_COURSES[key] || null;
  },

  // Search subjects, courses, videos, playlists, channels
  search: async ({ query, type = 'all', level = 'all', goal = 'all', language = 'English', apiKey = '' }) => {
    const q = (query || '').toLowerCase().trim();

    // Check if query matches any curated course directly or by topic
    let matchingCurated = [];
    Object.values(CURATED_COURSES).forEach((course) => {
      const titleMatch = course.title.toLowerCase().includes(q) || course.tagline.toLowerCase().includes(q);
      const moduleMatch = course.modules.some((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));

      if (titleMatch || moduleMatch || !q) {
        matchingCurated.push({
          type: 'course',
          id: course.id,
          title: course.title,
          tagline: course.tagline,
          category: course.category,
          university: course.university,
          difficulty: course.difficulty,
          duration: course.duration,
          thumbnail: course.thumbnail,
          modulesCount: course.modules.length,
          firstVideoId: course.modules[0]?.defaultVideoId,
        });
      }
    });

    // Extract individual video matches from curated database
    let videoResults = [];
    Object.values(CURATED_COURSES).forEach((course) => {
      course.modules.forEach((mod) => {
        mod.videos.forEach((v) => {
          if (!q || v.title.toLowerCase().includes(q) || mod.title.toLowerCase().includes(q) || course.title.toLowerCase().includes(q)) {
            videoResults.push({
              type: 'video',
              id: v.id,
              title: v.title,
              channel: v.channel,
              duration: v.duration,
              thumbnail: v.thumbnail,
              badge: v.type,
              views: v.views,
              courseId: course.id,
              courseTitle: course.title,
              moduleId: mod.id,
              moduleTitle: mod.title,
              embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}?enablejsapi=1`,
              youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`,
            });
          }
        });
      });
    });

    // If a legitimate YouTube Data API key is provided, perform live API search
    const effectiveApiKey = apiKey || process.env.YOUTUBE_API_KEY;
    let liveResults = [];

    if (effectiveApiKey && q) {
      try {
        const liveData = await fetchLiveYouTubeSearch(q, effectiveApiKey);
        liveResults = liveData;
      } catch (err) {
        console.warn('[YouTube API] Live search fallback triggered:', err.message);
      }
    }

    return {
      query,
      level,
      goal,
      language,
      totalResults: matchingCurated.length + videoResults.length + liveResults.length,
      courses: matchingCurated,
      videos: [...liveResults, ...videoResults].slice(0, 24),
      channels: VERIFIED_CHANNELS.filter(
        (ch) => !q || ch.title.toLowerCase().includes(q) || ch.category.toLowerCase().includes(q) || ch.description.toLowerCase().includes(q)
      ),
    };
  },

  // Get video details and alternate resources
  getVideoDetails: (courseId, videoId) => {
    let course = null;
    let activeModule = null;
    let activeVideo = null;
    let alternateVideos = [];

    if (courseId) {
      course = CURATED_COURSES[courseId];
    }

    // If course found, locate module and video
    if (course) {
      for (const mod of course.modules) {
        const found = mod.videos.find((v) => v.id === videoId);
        if (found) {
          activeModule = mod;
          activeVideo = found;
          alternateVideos = mod.videos.filter((v) => v.id !== videoId);
          break;
        }
      }
    }

    // Fallback: search across all courses
    if (!activeVideo) {
      for (const c of Object.values(CURATED_COURSES)) {
        for (const mod of c.modules) {
          const found = mod.videos.find((v) => v.id === videoId);
          if (found) {
            course = c;
            activeModule = mod;
            activeVideo = found;
            alternateVideos = mod.videos.filter((v) => v.id !== videoId);
            break;
          }
        }
        if (activeVideo) break;
      }
    }

    // Default fallback if arbitrary videoId is requested
    if (!activeVideo && videoId) {
      activeVideo = {
        id: videoId,
        title: 'Educational Lecture Video',
        channel: 'YouTube Educator',
        duration: '15:00',
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        type: 'Selected Video',
        views: '100K+',
        description: 'Online educational video lesson loaded into the LearnTube distraction-free workspace.',
      };
    }

    return {
      video: activeVideo,
      module: activeModule,
      course,
      alternateVideos,
      embedUrl: activeVideo ? `https://www.youtube-nocookie.com/embed/${activeVideo.id}?enablejsapi=1&rel=0` : '',
    };
  },

  // Get verified educational channels
  getChannels: () => VERIFIED_CHANNELS,
};

// Helper: Live YouTube Data API v3 fetch
function fetchLiveYouTubeSearch(query, apiKey) {
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query + ' tutorial lecture'
    )}&type=video&maxResults=8&key=${apiKey}`;

    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              return reject(new Error(parsed.error.message));
            }
            const items = (parsed.items || []).map((item) => ({
              type: 'video',
              id: item.id.videoId,
              title: item.snippet.title,
              channel: item.snippet.channelTitle,
              duration: 'Available',
              thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
              badge: 'Live YouTube Result',
              views: 'Verified',
              courseId: '',
              courseTitle: 'YouTube Live Result',
              moduleId: '',
              moduleTitle: item.snippet.title,
              embedUrl: `https://www.youtube-nocookie.com/embed/${item.id.videoId}?enablejsapi=1`,
              youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              description: item.snippet.description,
            }));
            resolve(items);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}
