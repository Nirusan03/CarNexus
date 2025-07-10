from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.mongo_connection import mongo
import json
from bson import ObjectId

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
    """Fetches booking history for logged-in user (Customer or Service Owner), including booking IDs."""
    import json
    from bson import ObjectId
    user_str = get_jwt_identity()

    try:
        user = json.loads(user_str)
    except json.JSONDecodeError:
        return jsonify({"msg": "Invalid token format."}), 400

    if user["role_id"] == 1:  # Customer
        bookings = list(mongo.db.bookings.find({"customer_email": user["email"]}))
    else:  # Service Owner
        bookings = list(mongo.db.bookings.find({"service_email": user["email"]}))

    # Convert ObjectId to string for frontend/postman usage
    for booking in bookings:
        booking["_id"] = str(booking["_id"])

    return jsonify(bookings), 200



@booking_bp.route("/update-status/<booking_id>", methods=["PATCH"])
@jwt_required()
def update_booking_status(booking_id):
    """Allows service owner to update booking status."""
    import json
    user_str = get_jwt_identity()

    try:
        user = json.loads(user_str)
    except json.JSONDecodeError:
        return jsonify({"msg": "Invalid token format."}), 400

    if user["role_id"] != 2:
        return jsonify({"msg": "Only service owners can update booking status"}), 403

    data = request.get_json()
    new_status = data.get("status")

    valid_statuses = ["Pending", "In Progress", "Ready for Pickup", "Completed"]
    if new_status not in valid_statuses:
        return jsonify({"msg": "Invalid status value"}), 400

    try:
        booking_obj_id = ObjectId(booking_id)
    except Exception:
        return jsonify({"msg": "Invalid booking ID format"}), 400

    result = mongo.db.bookings.update_one(
        {"_id": booking_obj_id, "service_email": user["email"]},
        {"$set": {"status": new_status}}
    )

    if result.matched_count == 0:
        return jsonify({"msg": "Booking not found or access denied"}), 404

    # Add notification to customer
    booking = mongo.db.bookings.find_one({"_id": booking_obj_id})
    if booking:
        mongo.db.customers.update_one(
            {"email": booking["customer_email"]},
            {"$push": {"notifications": f"Your booking status has been updated to '{new_status}'."}}
        )

    return jsonify({"msg": f"Status updated to '{new_status}'"}), 200


@booking_bp.route("/add-report/<booking_id>", methods=["PATCH"])
@jwt_required()
def add_service_report(booking_id):
    """Service owner adds report after completing service."""
    from bson import ObjectId
    import json

    user_str = get_jwt_identity()
    try:
        user = json.loads(user_str)
    except json.JSONDecodeError:
        return jsonify({"msg": "Invalid token format."}), 400

    if user["role_id"] != 2:
        return jsonify({"msg": "Only service owners can add service reports"}), 403

    try:
        booking_obj_id = ObjectId(booking_id)
    except Exception:
        return jsonify({"msg": "Invalid booking ID format"}), 400

    data = request.get_json()
    service_report = {
        "issues_found": data.get("issues_found"),
        "work_done": data.get("work_done"),
        "total_cost": data.get("total_cost")
    }

    if not all(service_report.values()):
        return jsonify({"msg": "All report fields are required"}), 400

    result = mongo.db.bookings.update_one(
        {"_id": booking_obj_id, "service_email": user["email"]},
        {"$set": {"service_report": service_report}}
    )

    if result.matched_count == 0:
        return jsonify({"msg": "Booking not found or access denied"}), 404

    return jsonify({"msg": "Service report added successfully"}), 200
