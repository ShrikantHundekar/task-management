from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.ai_service import AIService
from app.api.deps import get_groq_api_key
from app.schemas.schemas import (
    AIChatRequest, AIChatResponse,
    AIExplainTaskRequest, AIExplainTaskResponse,
    AIBreakTaskRequest, AIBreakTaskResponse,
    AIPlanRequest, AIPlanResponse,
    AICodeGenRequest, AICodeGenResponse,
    AIDebugRequest, AIDebugResponse,
    AICodeReviewRequest, AICodeReviewResponse,
    AITestGenRequest, AITestGenResponse,
    AIDocGenRequest, AIDocGenResponse,
    AIEstimateRequest, AIEstimateResponse
)

router = APIRouter()

@router.post("/chat", response_model=AIChatResponse)
def ai_chat(
    req: AIChatRequest,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_groq_api_key)
):
    return AIService.chat(
        message=req.message,
        task_id=req.task_id,
        project_id=req.project_id,
        current_code=req.current_code,
        db=db,
        api_key=api_key
    )

@router.post("/explain-task", response_model=AIExplainTaskResponse)
def ai_explain_task(
    req: AIExplainTaskRequest,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_groq_api_key)
):
    return AIService.explain_task(task_id=req.task_id, db=db, api_key=api_key)

@router.post("/break-task", response_model=AIBreakTaskResponse)
def ai_break_task(
    req: AIBreakTaskRequest,
    api_key: str = Depends(get_groq_api_key)
):
    return AIService.break_task(
        task_title=req.task_title,
        description=req.description or "",
        api_key=api_key
    )

@router.post("/generate-plan", response_model=AIPlanResponse)
def ai_generate_plan(
    req: AIPlanRequest,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_groq_api_key)
):
    return AIService.generate_plan(task_id=req.task_id, db=db, api_key=api_key)

@router.post("/generate-code", response_model=AICodeGenResponse)
def ai_generate_code(
    req: AICodeGenRequest,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_groq_api_key)
):
    return AIService.generate_code(
        prompt=req.prompt,
        task_id=req.task_id,
        language=req.language or "python",
        existing_code=req.existing_code or "",
        db=db,
        api_key=api_key
    )

@router.post("/debug", response_model=AIDebugResponse)
def ai_debug(
    req: AIDebugRequest,
    api_key: str = Depends(get_groq_api_key)
):
    return AIService.debug_code(
        error_message=req.error_message,
        source_code=req.source_code,
        language=req.language or "python",
        api_key=api_key
    )

@router.post("/review", response_model=AICodeReviewResponse)
def ai_review(
    req: AICodeReviewRequest,
    api_key: str = Depends(get_groq_api_key)
):
    return AIService.review_code(
        source_code=req.source_code,
        language=req.language or "python",
        api_key=api_key
    )

@router.post("/generate-tests", response_model=AITestGenResponse)
def ai_generate_tests(
    req: AITestGenRequest,
    api_key: str = Depends(get_groq_api_key)
):
    return AIService.generate_tests(
        source_code=req.source_code,
        language=req.language or "python",
        test_framework=req.test_framework or "pytest",
        api_key=api_key
    )

@router.post("/documentation", response_model=AIDocGenResponse)
def ai_documentation(
    req: AIDocGenRequest,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_groq_api_key)
):
    return AIService.generate_docs(
        task_id=req.task_id,
        project_id=req.project_id,
        doc_type=req.doc_type,
        db=db,
        api_key=api_key
    )

@router.post("/estimate", response_model=AIEstimateResponse)
def ai_estimate(
    req: AIEstimateRequest,
    api_key: str = Depends(get_groq_api_key)
):
    return AIService.estimate_task(
        task_title=req.task_title,
        description=req.description or "",
        api_key=api_key
    )
