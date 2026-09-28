from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.entities import Project, Task, User
from app.schemas.schemas import ProjectCreate, ProjectUpdate, ProjectOut
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[ProjectOut])
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).all()
    results = []
    for p in projects:
        tasks_count = db.query(Task).filter(Task.project_id == p.id).count()
        completed_count = db.query(Task).filter(Task.project_id == p.id, Task.status == "done").count()
        p_out = ProjectOut(
            id=p.id,
            name=p.name,
            description=p.description or "",
            programming_language=p.programming_language or "Python",
            framework=p.framework or "FastAPI",
            repository_url=p.repository_url or "",
            status=p.status,
            user_id=p.user_id,
            created_at=p.created_at,
            updated_at=p.updated_at,
            tasks_count=tasks_count,
            completed_tasks_count=completed_count
        )
        results.append(p_out)
    return results

@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = Project(
        name=project_in.name,
        description=project_in.description,
        programming_language=project_in.programming_language,
        framework=project_in.framework,
        repository_url=project_in.repository_url,
        status=project_in.status,
        user_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return ProjectOut(
        id=project.id,
        name=project.name,
        description=project.description or "",
        programming_language=project.programming_language,
        framework=project.framework,
        repository_url=project.repository_url,
        status=project.status,
        user_id=project.user_id,
        created_at=project.created_at,
        updated_at=project.updated_at,
        tasks_count=0,
        completed_tasks_count=0
    )

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    tasks_count = db.query(Task).filter(Task.project_id == project.id).count()
    completed_count = db.query(Task).filter(Task.project_id == project.id, Task.status == "done").count()
    return ProjectOut(
        id=project.id,
        name=project.name,
        description=project.description or "",
        programming_language=project.programming_language,
        framework=project.framework,
        repository_url=project.repository_url,
        status=project.status,
        user_id=project.user_id,
        created_at=project.created_at,
        updated_at=project.updated_at,
        tasks_count=tasks_count,
        completed_tasks_count=completed_count
    )

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    for field, val in project_in.dict(exclude_unset=True).items():
        setattr(project, field, val)
        
    db.commit()
    db.refresh(project)
    tasks_count = db.query(Task).filter(Task.project_id == project.id).count()
    completed_count = db.query(Task).filter(Task.project_id == project.id, Task.status == "done").count()
    return ProjectOut(
        id=project.id,
        name=project.name,
        description=project.description or "",
        programming_language=project.programming_language,
        framework=project.framework,
        repository_url=project.repository_url,
        status=project.status,
        user_id=project.user_id,
        created_at=project.created_at,
        updated_at=project.updated_at,
        tasks_count=tasks_count,
        completed_tasks_count=completed_count
    )

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return None
