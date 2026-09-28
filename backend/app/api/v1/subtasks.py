from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.entities import Subtask, Task, ActivityLog
from app.schemas.schemas import SubtaskCreate, SubtaskUpdate, SubtaskOut, AIAcceptSubtasksRequest
from app.api.deps import get_current_user

router = APIRouter()

@router.post("", response_model=SubtaskOut, status_code=status.HTTP_201_CREATED)
def create_subtask(
    sub_in: SubtaskCreate,
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    count = db.query(Subtask).filter(Subtask.task_id == task_id).count()
    sub = Subtask(
        task_id=task_id,
        title=sub_in.title,
        is_completed=sub_in.is_completed,
        order=count
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub

@router.put("/{subtask_id}", response_model=SubtaskOut)
def update_subtask(
    subtask_id: int,
    sub_in: SubtaskUpdate,
    db: Session = Depends(get_db)
):
    sub = db.query(Subtask).filter(Subtask.id == subtask_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subtask not found")

    for field, val in sub_in.dict(exclude_unset=True).items():
        setattr(sub, field, val)

    db.commit()
    db.refresh(sub)
    return sub

@router.delete("/{subtask_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subtask(subtask_id: int, db: Session = Depends(get_db)):
    sub = db.query(Subtask).filter(Subtask.id == subtask_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subtask not found")
    db.delete(sub)
    db.commit()
    return None

@router.post("/accept-batch", response_model=List[SubtaskOut])
def accept_ai_subtasks(
    payload: AIAcceptSubtasksRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == payload.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    existing_count = db.query(Subtask).filter(Subtask.task_id == payload.task_id).count()
    created_subs = []
    for idx, st_title in enumerate(payload.subtasks):
        sub = Subtask(
            task_id=payload.task_id,
            title=st_title,
            is_completed=False,
            order=existing_count + idx
        )
        db.add(sub)
        created_subs.append(sub)

    log = ActivityLog(
        task_id=task.id,
        project_id=task.project_id,
        action="ai_subtasks_accepted",
        details=f"Accepted {len(payload.subtasks)} AI generated subtasks",
        user_name=current_user.name
    )
    db.add(log)
    db.commit()

    for s in created_subs:
        db.refresh(s)
    return created_subs
