# models/user_model.py
from db.mongo_connection import mongo

class UserModel:
    @staticmethod
    def create_user(username, email, hashed_password, role_id):
        user = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "role_id": role_id  # 1 = customer, 2 = service owner
        }
        mongo.db.users.insert_one(user)

        # If user is a customer, create an entry in 'customers'
        if role_id == 1:
            mongo.db.customers.insert_one({
                "email": email,
                "bookings": [],
                "vehicle_info": {}
            })

        # If user is a service owner, create an entry in 'service_owners'
        elif role_id == 2:
            mongo.db.service_owners.insert_one({
                "email": email,
                "center_info": {},
                "bookings": []
            })

    @staticmethod
    def find_user_by_email(email):
        return mongo.db.users.find_one({"email": email})
