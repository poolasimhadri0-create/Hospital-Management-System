from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

# Read DATABASE_URL from Render environment variables, fallback to local for development
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:Simhadri%232005@127.0.0.1/hospital_db")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()