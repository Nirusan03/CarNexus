# db/mongo_connection.py
from flask_pymongo import PyMongo
from flask import Flask
import config

mongo = PyMongo()

def init_db(app: Flask):
    app.config["MONGO_URI"] = config.MONGO_URI
    mongo.init_app(app)
    return mongo.db
