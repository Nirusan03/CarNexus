# app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from db.mongo_connection import init_db
import config
from routes.auth_routes import auth_bp
from routes.booking_routes import booking_bp
from routes.business_routes import business_bp

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY

# Initialize extensions
CORS(app)
JWTManager(app)
db = init_db(app)

# Register Blueprints (Routes)
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(booking_bp, url_prefix="/booking")
app.register_blueprint(business_bp, url_prefix="/business")

if __name__ == "__main__":
    app.run(debug=True)
