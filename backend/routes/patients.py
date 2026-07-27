from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas

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

@router.delete("/{patient_id}")
def delete_patient(patient_id: int, role: str = None, db: Session = Depends(get_db)):
    """Delete a patient by ID. Also removes all appointments associated with this patient."""
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Delete all appointments for this patient (cascade)
    db.query(models.Appointment).filter(models.Appointment.patient_id == patient_id).delete()
    
    db.delete(patient)
    db.commit()
    return {"message": f"Patient {patient.name} deleted successfully along with their appointments."}