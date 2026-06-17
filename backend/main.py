from fastapi import FastAPI, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import os
import uvicorn
from database import engine, Base, get_db
import models  # Required so Base.metadata knows about the tables

Base.metadata.create_all(bind=engine)

from auth import router as auth_router
from routes.patients import router as patient_router
from routes.doctors import router as doctor_router
from routes.appointments import router as appointment_router

app = FastAPI()

@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"message": f"The route '{request.url.path}' was not found on this server."}
    )

@app.get("/")
def root():
    return {"message": "Hospital Management Backend is running perfectly!"}

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return {
        "doctors": db.query(models.Doctor).count(),
        "appointments": db.query(models.Appointment).count(),
        "patients": db.query(models.Patient).count()
    }

@app.put("/appointments/{id}/accept")
def accept_appointment(id: int, time: str, db: Session = Depends(get_db)):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.status = "Accepted"
    appointment.time = time
    db.commit()
    return {"message": "Appointment Accepted and Offer Letter generated", "time": time}

@app.get("/patients/me/{username}")
def get_my_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Try finding by user_id link first
    patient = db.query(models.Patient).filter(models.Patient.user_id == user.id).first()
    # Fallback: Find by name matching username
    if not patient:
        patient = db.query(models.Patient).filter(models.Patient.name == username).first()
    return patient

@app.get("/appointments/me/{username}")
def get_my_appointments(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user: return []
    
    patient = db.query(models.Patient).filter(models.Patient.user_id == user.id).first()
    if not patient:
        patient = db.query(models.Patient).filter(models.Patient.name == username).first()
        
    if not patient:
        return []
    return db.query(models.Appointment).filter(models.Appointment.patient_id == patient.id).all()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"]
)

app.include_router(
    patient_router,
    prefix="/patients",
    tags=["Patients"]
)

app.include_router(
    doctor_router,
    prefix="/doctors",
    tags=["Doctors"]
)

app.include_router(
    appointment_router,
    prefix="/appointments",
    tags=["Appointments"]
)

if __name__ == "__main__":
    # Render provides the port via the PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)