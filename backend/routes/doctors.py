from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.get("/")
def get_doctors(db: Session = Depends(get_db)):
    return db.query(models.Doctor).all()

@router.post("/")
def create_doctor(doctor: schemas.DoctorSchema, db: Session = Depends(get_db)):
    db_doctor = models.Doctor(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor