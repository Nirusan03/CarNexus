from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.mongo_connection import mongo

booking_bp = Blueprint("booking", __name__)

import json

@booking_bp.route("/create", methods=["POST"])
@jwt_required()
def create_booking():
    """Creates a new booking request (Only for Customers)."""
    user_str = get_jwt_identity()
    
    try:
        user = json.loads(user_str)  # Convert JSON string back to dictionary
    except json.JSONDecodeError:
        return jsonify({"msg": "Invalid token format."}), 400

    # Debugging: Should now be a dictionary
    print("Decoded JWT Identity:", user)  

    if not isinstance(user, dict) or "role_id" not in user or "email" not in user:
        return jsonify({"msg": "Invalid user data in token."}), 400

    # Only customers (role_id=1) can book services
    if user["role_id"] != 1:  
        return jsonify({"msg": "Only customers can create bookings"}), 403

    data = request.get_json()
    required_fields = ["service_email", "service_type", "pickup_time", "dropoff_time"]
    
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"msg": "All fields are required"}), 400

    # Extracted from JWT token
    booking = {
        "customer_email": user["email"],  
        "service_email": data["service_email"],
        "service_type": data["service_type"],
        "pickup_time": data["pickup_time"],
        "dropoff_time": data["dropoff_time"],
        "status": "Pending"
    }

    mongo.db.bookings.insert_one(booking)
    return jsonify({"msg": "Booking created successfully"}), 201

@booking_bp.route("/history", methods=["GET"])
@jwt_required()
def booking_history():
    """Fetches booking history for logged-in user (Customer or Service Owner)."""
    user = get_jwt_identity()  # Extracts email and role_id

    if user["role_id"] == 1:  # Customer
        bookings = list(mongo.db.bookings.find({"customer_email": user["email"]}, {"_id": 0}))
    else:  # Service Owner
        bookings = list(mongo.db.bookings.find({"service_email": user["email"]}, {"_id": 0}))

    return jsonify(bookings), 200
