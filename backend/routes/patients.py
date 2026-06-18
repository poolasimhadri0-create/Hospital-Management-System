from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.post("/")
def create_patient(patient: schemas.PatientSchema, db: Session = Depends(get_db)):
    db_patient = models.Patient(**patient.dict(exclude={"user_id"}))
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/")
def get_patients(db: Session = Depends(get_db)):
    return db.query(models.Patient).all()

@router.get("/me/{username}")
def get_my_patient_profile(username: str, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.name == username).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    return patient