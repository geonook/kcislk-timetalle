import os
from flask import Flask, send_from_directory, render_template
from flask_cors import CORS
from src.models.timetable import db
from src.routes.timetable import timetable_bp
from src.routes.student import student_bp

# Configure Flask app with both static and template folders
template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates')
static_dir = os.path.join(os.path.dirname(__file__), 'static')

app = Flask(__name__,
           static_folder=static_dir,
           template_folder=template_dir)
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app)

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
    if ClassInfo.query.count() == 0:
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
    else:
        print("✅ 數據庫已有數據，跳過初始化")

print("Attempting to create application context...")
with app.app_context():
    print("Application context entered. Attempting to create database tables...")
    db.create_all()
    print("Database tables created successfully.")

    # 初始化數據
    initialize_data()

# Frontend page routes
@app.route('/')
def index():
    """班級課表查詢首頁"""
    return render_template('index.html')

@app.route('/student')
def student_timetable():
    """學生課表查詢頁面"""
    return render_template('student.html')

# Static file serving
@app.route('/<path:filename>')
def serve_static(filename):
    """處理靜態檔案請求"""
    static_folder_path = app.static_folder
    if static_folder_path and os.path.exists(os.path.join(static_folder_path, filename)):
        return send_from_directory(static_folder_path, filename)
    else:
        return "File not found", 404



