# routes/business_routes.py
from flask import Blueprint, request, jsonify
from db.mongo_connection import mongo

business_bp = Blueprint("business", __name__)

@business_bp.route("/business-owners", methods=["POST"])
def add_business_owner():
    data = request.get_json()
    
    if not data.get("name") or not data.get("location") or not data.get("contact") or not data.get("rating"):
        return jsonify({"msg": "All fields are required"}), 400

    business_owner = {
        "name": data["name"],
        "location": data["location"],
        "contact": data["contact"],
        "rating": data["rating"]
    }

    mongo.db.business_owners.insert_one(business_owner)
    return jsonify({"msg": "Business owner added successfully"}), 201

@business_bp.route("/business-owners", methods=["GET"])
def get_all_business_owners():
    owners = list(mongo.db.business_owners.find({}, {"_id": 0}))
    return jsonify(owners), 200
