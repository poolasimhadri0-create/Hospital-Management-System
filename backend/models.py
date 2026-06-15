from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True)
    password = Column(String(255))
    role = Column(String(20), default="patient")
    is_approved = Column(Boolean, default=True)

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer, 
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True
    )
    name = Column(String(100))
    age = Column(Integer)
    gender = Column(String(20))
    problem = Column(String(255))
    address = Column(String(255))
    hospital_name = Column(String(100))


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    specialization = Column(String(100))


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id", ondelete="CASCADE")
    )

    doctor_id = Column(
        Integer,
        ForeignKey("doctors.id", ondelete="CASCADE")
    )

    date = Column(String(30))
    time = Column(String(20), nullable=True)
    status = Column(String(20), default="Pending")