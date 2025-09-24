import os
from flask import Flask
from flask_cors import CORS
from src.models.timetable import db
from src.routes.timetable import timetable_bp
from src.routes.student import student_bp

# Configure Flask app as pure API service (no static/template folders)
app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for React frontend (local development and Zeabur deployment)
allowed_origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://kcislk-timetable.zeabur.app',
    'https://kcislk-timetable-frontend.zeabur.app',
    # Add any additional frontend domains
]

# Get allowed origins from environment or use defaults
custom_origins = os.getenv('ALLOWED_ORIGINS', '').split(',') if os.getenv('ALLOWED_ORIGINS') else []
all_origins = allowed_origins + [origin.strip() for origin in custom_origins if origin.strip()]

CORS(app, origins=all_origins,
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=False)

app.register_blueprint(timetable_bp, url_prefix='/api')
app.register_blueprint(student_bp, url_prefix='/api')

# Database configuration
db_path = os.environ.get('DATABASE_PATH', os.path.join(os.path.dirname(__file__), 'database', 'app.db'))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Ensure database directory exists
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# 初始化資料庫
db.init_app(app)

def initialize_data():
    """初始化數據庫並載入初始數據"""
    from src.data_loader import load_timetable_data
    from src.data_loader_student import load_all_data

    print("檢查數據庫是否需要初始化...")

    # 檢查是否已有數據
    from src.models.timetable import ClassInfo
    from src.models.student import HomeRoomTimetable

    class_info_count = ClassInfo.query.count()
    homeroom_count = HomeRoomTimetable.query.count()

    print(f"現有資料狀況: ClassInfo={class_info_count}, HomeRoom={homeroom_count}")

    if class_info_count == 0:
        print("數據庫為空，開始載入初始數據...")

        # 載入課表數據
        try:
            success1 = load_timetable_data()
            success2 = load_all_data()

            if success1:
                print("✅ 課表數據載入成功")
            else:
                print("❌ 課表數據載入失敗")

            if success2:
                print("✅ 學生數據載入成功")
            else:
                print("❌ 學生數據載入失敗")

        except Exception as e:
            print(f"❌ 數據載入過程中發生錯誤: {e}")
    elif homeroom_count == 0:
        print("HomeRoom 資料缺失，只載入學生相關資料...")
        try:
            success = load_all_data()
            if success:
                print("✅ 學生資料補載入成功")
            else:
                print("❌ 學生資料補載入失敗")
        except Exception as e:
            print(f"❌ 學生資料載入過程中發生錯誤: {e}")
    else:
        print("✅ 數據庫已有完整數據，跳過初始化")

print("Attempting to create application context...")
with app.app_context():
    print("Application context entered. Attempting to create database tables...")
    db.create_all()
    print("Database tables created successfully.")

    # 初始化數據
    initialize_data()

# API Routes
@app.route('/')
def api_info():
    """API 資訊端點"""
    return {
        'name': 'KCISLK 課表查詢系統 API',
        'version': '1.0.0',
        'description': '康橋國際學校林口校區小學部課表查詢系統 API',
        'endpoints': {
            'health': '/health',
            'students': '/api/students',
            'timetables': '/api/timetables'
        },
        'status': 'running'
    }

@app.route('/health')
def health_check():
    """健康檢查端點"""
    return {
        'status': 'healthy',
        'service': 'kcislk-timetable-api',
        'version': '1.0.0'
    }



