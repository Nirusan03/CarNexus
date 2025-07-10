from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.mongo_connection import mongo

account_bp = Blueprint("account", __name__)

@account_bp.route("/details", methods=["GET"])
@jwt_required()
def get_user_account():
    """Fetch user details and booking history based on logged-in user."""
    user_str = get_jwt_identity()

    # Decode user JSON from JWT token
    import json
    try:
        user = json.loads(user_str)
    except json.JSONDecodeError:
        return jsonify({"msg": "Invalid token format."}), 400

    # Fetch user details from `users` collection
    user_data = mongo.db.users.find_one({"email": user["email"]}, {"_id": 0, "password": 0})
    if not user_data:
        return jsonify({"msg": "User not found."}), 404

    # Fetch user's booking history
    booking_history = list(mongo.db.bookings.find({"customer_email": user["email"]}, {"_id": 0}))

    return jsonify({"user": user_data, "bookings": booking_history}), 200

@account_bp.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    """Returns user's notification messages."""
    user_str = get_jwt_identity()
    import json
    try:
        user = json.loads(user_str)
    except json.JSONDecodeError:
        return jsonify({"msg": "Invalid token format."}), 400

    user_email = user["email"]

    customer = mongo.db.customers.find_one({"email": user_email}, {"notifications": 1, "_id": 0})
    if not customer:
        return jsonify({"msg": "No notifications found"}), 404

    return jsonify({"notifications": customer.get("notifications", [])}), 200
