# LearnTube AI 🎓🚀

> **"Turn YouTube into Your Personal University."**

LearnTube AI is a production-ready, full-stack educational platform built specifically for university students, self-taught engineers, and competitive exam aspirants (GATE, GRE, Technical Placements). 

Instead of treating YouTube like an algorithmic entertainment rabbit hole filled with distractions, recommended drama, and fragmented playlists, **LearnTube AI transforms YouTube into an isolated, structured academic campus**.

---

## 🌟 The Core Philosophy

When studying complex engineering subjects like **Operating Systems**, **Distributed Systems**, **Database Management**, or **Deep Learning**, students face three critical problems on traditional video platforms:
1. **Fragmentation**: Good lectures are scattered across different creators, university channels, and multi-part series with no unified syllabus tree.
2. **Passive Consumption**: Watching videos without immediate retrieval practice leads to the illusion of competence.
3. **Language Barriers & Unstructured Notes**: Switching between video players, note taking apps, and chatbots causes high cognitive switching overhead.

### The LearnTube Solution:
```
SEARCH / SYLLABUS → LEARN → ASK AI → TAKE NOTES → PRACTICE → TEST → MASTER
```

---

## 🚀 Key Architectural Features

### 1. 🗺️ Subject & University Syllabus Mapping Engine
- Enter any university subject, GATE topic, or tech stack (e.g. *Operating Systems, DSA, DBMS, Computer Networks, Machine Learning, Python, Calculus*).
- LearnTube organizes content into an academic **curriculum tree** (e.g., *1. Intro & System Calls → 2. Processes → 3. Threads → 4. CPU Scheduling → 5. Synchronization → 6. Deadlocks → 7. Memory Management → 8. Virtual Memory → 9. File Systems → 10. I/O*).
- Select learning level: **Beginner**, **Intermediate**, or **Advanced**.
- Select target goal: **Complete Course**, **Exam Preparation**, **Interview Preparation**, or **Quick Learning**.

### 2. 🎬 Distraction-Reduced Studio Learning Workspace
- **Left Column**: Course syllabus tree, module progress indicators, and one-click switching to alternative instructors (e.g. compare *Gate Smashers* vs *MIT OpenCourseWare* vs *CrashCourse* vs *Abdul Bari* for the same concept).
- **Center**: Official YouTube no-cookie responsive embed player (`https://www.youtube-nocookie.com/embed/...`) with metadata, views, duration, and honest transcript availability badges.
- **Right Column**: Live Socratic AI Tutor grounded in the current topic and video transcripts.
- **Bottom Workspace Ledger**: Smart Notes, Structured Summary, 3D Flashcards, AI Quizzes, and Socratic Viva discussions.

### 3. 🤖 Socratic AI Tutor & Multilingual Learning
- **Context-Grounded**: Understands video metadata, chapter titles, notes, and lecture transcripts.
- **Strict Anti-Hallucination Labeling**:
  - `📖 [From Lesson Content]`: Verifiable content from the transcript or syllabus.
  - `💡 [AI Conceptual Extension]`: Broader conceptual analogies, math proofs, or industry extensions.
- **Multilingual Support**: Supports learning and tutoring in **English, Hindi (हिंदी), Spanish (Español), French (Français), German (Deutsch), Tamil (தமிழ்), Telugu (తెలుగు), Bengali (বাংলা)**.
- **5 Socratic Personas**:
  - *Balanced Academic Mentor* (Default)
  - *Strict University Professor* (Demands mathematical proofs & edge cases)
  - *Socratic Inquiry Guide* (Guides through inquiry rather than spoonfeeding)
  - *Senior Engineering Peer* (Shares real-world system architecture & interview traps)
  - *ELI5* (Zero jargon, pure intuitive everyday analogies)

### 4. 📋 Structured AI Video Summaries
- **Quick Summary**: 2-sentence executive synopsis.
- **Detailed Summary**: Architectural breakdown of the lecture.
- **Important Concepts**: Key highlights and operational invariants.
- **Key Definitions Table**: Clear terminology lookup.
- **Formula & Quantitative Metrics Sheet**: E.g. Turnaround Time, Waiting Time, Effective Memory Access Time (EMAT).
- **Practical Engineering Examples**: Real-world distributed systems analogies.
- **High-Yield Exam Points**: Common 5-mark and 10-mark university exam questions.
- **Common Student Traps & Pitfalls**: Avoiding typical conceptual bugs.

### 5. 📝 Smart Notes Ledger & Markdown Exporter
- Write manual lecture notes with instant timestamps.
- One-click **"Generate AI Notes"** to capture key definitions and exam tips into your personal ledger.
- Pin important notes, search by concept, and export all notes to clean, tax-ready **Markdown (`.md`)**.

### 6. 🗂️ Interactive 3D Flashcards with Spaced Repetition
- 3D CSS flip cards with concept question on the front and detailed explanation + memory mnemonics on the reverse.
- Tracks mastery states: `I Know This 👍 (+15 XP)` vs `Need Review 👎`.

### 7. 🎯 Dedicated "Test Yourself" Examination Simulator
- An isolated exam mode that **strictly hides videos, lecture notes, and AI explanations** until submission.
- Includes countdown timer, question navigator palette (answered, flagged, unvisited), and instant submission.
- Comprehensive diagnostic feedback: **Score, Accuracy Percentage, Weak Concepts Breakdown, Strong Concepts, and AI Remedial Guidance**.

### 8. 🗺️ Custom AI Learning Path Builder
- Type any custom prompt (e.g. *"I want to learn Machine Learning from scratch"* or *"GATE Computer Science in 30 days"*).
- Generates a custom 4-to-6 stage roadmap with estimated hours and mapped YouTube lecture topics.
- Save custom paths to personal curricula with progress tracking.

### 9. 🏛️ Verified University & Creator Discovery
- Curated index of the world's premier educational institutions:
  - **MIT OpenCourseWare** (6.006, 6.033, 6.042)
  - **Stanford Online** (CS229, CS144)
  - **Harvard University** (CS50)
  - **NPTEL / IITs** (IIT Kharagpur, IIT Madras, IIT Delhi)
  - **freeCodeCamp.org**
  - **3Blue1Brown** (Grant Sanderson's intuitive visual math)
  - **Abdul Bari** (Foundational Algorithms)
  - **Gate Smashers** (Varun Singla's core CS lectures)

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React 19** + **Vite** | Lightning-fast development & optimized production bundles |
| **Styling & Theme** | **Tailwind CSS v4** + **@tailwindcss/vite** | Cyber-academic obsidian dark mode, glassmorphic panels |
| **Routing** | **React Router v7** | Client-side routing across workspace, discovery, test modes |
| **Icons & Visuals** | **Lucide React** + **Canvas Confetti** | Crisp UI icons and celebratory milestone confetti |
| **Backend API** | **Node.js** + **Express** (ES Modules) | High-performance modular REST API |
| **AI Integration** | **Google Gemini 1.5 Flash** | Live generative AI tutoring (with built-in offline educational engine) |
| **Video Engine** | **YouTube Data API v3** + **IFrame API** | Search, playlist expansion, and official distraction-free embeds |
| **Persistence Engine** | **JSON File Database (`db.js`)** | Zero-config, persistent atomic storage for notes, tests, and paths |

---

## 📦 Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/apurvshivam01/learntube-ai.git
cd learntube-ai
```

### 2. Install Root, Backend & Frontend Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Variables (Optional)
Create `server/.env` based on `server/.env.example`:
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5174

# Optional: Add your Google Gemini API key for live generative AI tutoring
GEMINI_API_KEY=

# Optional: Add your YouTube Data API v3 key for live YouTube searching
YOUTUBE_API_KEY=
```
*(Note: LearnTube AI works 100% out of the box with zero external keys required using its built-in educational engine and curated university catalog!)*

### 4. Start Development Servers
From the root directory:
```bash
# Terminal 1: Start Backend Server (runs on http://localhost:5001)
npm run dev:server

# Terminal 2: Start Frontend Development Server (runs on http://localhost:5174)
npm run dev:client
```

Open your browser to:
👉 **`http://localhost:5174`**

---

## 🔒 Compliance & Platform Integrity

- **Official Embeds Only**: Videos are embedded using YouTube's official no-cookie player (`https://www.youtube-nocookie.com/embed/...`).
- **Zero Re-Hosting / Zero Downloads**: LearnTube AI never downloads, re-encodes, or redistributes YouTube content.
- **Honest Grounding**: Transcripts are only marked as verified when official closed captions are accessible; otherwise, AI answers are transparently labeled as grounded in verified academic syllabus knowledge.

---

## 👨‍💻 Author

**Apurv Sharma**  
- B.Tech in Computer Science & Engineering  
- GitHub: [@apurvshivam01](https://github.com/apurvshivam01)  
- License: MIT License © 2026 LearnTube AI
