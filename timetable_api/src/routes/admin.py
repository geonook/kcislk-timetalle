"""
管理員 API 路由
用於資料庫維護和遷移操作
"""
from flask import Blueprint, jsonify, request
from sqlalchemy import text
from src.models.timetable import db
import os

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# 簡單的 API 金鑰驗證（環境變數配置）
ADMIN_API_KEY = os.environ.get('ADMIN_API_KEY', 'dev-admin-key-change-in-production')

def verify_admin_key():
    """驗證管理員 API 金鑰"""
    api_key = request.headers.get('X-Admin-Key')
    if api_key != ADMIN_API_KEY:
        return False
    return True

@admin_bp.route('/migrate-john-teacher', methods=['POST'])
def migrate_john_teacher():
    """
    合併重複的教師記錄：將 "John" 合併至 "John Adams Villamoran"

    使用方式：
    POST /api/admin/migrate-john-teacher
    Headers: X-Admin-Key: <your-admin-key>

    回傳：
    {
      "success": true,
      "message": "教師記錄合併完成",
      "details": {
        "timetable_updated": 2,
        "english_timetable_updated": 2,
        "teachers_deleted": 1,
        "final_teacher_count": 1,
        "final_course_count": 6
      }
    }
    """
    # 驗證 API 金鑰
    if not verify_admin_key():
        return jsonify({
            'success': False,
            'error': 'Unauthorized: Invalid or missing X-Admin-Key header'
        }), 401

    try:
        # 開始事務
        # 1. 更新 timetable 表（舊數據表）
        result_timetable = db.session.execute(
            text("UPDATE timetable SET teacher = 'John Adams Villamoran' WHERE teacher = 'John'")
        )
        timetable_updated = result_timetable.rowcount

        # 2. 更新 english_timetable 表（實際使用中）
        result_english = db.session.execute(
            text("UPDATE english_timetable SET teacher = 'John Adams Villamoran' WHERE teacher = 'John'")
        )
        english_timetable_updated = result_english.rowcount

        # 3. 從 teachers 表中刪除重複的 "John"
        result_delete = db.session.execute(
            text("DELETE FROM teachers WHERE teacher_name = 'John'")
        )
        teachers_deleted = result_delete.rowcount

        # 提交事務
        db.session.commit()

        # 4. 驗證結果
        # 檢查 teachers 表中 John 相關記錄
        final_teachers = db.session.execute(
            text("SELECT teacher_name FROM teachers WHERE teacher_name LIKE '%John%'")
        ).fetchall()

        # 檢查 english_timetable 中的課程數量
        final_courses = db.session.execute(
            text("SELECT COUNT(*) as count FROM english_timetable WHERE teacher = 'John Adams Villamoran'")
        ).fetchone()

        return jsonify({
            'success': True,
            'message': '教師記錄合併完成',
            'details': {
                'timetable_updated': timetable_updated,
                'english_timetable_updated': english_timetable_updated,
                'teachers_deleted': teachers_deleted,
                'final_teacher_count': len(final_teachers),
                'final_teacher_names': [t[0] for t in final_teachers],
                'final_course_count': final_courses[0] if final_courses else 0
            }
        }), 200

    except Exception as e:
        # 發生錯誤時回滾
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'資料庫操作失敗: {str(e)}'
        }), 500

@admin_bp.route('/verify-john-teacher', methods=['GET'])
def verify_john_teacher():
    """
    驗證 John 教師的資料狀態

    使用方式：
    GET /api/admin/verify-john-teacher
    Headers: X-Admin-Key: <your-admin-key>

    回傳當前資料庫中 John 相關的教師和課程資訊
    """
    # 驗證 API 金鑰
    if not verify_admin_key():
        return jsonify({
            'success': False,
            'error': 'Unauthorized: Invalid or missing X-Admin-Key header'
        }), 401

    try:
        # 查詢 teachers 表
        teachers = db.session.execute(
            text("SELECT teacher_name FROM teachers WHERE teacher_name LIKE '%John%'")
        ).fetchall()

        # 查詢 english_timetable 表
        courses = db.session.execute(
            text("""
                SELECT teacher, COUNT(*) as course_count
                FROM english_timetable
                WHERE teacher LIKE '%John%'
                GROUP BY teacher
            """)
        ).fetchall()

        # 查詢 timetable 表
        old_courses = db.session.execute(
            text("""
                SELECT teacher, COUNT(*) as course_count
                FROM timetable
                WHERE teacher LIKE '%John%'
                GROUP BY teacher
            """)
        ).fetchall()

        return jsonify({
            'success': True,
            'data': {
                'teachers': [t[0] for t in teachers],
                'english_timetable': [{'teacher': c[0], 'course_count': c[1]} for c in courses],
                'timetable': [{'teacher': c[0], 'course_count': c[1]} for c in old_courses]
            }
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'查詢失敗: {str(e)}'
        }), 500

@admin_bp.route('/health', methods=['GET'])
def health():
    """健康檢查端點（不需要驗證）"""
    return jsonify({
        'success': True,
        'message': 'Admin API is running'
    }), 200
