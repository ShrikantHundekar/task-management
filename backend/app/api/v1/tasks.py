from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.core.database import get_db
from app.models.entities import Task, Subtask, Comment, ActivityLog, Project, User
from app.schemas.schemas import (
    TaskCreate, TaskUpdate, TaskStatusUpdate, TaskOut, TaskDetail, CommentCreate, CommentOut
)
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[TaskOut])
def get_tasks(
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(Task)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if search:
        s = f"%{search}%"
        query = query.filter(or_(
            Task.title.ilike(s),
            Task.description.ilike(s),
            Task.task_number.ilike(s),
            Task.assignee_name.ilike(s)
        ))

    # Sorting
    sort_col = getattr(Task, sort_by, Task.created_at)
    if order == "asc":
        query = query.order_by(asc(sort_col))
    else:
        query = query.order_by(desc(sort_col))

    tasks = query.all()
    results = []
    for t in tasks:
        comments_count = db.query(Comment).filter(Comment.task_id == t.id).count()
        t_out = TaskOut.from_orm(t)
        t_out.comments_count = comments_count
        results.append(t_out)
    return results

@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Generate task number
    count = db.query(Task).count() + 1
    task_number = f"TASK-{count}"

    task = Task(
        task_number=task_number,
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        priority=task_in.priority,
        programming_language=task_in.programming_language,
        framework=task_in.framework,
        code_snippet=task_in.code_snippet,
        assignee_name=task_in.assignee_name or current_user.name,
        assignee_avatar=task_in.assignee_avatar or current_user.avatar,
        estimated_hours=task_in.estimated_hours,
        actual_hours=task_in.actual_hours,
        due_date=task_in.due_date,
        project_id=task_in.project_id
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    # Initial subtasks if provided
    if task_in.initial_subtasks:
        for idx, st_title in enumerate(task_in.initial_subtasks):
            sub = Subtask(
                task_id=task.id,
                title=st_title,
                is_completed=False,
                order=idx
            )
            db.add(sub)
        db.commit()

    # Activity log
    log = ActivityLog(
        task_id=task.id,
        project_id=task.project_id,
        action="task_created",
        details=f"Created task {task.task_number}: {task.title}",
        user_name=current_user.name
    )
    db.add(log)
    db.commit()
    db.refresh(task)

    t_out = TaskOut.from_orm(task)
    t_out.comments_count = 0
    return t_out

@router.get("/{task_id}", response_model=TaskDetail)
def get_task_detail(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    comments_count = len(task.comments)
    detail = TaskDetail.from_orm(task)
    detail.comments_count = comments_count
    return detail

@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    old_status = task.status
    for field, val in task_in.dict(exclude_unset=True).items():
        setattr(task, field, val)

    if task_in.status and task_in.status != old_status:
        log = ActivityLog(
            task_id=task.id,
            project_id=task.project_id,
            action="status_changed",
            details=f"Moved status from '{old_status}' to '{task_in.status}'",
            user_name=current_user.name
        )
        db.add(log)

    db.commit()
    db.refresh(task)
    comments_count = db.query(Comment).filter(Comment.task_id == task.id).count()
    t_out = TaskOut.from_orm(task)
    t_out.comments_count = comments_count
    return t_out

@router.patch("/{task_id}/status", response_model=TaskOut)
def update_task_status(
    task_id: int,
    status_in: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    old_status = task.status
    task.status = status_in.status

    log = ActivityLog(
        task_id=task.id,
        project_id=task.project_id,
        action="status_changed",
        details=f"Moved status from '{old_status}' to '{status_in.status}'",
        user_name=current_user.name
    )
    db.add(log)
    db.commit()
    db.refresh(task)

    comments_count = db.query(Comment).filter(Comment.task_id == task.id).count()
    t_out = TaskOut.from_orm(task)
    t_out.comments_count = comments_count
    return t_out

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return None

@router.post("/{task_id}/comments", response_model=CommentOut)
def add_comment(
    task_id: int,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    comment = Comment(
        task_id=task.id,
        user_name=comment_in.user_name or current_user.name,
        user_avatar=comment_in.user_avatar or current_user.avatar,
        content=comment_in.content
    )
    db.add(comment)

    log = ActivityLog(
        task_id=task.id,
        project_id=task.project_id,
        action="comment_added",
        details=f"Added a comment: {comment.content[:40]}...",
        user_name=current_user.name
    )
    db.add(log)
    db.commit()
    db.refresh(comment)
    return comment
