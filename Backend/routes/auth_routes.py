# routes/auth_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user_model import UserModel
import bcrypt

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")  # 'customer' or 'business_owner'

    if role not in ["customer", "business_owner"]:
        return jsonify({"msg": "Invalid role"}), 400

    if UserModel.find_user_by_email(email):
        return jsonify({"msg": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    UserModel.create_user(email, hashed_password, role)

    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = UserModel.find_user_by_email(email)
    if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity={"email": email, "role": user["role"]})
    return jsonify({"access_token": access_token, "role": user["role"]}), 200
