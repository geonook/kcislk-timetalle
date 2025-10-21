import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.timetable import db
from src.routes.timetable import timetable_bp
from src.routes.student import student_bp
from src.routes.midterm_proctor import midterm_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app)

app.register_blueprint(timetable_bp, url_prefix='/api')
app.register_blueprint(student_bp, url_prefix='/api')
app.register_blueprint(midterm_bp, url_prefix='/api/midterm')

# Database configuration
db_path = os.environ.get('DATABASE_PATH', os.path.join(os.path.dirname(__file__), 'database', 'app.db'))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Ensure database directory exists
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# 初始化資料庫
db.init_app(app)

print("Attempting to create application context...")
with app.app_context():
    print("Application context entered. Attempting to create database tables...")
    db.create_all()
    print("Database tables created successfully.")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404



