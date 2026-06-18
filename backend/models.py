from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(50))  # admin, doctor, patient

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    age = Column(Integer)
    gender = Column(String(20))
    problem = Column(String(500))
    address = Column(String(500))
    hospital_name = Column(String(255))

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    specialization = Column(String(255))

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    date = Column(String(50))
    time = Column(String(50), nullable=True)
    status = Column(String(50), default="Pending")