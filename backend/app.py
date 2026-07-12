from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Vehicle, Driver, Trip, MaintenanceLog, FuelLog, User
from datetime import date

app = Flask(__name__)
CORS(app)

# Using local SQLite file for hackathon speed
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///transitops.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all() # Automatically generates local tables on launch

# --- MANDATORY DISPATCH VALIDATION ENDPOINT ---
@app.route('/api/trips/dispatch', methods=['POST'])
def dispatch_trip():
    data = request.json
    
    vehicle = Vehicle.query.get(data['vehicle_id'])
    driver = Driver.query.get(data['driver_id'])
    cargo_weight = float(data['cargo_weight'])
    
    # 1. Rule: Check status availability[cite: 1]
    if vehicle.status in ['In Shop', 'Retired', 'On Trip']:
        return jsonify({"error": "Vehicle is unavailable for selection."}), 400
        
    if driver.status in ['Suspended', 'Off Duty', 'On Trip'] or driver.license_expiry < date.today():
        return jsonify({"error": "Driver is unavailable or has an expired license."}), 400
        
    # 2. Rule: Check cargo weight capacity[cite: 1]
    if cargo_weight > vehicle.max_load:
        return jsonify({"error": f"Cargo weight exceeds vehicle capacity of {vehicle.max_load} kg."}), 400

    # 3. Rule: Automatic transition on dispatch[cite: 1]
    new_trip = Trip(
        source=data['source'],
        destination=data['destination'],
        cargo_weight=cargo_weight,
        distance=float(data['distance']),
        status="Dispatched",
        vehicle_id=vehicle.id,
        driver_id=driver.id
    )
    
    vehicle.status = "On Trip"
    driver.status = "On Trip"
    
    db.session.add(new_trip)
    db.session.commit()
    
    return jsonify({"message": "Trip validated and dispatched successfully!"}), 201

# --- KPI DASHBOARD DATA ---
@app.route('/api/dashboard/kpis', methods=['GET'])
def get_kpis():
    total_vehicles = Vehicle.query.count()
    available = Vehicle.query.filter_by(status="Available").count()
    in_shop = Vehicle.query.filter_by(status="In Shop").count()
    active_trips = Trip.query.filter_by(status="Dispatched").count()
    
    utilization = ((total_vehicles - available) / total_vehicles * 100) if total_vehicles > 0 else 0
    
    return jsonify({
        "active_vehicles": total_vehicles - available - in_shop,
        "available_vehicles": available,
        "vehicles_in_maintenance": in_shop,
        "active_trips": active_trips,
        "fleet_utilization_percent": round(utilization, 2)
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)