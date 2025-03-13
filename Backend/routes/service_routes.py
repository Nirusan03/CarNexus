from flask import Blueprint, request, jsonify
from db.mongo_connection import mongo

service_bp = Blueprint("service", __name__)

@service_bp.route("/service-owners", methods=["POST"])
def add_service_owner():
    """Adds a new service owner."""
    data = request.get_json()
    
    required_fields = ["email", "service_name", "location", "contact", "rating"]
    if not all(data.get(field) for field in required_fields):
        return jsonify({"msg": "All fields are required"}), 400

    service_owner = {
        "email": data["email"],  # This links to `users` collection
        "service_name": data["service_name"],
        "location": data["location"],
        "contact": data["contact"],
        "rating": data["rating"]
    }

    mongo.db.service_owners.insert_one(service_owner)
    return jsonify({"msg": "Service owner added successfully"}), 201


@service_bp.route("/service-owners", methods=["GET"])
def get_all_service_owners():
    """Retrieves all service owners, including their names from the users collection."""
    service_owners = list(mongo.db.service_owners.find({}, {"_id": 0}))

    for owner in service_owners:
        user = mongo.db.users.find_one({"email": owner["email"]}, {"username": 1, "_id": 0})
        owner["owner_name"] = user["username"] if user else "Unknown"

    return jsonify(service_owners), 200
