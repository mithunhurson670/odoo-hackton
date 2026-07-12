from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), nullable=False) # Fleet Manager, Driver, Safety Officer, Financial Analyst[cite: 1]

class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reg_number = db.Column(db.String(50), unique=True, nullable=False) # Unique[cite: 1]
    model = db.Column(db.String(100), nullable=False)
    v_type = db.Column(db.String(50), nullable=False)
    max_load = db.Column(db.Float, nullable=False)
    odometer = db.Column(db.Float, default=0.0)
    acquisition_cost = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="Available") # Available, On Trip, In Shop, Retired[cite: 1]

class Driver(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(100), nullable=False)
    license_expiry = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(50), default="Available") # Available, On Trip, Off Duty, Suspended[cite: 1]

class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    cargo_weight = db.Column(db.Float, nullable=False)
    distance = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="Draft") # Draft -> Dispatched -> Completed -> Cancelled[cite: 1]
    
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('driver.id'), nullable=False)

class MaintenanceLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    cost = db.Column(db.Float, default=0.0)
    is_closed = db.Column(db.Boolean, default=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)

class FuelLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    liters = db.Column(db.Float, nullable=False)
    cost = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)