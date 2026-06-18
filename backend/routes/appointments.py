from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.post("/")
def create_appointment(appointment: schemas.AppointmentSchema, db: Session = Depends(get_db)):
    db_appointment = models.Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.get("/")
def get_appointments(db: Session = Depends(get_db)):
    return db.query(models.Appointment).all()

@router.get("/me/{username}")
def get_my_appointments(username: str, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.name == username).first()
    if not patient:
        return []
    return db.query(models.Appointment).filter(models.Appointment.patient_id == patient.id).all()

@router.put("/{appointment_id}/accept")
def accept_appointment(appointment_id: int, time: str, db: Session = Depends(get_db)):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment.status = "Accepted"
    appointment.time = time
    db.commit()
    return {"message": "Appointment accepted"}