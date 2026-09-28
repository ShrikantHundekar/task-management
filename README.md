# CodeFlow AI

> **"Plan. Code. Debug. Ship."**
> A modern, production-grade AI-powered Coding Task Management Platform with integrated Groq Cloud LLaMA 3.3 70B reasoning agents.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?logo=groq&logoColor=white)](https://groq.com)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-VS_Code_Core-007ACC?logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## ⚡ Highlights & Key Capabilities

- 🎯 **Sprint & Issue Pipeline**: 6-column interactive drag-and-drop Kanban board with subtask progress bars, severity badges, and quick AI action shortcuts.
- 🤖 **Groq AI Developer Copilot**: Sub-second reasoning via Meta LLaMA 3.3 70B across 9 specialized engineering workflows:
  1. **Task Explanation & Architectural Analysis**: Breaks down design patterns and potential traps.
  2. **Subtask Decomposition with Batch Acceptance**: Breaks coding tasks into discrete subtasks and saves them directly to the database.
  3. **Technical Implementation Plan**: Step-by-step guidance with file paths and database migration plans.
  4. **Code Generation**: Clean, production-ready boilerplate and algorithm implementations.
  5. **Root-Cause Debugger**: Paste terminal stack traces for immediate Root Cause Analysis and auto-patched snippets.
  6. **Automated Code Review & Security Audit**: Severity-ranked feedback (Critical, Warning, Optimization) and OWASP security vulnerability checks.
  7. **Unit & Integration Test Generator**: PyTest and Jest fixtures covering boundary conditions.
  8. **Documentation & API Spec Generator**: Markdown specs and OpenAPI endpoints documentation.
  9. **Engineering Time & Complexity Estimator**: Realistic time estimates based on dependencies.
- 💻 **Integrated Monaco Code Editor**: Real VS Code editing engine embedded directly in task details and developer workspace with language syntax highlighting and direct AI review/debug integration.
- 📊 **Engineering Velocity Analytics**: Interactive Recharts dashboards with burndown trends, status distributions, and AI usage telemetry.
- 🎨 **Developer Dark & Light Modes**: Curated Linear / GitHub / VS Code inspired aesthetics with custom typography, glowing status badges, and keyboard shortcuts (`⌘K`).

---

## 🏗️ Architecture

```
Task management/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py             # Auth & Groq API key dependencies
│   │   │   └── v1/                 # Endpoints: auth, projects, tasks, subtasks, ai, analytics
│   │   ├── core/                   # Pydantic Settings, SQLAlchemy engine, bcrypt & JWT security
│   │   ├── models/                 # SQLAlchemy ORM entities (User, Project, Task, Subtask, etc.)
│   │   ├── schemas/                # Pydantic v2 schemas
│   │   ├── services/
│   │   │   ├── groq_service.py     # Groq Cloud SDK caller with fallback logic
│   │   │   ├── ai_service.py       # Domain logic for all 9 developer AI actions
│   │   │   └── seed.py             # Realistic seed data for projects and tasks
│   │   └── main.py                 # FastAPI application with CORS and lifespan database setup
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Navbar, Sidebar, CopilotDrawer, SubtasksModal, ReviewModal, DebuggerModal
│   │   ├── pages/                  # Dashboard, Kanban, Tasks, TaskDetail (Monaco), Workspace, Analytics, Settings
│   │   ├── services/               # REST API client
│   │   ├── store/                  # Zustand stores: auth, projects, tasks, copilot
│   │   └── types/                  # TypeScript domain models
│   ├── tailwind.config.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`
- *(Optional)* **Groq API Key**: Obtain for free from [console.groq.com/keys](https://console.groq.com/keys). If omitted, CodeFlow AI uses simulated mock reasoning.

---

### Running with Docker Compose (Recommended)

```bash
# 1. Clone or navigate to the repository
cd "Task management"

# 2. Configure environment (optional)
cp .env.example .env

# 3. Build and launch containers
docker-compose up --build
```
Open [http://localhost:5173](http://localhost:5173) in your browser!

---

### Running Locally (Manual Setup)

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API runs on `http://127.0.0.1:8000`. Interactive docs at `http://127.0.0.1:8000/docs`.

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173`.

---

## 🔑 Default Credentials

- **Email**: `alex@codeflow.io`
- **Password**: `password123`
*(Auto-seeded with 3 projects, 9 tasks with code snippets, and subtask checklists).*

---

## 🧠 Groq API Key Setup

1. In the CodeFlow AI navigation bar, click the settings gear or navigate to `/settings`.
2. Paste your Groq API Key (`gsk_...`) and select your model (`llama-3.3-70b-versatile` or `llama-3.1-8b-instant`).
3. Click **Save Configuration** and click **Test Connection** to test response latency!

---

## 🛡️ Security & Reliability

- Secure password hashing using direct `bcrypt`.
- Statistically typed schemas with Pydantic v2 and TypeScript.
- Asymmetric token verification and authorization headers.
- Rate-limit and fallback safety for Groq Cloud inference.
