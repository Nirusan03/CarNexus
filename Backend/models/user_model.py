# models/user_model.py
from db.mongo_connection import mongo

class UserModel:
    @staticmethod
    def create_user(username, email, hashed_password, role_id, extra_data):
        user = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "role_id": role_id  # 1 = customer, 2 = service owner
        }
        mongo.db.users.insert_one(user)

        if role_id == 1:  # Customer
            mongo.db.customers.insert_one({
                "email": email,
                "vehicle_type": extra_data.get("vehicle_type"),
                "purchase_date": extra_data.get("purchase_date"),
                "ownership_status": extra_data.get("ownership_status"),  # First-hand or second-hand
                "bookings": []
            })

        elif role_id == 2:  # Service Owner
            mongo.db.service_owners.insert_one({
                "email": email,
                "business_name": extra_data.get("business_name"),
                "location": extra_data.get("location"),
                "contact": extra_data.get("contact"),
                "rating": extra_data.get("rating"),
                "bookings": []
            })

    @staticmethod
    def find_user_by_email(email):
        return mongo.db.users.find_one({"email": email})
