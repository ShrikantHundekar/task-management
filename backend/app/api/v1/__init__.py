from fastapi import APIRouter

from .auth import router as auth_router
from .projects import router as projects_router
from .tasks import router as tasks_router
from .subtasks import router as subtasks_router
from .ai import router as ai_router
from .analytics import router as analytics_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(projects_router, prefix="/projects", tags=["Projects"])
api_router.include_router(tasks_router, prefix="/tasks", tags=["Tasks"])
api_router.include_router(subtasks_router, prefix="/subtasks", tags=["Subtasks"])
api_router.include_router(ai_router, prefix="/ai", tags=["AI Coding Agent"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
