from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Appointment
from schemas import AppointmentSchema

router = APIRouter()


@router.get("/")
def get_appointments(
    db: Session = Depends(get_db)
):
    return db.query(Appointment).all()


@router.post("/")
def create_appointment(
    appointment: AppointmentSchema,
    db: Session = Depends(get_db)
):
    new_appointment = Appointment(
        **appointment.model_dump()
    )

    db.add(new_appointment)
    db.commit()

    return {
        "message": "Appointment Created"
    }

@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, role: str = "user", db: Session = Depends(get_db)):
    if role != "admin":
        raise HTTPException(status_code=403, detail="Access denied. Only admins can delete appointments.")
    
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(appt)
    db.commit()
    return {"message": "Appointment cancelled"}