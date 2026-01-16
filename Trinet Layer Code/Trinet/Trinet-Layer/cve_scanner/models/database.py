import os
from sqlalchemy import create_engine, Column, String, DateTime, Enum, Text, Integer, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import enum

DATABASE_URL = os.environ.get("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ScanStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class Severity(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

class Scan(Base):
    __tablename__ = "scans"
    
    scan_id = Column(String(36), primary_key=True)
    target_url = Column(String(2048), nullable=False)
    status = Column(Enum(ScanStatus), default=ScanStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    client_ip = Column(String(45), nullable=True)
    templates_loaded = Column(Integer, nullable=True, default=0)
    requests_sent = Column(Integer, nullable=True, default=0)
    matches_found = Column(Integer, nullable=True, default=0)
    execution_time = Column(Float, nullable=True, default=0)
    
    findings = relationship("Finding", back_populates="scan", cascade="all, delete-orphan")

class Finding(Base):
    __tablename__ = "findings"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    scan_id = Column(String(36), ForeignKey("scans.scan_id"), nullable=False)
    cve_id = Column(String(50), nullable=False)
    severity = Column(Enum(Severity), nullable=False)
    endpoint = Column(String(2048), nullable=True)
    template_name = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    detected_at = Column(DateTime, default=datetime.utcnow)
    
    scan = relationship("Scan", back_populates="findings")

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
