from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.database import engine, Base, get_db
from backend.routes import appointments, patients, doctors, auth
from backend import models

# Initialize database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MediCore Hospital Management API")

# Enable CORS so the frontend (e.g., localhost:3000) can interact with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registering the routers from the routes directory
app.include_router(appointments.router, prefix="/appointments", tags=["Appointments"])
app.include_router(patients.router, prefix="/patients", tags=["Patients"])
app.include_router(doctors.router, prefix="/doctors", tags=["Doctors"])

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "online", "message": "MediCore HMS API is running"}

@app.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    """Dashboard stats used by the frontend."""
    doctors_count = db.query(models.Doctor).count()
    appointments_count = db.query(models.Appointment).count()
    return {"doctors": doctors_count, "appointments": appointments_count}