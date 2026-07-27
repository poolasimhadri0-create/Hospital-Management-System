from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas

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

@router.delete("/{doctor_id}")
def delete_doctor(doctor_id: int, role: str = None, db: Session = Depends(get_db)):
    """Delete a doctor by ID. Also removes all appointments associated with this doctor."""
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Delete all appointments for this doctor (cascade)
    db.query(models.Appointment).filter(models.Appointment.doctor_id == doctor_id).delete()
    
    db.delete(doctor)
    db.commit()
    return {"message": f"Doctor {doctor.name} deleted successfully along with their appointments."}
