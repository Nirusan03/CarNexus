# routes/booking_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.mongo_connection import mongo

booking_bp = Blueprint("booking", __name__)

@booking_bp.route("/create", methods=["POST"])
@jwt_required()
def create_booking():
    data = request.get_json()
    user_email = get_jwt_identity()

    booking = {
        "user_email": user_email,
        "business_id": data.get("business_id"),
        "service_type": data.get("service_type"),
        "pickup_time": data.get("pickup_time"),
        "dropoff_time": data.get("dropoff_time"),
        "status": "Pending"
    }

    mongo.db.bookings.insert_one(booking)
    return jsonify({"msg": "Booking created successfully"}), 201

@booking_bp.route("/history", methods=["GET"])
@jwt_required()
def booking_history():
    user_email = get_jwt_identity()
    bookings = list(mongo.db.bookings.find({"user_email": user_email}, {"_id": 0}))
    
    return jsonify(bookings), 200
