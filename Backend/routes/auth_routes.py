from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user_model import UserModel
import bcrypt
import json

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role_id = data.get("role_id")  # 1 = customer, 2 = service owner
    extra_data = data.get("extra_data", {})

    if role_id not in [1, 2]:
        return jsonify({"msg": "Invalid role ID"}), 400

    if UserModel.find_user_by_email(email):
        return jsonify({"msg": "User already exists"}), 400

    required_fields = ["username", "email", "password"]
    if not all(data.get(field) for field in required_fields):
        return jsonify({"msg": "Missing required fields"}), 400

    if role_id == 1:  # Customer
        if not all(extra_data.get(field) for field in ["vehicle_type", "purchase_date", "ownership_status"]):
            return jsonify({"msg": "Missing customer vehicle details"}), 400

    elif role_id == 2:  # Service Owner
        if not all(extra_data.get(field) for field in ["business_name", "location", "contact", "rating"]):
            return jsonify({"msg": "Missing business details"}), 400

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    UserModel.create_user(username, email, hashed_password, role_id, extra_data)

    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = UserModel.find_user_by_email(email)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=json.dumps({"email": user["email"], "role_id": user["role_id"]}))
    return jsonify({
        "access_token": access_token,
        "role_id": user["role_id"]
    }), 200
