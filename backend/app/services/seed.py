import logging
from sqlalchemy.orm import Session
from app.models.entities import User, Project, Task, Subtask, Label, Comment, ActivityLog
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)

def seed_database(db: Session):
    # Check if database is already seeded
    existing_user = db.query(User).filter(User.email == "alex@codeflow.io").first()
    if existing_user:
        logger.info("Database already seeded.")
        return

    logger.info("Seeding CodeFlow AI database...")

    # 1. Create Demo User
    user = User(
        name="Alex Chen",
        email="alex@codeflow.io",
        password_hash=get_password_hash("password123"),
        avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Create 3 Projects
    p1 = Project(
        name="AI Resume Analyzer",
        description="NLP-powered resume parser and candidate-job matching engine with LLM ranking.",
        programming_language="Python",
        framework="FastAPI",
        repository_url="https://github.com/codeflow-ai/resume-analyzer",
        status="active",
        user_id=user.id
    )
    p2 = Project(
        name="Movie Recommendation System",
        description="Collaborative and content-based recommendation model using matrix factorization and Scikit-learn.",
        programming_language="Python",
        framework="Scikit-learn",
        repository_url="https://github.com/codeflow-ai/movie-recommender",
        status="active",
        user_id=user.id
    )
    p3 = Project(
        name="Developer Portfolio Platform",
        description="High-performance developer portfolio builder with live GitHub contributions graph and markdown blogging.",
        programming_language="TypeScript",
        framework="React",
        repository_url="https://github.com/codeflow-ai/dev-portfolio",
        status="active",
        user_id=user.id
    )
    db.add_all([p1, p2, p3])
    db.commit()
    db.refresh(p1)
    db.refresh(p2)
    db.refresh(p3)

    # 3. Create Labels
    l_backend = Label(name="Backend", color="#6366F1", project_id=p1.id)
    l_ai = Label(name="AI / LLM", color="#06B6D4", project_id=p1.id)
    l_security = Label(name="Security", color="#EF4444", project_id=p1.id)
    l_ml = Label(name="ML Model", color="#8B5CF6", project_id=p2.id)
    l_frontend = Label(name="Frontend", color="#3B82F6", project_id=p3.id)
    db.add_all([l_backend, l_ai, l_security, l_ml, l_frontend])
    db.commit()

    # 4. Create Tasks for Project 1 (AI Resume Analyzer)
    tasks_data = [
        {
            "task_number": "RES-101",
            "title": "Implement JWT Authentication & Refresh Token Rotation",
            "description": "Secure API endpoints with asymmetric JWT token verification and Redis blacklisting on logout.",
            "status": "done",
            "priority": "critical",
            "language": "Python",
            "framework": "FastAPI",
            "assignee_name": "Alex Chen",
            "code_snippet": "from jose import jwt\n\ndef create_token(user_id: int):\n    return jwt.encode({'sub': str(user_id)}, 'SECRET', algorithm='HS256')",
            "estimated_hours": 6.0,
            "actual_hours": 5.5,
            "due_date": "2026-10-15",
            "subtasks": [
                ("Define User model and password hashing with bcrypt", True),
                ("Create /register and /login API endpoints", True),
                ("Implement JWT access token and refresh token rotation", True),
                ("Add Redis session blacklist on logout", True)
            ]
        },
        {
            "task_number": "RES-102",
            "title": "Extract Text and Entities from PDF Resumes via PyMuPDF",
            "description": "Build high-throughput document ingestion pipeline extracting contact information, skills, and work experience.",
            "status": "in_progress",
            "priority": "high",
            "language": "Python",
            "framework": "FastAPI",
            "assignee_name": "Elena Rostova",
            "code_snippet": "import fitz\n\ndef parse_pdf(file_bytes):\n    doc = fitz.open(stream=file_bytes, filetype='pdf')\n    return '\\n'.join([page.get_text() for page in doc])",
            "estimated_hours": 8.0,
            "actual_hours": 4.0,
            "due_date": "2026-10-20",
            "subtasks": [
                ("Integrate PyMuPDF and pdfplumber parsing library", True),
                ("Write regex cleaners for phone numbers and emails", True),
                ("Implement section boundary classification (Skills, Experience)", False),
                ("Add unit test fixtures with 10 sample PDF resumes", False)
            ]
        },
        {
            "task_number": "RES-103",
            "title": "Groq LLM Semantic Scoring and Candidate Ranking",
            "description": "Call Groq API using LLaMA 3.3 to compute semantic job description relevance score and match explanation.",
            "status": "in_review",
            "priority": "critical",
            "language": "Python",
            "framework": "Groq Cloud",
            "assignee_name": "Alex Chen",
            "code_snippet": "from groq import Groq\n\nclient = Groq()\n# Prompt candidate evaluation with structured JSON",
            "estimated_hours": 10.0,
            "actual_hours": 8.0,
            "due_date": "2026-10-22",
            "subtasks": [
                ("Design structured JSON evaluation prompt for Groq", True),
                ("Benchmark latency between LLaMA 3.3 70B and 8B", True),
                ("Implement batch async evaluation with backoff retry", True),
                ("PR review and security audit for prompt injection", False)
            ]
        },
        {
            "task_number": "RES-104",
            "title": "Build Async Celery Worker for Bulk Resume Ingestion",
            "description": "Decouple heavy resume processing from HTTP request loop using Redis and Celery worker pool.",
            "status": "todo",
            "priority": "medium",
            "language": "Python",
            "framework": "Celery",
            "assignee_name": "Marcus Vance",
            "code_snippet": "# Celery task definition\n@celery_app.task\ndef ingest_resumes_batch(batch_id: str):\n    pass",
            "estimated_hours": 12.0,
            "actual_hours": 0.0,
            "due_date": "2026-10-28",
            "subtasks": [
                ("Configure Celery with Redis broker and result backend", False),
                ("Add task progress polling endpoint /api/tasks/{job_id}", False),
                ("Dockerize worker process in docker-compose.yml", False)
            ]
        },
        {
            "task_number": "RES-105",
            "title": "Fix Memory Leak in PyTorch Embedding Generator",
            "description": "CUDA tensor allocations are not being cleaned up when batch size exceeds 64 candidates.",
            "status": "blocked",
            "priority": "critical",
            "language": "Python",
            "framework": "PyTorch",
            "assignee_name": "Sarah Jenkins",
            "code_snippet": "torch.cuda.empty_cache()\n# Isolate tensor graph retain cycles",
            "estimated_hours": 6.0,
            "actual_hours": 3.0,
            "due_date": "2026-10-18",
            "subtasks": [
                ("Profile GPU VRAM usage with torch.cuda.memory_summary", True),
                ("Remove circular references in candidate embedding cache", False),
                ("Implement automatic garbage collection on batch boundary", False)
            ]
        },
        {
            "task_number": "RES-106",
            "title": "Add Prometheus Metrics and OpenTelemetry Tracing",
            "description": "Export P99 inference duration, token usage counters, and HTTP latency histograms.",
            "status": "backlog",
            "priority": "low",
            "language": "Python",
            "framework": "OpenTelemetry",
            "assignee_name": "Marcus Vance",
            "code_snippet": "",
            "estimated_hours": 5.0,
            "actual_hours": 0.0,
            "due_date": "2026-11-05",
            "subtasks": [
                ("Instrument FastAPI middleware with Prometheus exporter", False),
                ("Configure Grafana dashboard templates", False)
            ]
        }
    ]

    for t_data in tasks_data:
        task = Task(
            task_number=t_data["task_number"],
            title=t_data["title"],
            description=t_data["description"],
            status=t_data["status"],
            priority=t_data["priority"],
            programming_language=t_data["language"],
            framework=t_data["framework"],
            assignee_name=t_data["assignee_name"],
            code_snippet=t_data["code_snippet"],
            estimated_hours=t_data["estimated_hours"],
            actual_hours=t_data["actual_hours"],
            due_date=t_data["due_date"],
            project_id=p1.id
        )
        db.add(task)
        db.commit()
        db.refresh(task)

        for i, (st_title, completed) in enumerate(t_data["subtasks"]):
            sub = Subtask(
                task_id=task.id,
                title=st_title,
                is_completed=completed,
                order=i
            )
            db.add(sub)

        # Add sample comment
        comment = Comment(
            task_id=task.id,
            user_name="Sarah Jenkins",
            content=f"Team: Initial architecture review completed for {task.task_number}. Test suites are linked in CI."
        )
        db.add(comment)

        # Add activity log
        log = ActivityLog(
            task_id=task.id,
            project_id=p1.id,
            action="task_created",
            details=f"Task {task.task_number} created with priority {task.priority}",
            user_name="Alex Chen"
        )
        db.add(log)
        db.commit()

    # Add tasks for Project 2 (Movie Recommender)
    p2_tasks = [
        ("MOV-201", "Train Collaborative Filtering Model via SVD Matrix Factorization", "training", "in_progress", "high"),
        ("MOV-202", "FastAPI Prediction Endpoint with Redis Cache Layer", "api", "todo", "medium"),
        ("MOV-203", "Cosine Similarity Matrix Vector Search Benchmark", "benchmark", "backlog", "low"),
    ]
    for num, title, snippet, st, prio in p2_tasks:
        t = Task(
            task_number=num,
            title=title,
            description="Core machine learning recommendation pipeline component.",
            status=st,
            priority=prio,
            programming_language="Python",
            framework="Scikit-learn",
            assignee_name="Alex Chen",
            code_snippet="from sklearn.decomposition import TruncatedSVD\nsvd = TruncatedSVD(n_components=50)",
            estimated_hours=8.0,
            due_date="2026-11-10",
            project_id=p2.id
        )
        db.add(t)
    db.commit()

    logger.info("Successfully seeded CodeFlow AI database!")
