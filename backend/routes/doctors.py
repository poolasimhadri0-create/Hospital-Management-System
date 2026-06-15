from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Doctor
from schemas import DoctorSchema

router = APIRouter()


@router.get("/")
def get_doctors(
    db: Session = Depends(get_db)
):
    return db.query(Doctor).all()


@router.post("/")
def create_doctor(
    doctor: DoctorSchema,
    db: Session = Depends(get_db)
):
    new_doctor = Doctor(
        **doctor.model_dump()
    )

    db.add(new_doctor)
    db.commit()

    return {
        "message": "Doctor Added"
    }

@router.delete("/{doctor_id}")
def delete_doctor(doctor_id: int, role: str = "user", db: Session = Depends(get_db)):
    if role != "admin":
        raise HTTPException(status_code=403, detail="Access denied. Only admins can delete doctors.")
    
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    db.delete(doctor)
    db.commit()
    return {"message": "Doctor record removed"}