# models/user_model.py
from db.mongo_connection import mongo

class UserModel:
    @staticmethod
    def create_user(email, hashed_password):
        user = {
            "email": email,
            "password": hashed_password
        }
        mongo.db.users.insert_one(user)

    @staticmethod
    def find_user_by_email(email):
        return mongo.db.users.find_one({"email": email})
