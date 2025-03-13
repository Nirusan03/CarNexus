# routes/booking_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.mongo_connection import mongo

booking_bp = Blueprint("booking", __name__)

@booking_bp.route("/create", methods=["POST"])
@jwt_required()
def create_booking():
    data = request.get_json()
    user = get_jwt_identity()  # Extract email and role_id from token

    if user["role_id"] != 1:  # Only customers can create bookings
        return jsonify({"msg": "Only customers can create bookings"}), 403

    required_fields = ["business_email", "service_type", "pickup_time", "dropoff_time"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"msg": "All fields are required"}), 400

    booking = {
        "customer_email": user["email"],
        "business_email": data["business_email"],
        "service_type": data["service_type"],
        "pickup_time": data["pickup_time"],
        "dropoff_time": data["dropoff_time"],
        "status": "Pending"
    }

    # Insert booking into `bookings` collection
    mongo.db.bookings.insert_one(booking)

    # Update customer history
    mongo.db.customers.update_one(
        {"email": user["email"]},
        {"$push": {"bookings": booking}}
    )

    # Update service owner bookings
    mongo.db.service_owners.update_one(
        {"email": data["business_email"]},
        {"$push": {"bookings": booking}}
    )

    return jsonify({"msg": "Booking created successfully"}), 201
