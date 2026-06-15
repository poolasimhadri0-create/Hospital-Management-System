from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import LoginSchema

router = APIRouter()

@router.post("/register")
def register(data: LoginSchema, db: Session = Depends(get_db)):
    user_exists = db.query(User).filter(User.username == data.username).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    is_approved = True
    if data.role == "doctor":
        is_approved = False
        
    new_user = User(username=data.username, password=data.password, role=data.role, is_approved=is_approved)
    db.add(new_user)
    db.commit()
    return {"message": "Account Created Successfully"}

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username, User.password == data.password, User.role == data.role).first()
    if user:
        if not user.is_approved:
            raise HTTPException(status_code=403, detail="Your account is pending admin approval. Please wait.")
        return {
            "message": "Login Success",
            "role": user.role,
            "username": user.username,
            "id": user.id
        }
    raise HTTPException(status_code=401, detail="Invalid Username or Password")

@router.get("/pending-doctors")
def get_pending_doctors(db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "doctor", User.is_approved == False).all()

@router.put("/approve-doctor/{username}")
def approve_doctor(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_approved = True
    db.commit()
    return {"message": "Doctor approved successfully"}

@router.delete("/reject-doctor/{username}")
def reject_doctor(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username, User.role == "doctor", User.is_approved == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="Pending doctor request not found")
    db.delete(user)
    db.commit()
    return {"message": "Doctor request rejected and account deleted"}