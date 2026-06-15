from pydantic import BaseModel

class LoginSchema(BaseModel):
    username: str
    password: str
    role: str = "patient"


class PatientSchema(BaseModel):
    name: str
    age: int = 0
    gender: str = "Unknown"
    problem: str
    address: str = ""
    hospital_name: str = ""
    user_id: int = None


class DoctorSchema(BaseModel):
    name: str
    specialization: str


class AppointmentSchema(BaseModel):
    patient_id: int
    doctor_id: int
    date: str
    time: str = None
    status: str = "Pending"