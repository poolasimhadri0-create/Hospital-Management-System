from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Patient
from schemas import PatientSchema

router = APIRouter()


@router.get("/")
def get_patients(
    db: Session = Depends(get_db)
):
    return db.query(Patient).all()


@router.post("/")
def create_patient(
    patient: PatientSchema,
    db: Session = Depends(get_db)
):
    new_patient = Patient(**patient.model_dump())

    db.add(new_patient)
    db.commit()

    return {
        "message": "Patient Added"
    }

@router.delete("/{patient_id}")
def delete_patient(patient_id: int, role: str = "user", db: Session = Depends(get_db)):
    if role != "admin":
        raise HTTPException(status_code=403, detail="Access denied. Only admins can delete records.")
    
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"message": "Patient record removed"}