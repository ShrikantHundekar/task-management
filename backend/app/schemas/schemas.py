from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# ----------------- Auth Schemas -----------------
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Subtask Schemas -----------------
class SubtaskBase(BaseModel):
    title: str
    is_completed: bool = False
    order: int = 0

class SubtaskCreate(SubtaskBase):
    pass

class SubtaskUpdate(BaseModel):
    title: Optional[str] = None
    is_completed: Optional[bool] = None
    order: Optional[int] = None

class SubtaskOut(SubtaskBase):
    id: int
    task_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Label Schemas -----------------
class LabelBase(BaseModel):
    name: str
    color: str = "#6366F1"

class LabelCreate(LabelBase):
    project_id: int

class LabelOut(LabelBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True

# ----------------- Comment Schemas -----------------
class CommentCreate(BaseModel):
    content: str
    user_name: Optional[str] = "Alex Chen"
    user_avatar: Optional[str] = None

class CommentOut(BaseModel):
    id: int
    task_id: int
    user_name: str
    user_avatar: Optional[str]
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Activity Log Schemas -----------------
class ActivityLogOut(BaseModel):
    id: int
    task_id: Optional[int] = None
    project_id: Optional[int] = None
    action: str
    details: str
    user_name: str
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Task Schemas -----------------
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = ""
    status: str = "todo" # backlog, todo, in_progress, in_review, testing, done, blocked
    priority: str = "medium" # low, medium, high, critical
    programming_language: Optional[str] = "Python"
    framework: Optional[str] = "FastAPI"
    code_snippet: Optional[str] = ""
    assignee_name: Optional[str] = "Alex Chen"
    assignee_avatar: Optional[str] = ""
    estimated_hours: Optional[float] = 4.0
    actual_hours: Optional[float] = 0.0
    due_date: Optional[str] = ""

class TaskCreate(TaskBase):
    project_id: int
    initial_subtasks: Optional[List[str]] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    programming_language: Optional[str] = None
    framework: Optional[str] = None
    code_snippet: Optional[str] = None
    assignee_name: Optional[str] = None
    assignee_avatar: Optional[str] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    due_date: Optional[str] = None

class TaskStatusUpdate(BaseModel):
    status: str

class TaskOut(TaskBase):
    id: int
    task_number: str
    project_id: int
    created_at: datetime
    updated_at: datetime
    subtasks: List[SubtaskOut] = []
    labels: List[LabelOut] = []
    comments_count: Optional[int] = 0

    class Config:
        from_attributes = True

class TaskDetail(TaskOut):
    comments: List[CommentOut] = []
    activity_logs: List[ActivityLogOut] = []

# ----------------- Project Schemas -----------------
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = ""
    programming_language: Optional[str] = "Python"
    framework: Optional[str] = "FastAPI"
    repository_url: Optional[str] = ""
    status: str = "active"

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    programming_language: Optional[str] = None
    framework: Optional[str] = None
    repository_url: Optional[str] = None
    status: Optional[str] = None

class ProjectOut(ProjectBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    tasks_count: Optional[int] = 0
    completed_tasks_count: Optional[int] = 0

    class Config:
        from_attributes = True

# ----------------- AI Service Schemas -----------------
class AIChatRequest(BaseModel):
    task_id: Optional[int] = None
    project_id: Optional[int] = None
    message: str
    current_code: Optional[str] = None

class AIChatResponse(BaseModel):
    reply: str
    provider: str
    model: str
    suggested_actions: Optional[List[str]] = None

class AIExplainTaskRequest(BaseModel):
    task_id: int

class AIExplainTaskResponse(BaseModel):
    problem_explanation: str
    expected_behavior: str
    technical_requirements: List[str]
    recommended_approach: str
    potential_edge_cases: List[str]
    definition_of_done: List[str]

class AIBreakTaskRequest(BaseModel):
    task_id: Optional[int] = None
    task_title: str
    description: Optional[str] = ""

class AIBreakTaskResponse(BaseModel):
    subtasks: List[str]
    suggested_priority: Optional[str] = "medium"
    estimated_hours: Optional[float] = 4.0

class AIAcceptSubtasksRequest(BaseModel):
    task_id: int
    subtasks: List[str]

class AIPlanRequest(BaseModel):
    task_id: int

class AIPlanResponse(BaseModel):
    plan_steps: List[str]
    affected_files: List[str]
    test_strategy: str

class AICodeGenRequest(BaseModel):
    task_id: Optional[int] = None
    prompt: str
    language: Optional[str] = "python"
    existing_code: Optional[str] = ""

class AICodeGenResponse(BaseModel):
    explanation: str
    code: str
    required_imports: List[str]
    file_location: str
    dependencies: List[str]
    implementation_notes: str

class AIDebugRequest(BaseModel):
    task_id: Optional[int] = None
    error_message: str
    source_code: str
    language: Optional[str] = "python"

class AIDebugResponse(BaseModel):
    problem: str
    root_cause: str
    why_it_happens: str
    fixed_code: str
    explanation: str
    prevention: str

class AICodeReviewRequest(BaseModel):
    task_id: Optional[int] = None
    source_code: str
    language: Optional[str] = "python"

class AICodeReviewIssue(BaseModel):
    category: str # Correctness, Performance, Security, Readability, Maintainability
    severity: str # Critical, High, Medium, Low, Suggestion
    description: str
    suggested_fix: Optional[str] = None

class AICodeReviewResponse(BaseModel):
    summary: str
    overall_quality_score: int # 1 to 100
    issues: List[AICodeReviewIssue]
    suggested_improvements: List[str]

class AITestGenRequest(BaseModel):
    task_id: Optional[int] = None
    source_code: str
    language: Optional[str] = "python"
    test_framework: Optional[str] = "pytest"

class AITestGenResponse(BaseModel):
    framework: str
    test_code: str
    instructions: str

class AIDocGenRequest(BaseModel):
    task_id: Optional[int] = None
    project_id: Optional[int] = None
    doc_type: str = "api" # "readme", "api", "function", "architecture"

class AIDocGenResponse(BaseModel):
    title: str
    markdown_content: str

class AIEstimateRequest(BaseModel):
    task_title: str
    description: Optional[str] = ""

class AIEstimateResponse(BaseModel):
    complexity: str # Low, Medium, High
    estimated_hours_range: str # e.g. "3-5 hours"
    risk_level: str # Low, Medium, High
    dependencies: List[str]
    confidence_note: str

# ----------------- Analytics Schemas -----------------
class DashboardAnalytics(BaseModel):
    total_projects: int
    active_tasks: int
    completed_tasks: int
    tasks_due_soon: int
    tasks_by_status: Dict[str, int]
    tasks_by_priority: Dict[str, int]
    ai_requests_count: int
    subtasks_generated_count: int
    code_reviews_count: int
    debugging_sessions_count: int
    weekly_completion: List[Dict[str, Any]]
