from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.post("/register")
def register(user: schemas.LoginSchema, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = models.User(username=user.username, password=user.password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Account created successfully!", "id": new_user.id}

@router.post("/login")
def login(user: schemas.LoginSchema, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        models.User.username == user.username, 
        models.User.password == user.password,
        models.User.role == user.role
    ).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid Username or Password")
    return {"id": db_user.id, "username": db_user.username, "role": db_user.role}