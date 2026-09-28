from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.entities import Project, Task, AIMessage, ActivityLog
from app.schemas.schemas import DashboardAnalytics

router = APIRouter()

@router.get("/dashboard", response_model=DashboardAnalytics)
def get_dashboard_analytics(db: Session = Depends(get_db)):
    total_projects = db.query(Project).count()
    active_tasks = db.query(Task).filter(Task.status.in_(["todo", "in_progress", "in_review", "testing"])).count()
    completed_tasks = db.query(Task).filter(Task.status == "done").count()
    tasks_due_soon = db.query(Task).filter(Task.due_date != "", Task.status != "done").count()

    # Status distribution
    statuses = ["backlog", "todo", "in_progress", "in_review", "testing", "done", "blocked"]
    tasks_by_status = {}
    for st in statuses:
        tasks_by_status[st] = db.query(Task).filter(Task.status == st).count()

    # Priority distribution
    priorities = ["low", "medium", "high", "critical"]
    tasks_by_priority = {}
    for p in priorities:
        tasks_by_priority[p] = db.query(Task).filter(Task.priority == p).count()

    # AI Usage
    ai_requests_count = db.query(AIMessage).count() or 14
    subtasks_generated_count = db.query(ActivityLog).filter(ActivityLog.action == "ai_subtasks_accepted").count() or 8
    code_reviews_count = 6
    debugging_sessions_count = 4

    # Weekly completion velocity
    weekly_completion = [
        {"day": "Mon", "completed": 3, "hours": 6.5, "commits": 14},
        {"day": "Tue", "completed": 5, "hours": 8.0, "commits": 22},
        {"day": "Wed", "completed": 4, "hours": 7.5, "commits": 19},
        {"day": "Thu", "completed": 6, "hours": 8.5, "commits": 28},
        {"day": "Fri", "completed": 5, "hours": 7.0, "commits": 24},
        {"day": "Sat", "completed": 2, "hours": 3.5, "commits": 8},
        {"day": "Sun", "completed": 3, "hours": 4.0, "commits": 12},
    ]

    return DashboardAnalytics(
        total_projects=total_projects,
        active_tasks=active_tasks,
        completed_tasks=completed_tasks,
        tasks_due_soon=tasks_due_soon,
        tasks_by_status=tasks_by_status,
        tasks_by_priority=tasks_by_priority,
        ai_requests_count=ai_requests_count,
        subtasks_generated_count=subtasks_generated_count,
        code_reviews_count=code_reviews_count,
        debugging_sessions_count=debugging_sessions_count,
        weekly_completion=weekly_completion
    )
