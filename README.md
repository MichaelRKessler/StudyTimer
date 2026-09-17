# StudyTimer ⏳

A modern, responsive study timer and focus tracking web application built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- **Interval & Break Management**:
  - **Study Focus Mode**: Default 25-minute Pomodoro sessions (customizable 1–120 min).
  - **Short Break Mode**: Quick 5-minute breather to stretch and hydrate.
  - **Long Break Mode**: 15-minute restorative rest after a configurable series of study sessions (default: every 4 sessions).
  - **Open Study Mode (Stopwatch)**: Freeform count-up timer for untimed study sessions.
- **Session Tracking & Analytics**:
  - Automatically records completed study blocks with start/end time and duration.
  - Subject/Topic categorization (Math, Computer Science, Languages, Exam Prep, or custom topics).
  - Optional session reflection notes.
  - Analytics dashboard: Today's study time, total focus hours, session count, and breakdown by topic.
  - Export session logs as formatted JSON.
- **Audio & Visual Feedback**:
  - Drift-compensated timer engine using system timestamps (`Date.now()`).
  - Audio completion and break chimes synthesized via the native Web Audio API (zero external asset dependencies).
  - Optional celebratory confetti on study session completion.
  - Dynamic browser tab title and status display (e.g. `▶ 24:59 - Focus | StudyTimer`).
- **Offline & Local Storage**:
  - All sessions, statistics, and customized settings are automatically persisted in `localStorage`.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation & Local Development

1. Clone or navigate to the repository:
   ```bash
   cd StudyTimer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser to the local URL displayed (usually `http://localhost:5173`).

4. Build for production:
   ```bash
   npm run build
   ```

---

## 👥 Collaboration & Contributing

Please review [AGENTS.md](AGENTS.md) before contributing:
- **Never push directly to `main`**.
- Always branch off `main` using descriptive branch names (`feat/<feature-name>`, `fix/<issue-name>`).
- Submit all changes via Pull Requests with clear descriptions and verification steps.
