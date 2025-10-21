from flask import Blueprint, jsonify, request, send_file
from src.models.timetable import db, ClassInfo, Teacher
from src.models.midterm_proctor import MidtermProctor
from datetime import datetime
import json
import os
import csv
from io import StringIO, BytesIO

midterm_bp = Blueprint('midterm', __name__)

# 讀取考試時程資料
def load_midterm_schedule():
    """載入期中考時程資料"""
    schedule_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'midterm_schedule.json')
    with open(schedule_file, 'r', encoding='utf-8') as f:
        return json.load(f)

@midterm_bp.route('/schedule', methods=['GET'])
def get_midterm_schedule():
    """取得完整考試時程"""
    try:
        schedule = load_midterm_schedule()
        return jsonify({
            'success': True,
            'schedule': schedule
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@midterm_bp.route('/proctors', methods=['GET'])
def get_all_proctors():
    """取得所有監考記錄，支援篩選"""
    try:
        query = MidtermProctor.query

        # 篩選參數
        exam_date = request.args.get('date')
        grade = request.args.get('grade')
        exam_type = request.args.get('exam_type')
        class_name = request.args.get('class_name')

        if exam_date:
            query = query.filter(MidtermProctor.exam_date == datetime.strptime(exam_date, '%Y-%m-%d').date())
        if grade:
            query = query.filter(MidtermProctor.grade == grade)
        if exam_type:
            query = query.filter(MidtermProctor.exam_type == exam_type)
        if class_name:
            query = query.filter(MidtermProctor.class_name.ilike(f'%{class_name}%'))

        proctors = query.order_by(MidtermProctor.exam_date, MidtermProctor.period, MidtermProctor.class_name).all()

        return jsonify({
            'success': True,
            'proctors': [p.to_dict() for p in proctors],
            'count': len(proctors)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@midterm_bp.route('/proctors/<int:proctor_id>', methods=['GET'])
def get_proctor(proctor_id):
    """取得特定監考記錄"""
    try:
        proctor = MidtermProctor.query.get(proctor_id)
        if not proctor:
            return jsonify({
                'success': False,
                'error': '找不到該監考記錄'
            }), 404

        return jsonify({
            'success': True,
            'proctor': proctor.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@midterm_bp.route('/proctors', methods=['POST'])
def create_proctor():
    """新增監考記錄"""
    try:
        data = request.get_json()

        # 驗證必填欄位
        required_fields = ['exam_date', 'day_name', 'period', 'period_time', 'grade', 'class_name', 'exam_type']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'缺少必填欄位: {field}'
                }), 400

        # 檢查是否已存在
        existing = MidtermProctor.query.filter_by(
            exam_date=datetime.strptime(data['exam_date'], '%Y-%m-%d').date(),
            period=data['period'],
            class_name=data['class_name']
        ).first()

        if existing:
            return jsonify({
                'success': False,
                'error': '該班級在此時段已有監考記錄，請使用更新功能'
            }), 409

        # 建立新記錄
        proctor = MidtermProctor(
            exam_date=datetime.strptime(data['exam_date'], '%Y-%m-%d').date(),
            day_name=data['day_name'],
            period=data['period'],
            period_time=data['period_time'],
            grade=data['grade'],
            class_name=data['class_name'],
            exam_type=data['exam_type'],
            proctor_teacher=data.get('proctor_teacher'),
            classroom=data.get('classroom'),
            notes=data.get('notes')
        )

        db.session.add(proctor)
        db.session.commit()

        return jsonify({
            'success': True,
            'proctor': proctor.to_dict(),
            'message': '監考記錄新增成功'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@midterm_bp.route('/proctors/<int:proctor_id>', methods=['PUT'])
def update_proctor(proctor_id):
    """更新監考記錄"""
    try:
        proctor = MidtermProctor.query.get(proctor_id)
        if not proctor:
            return jsonify({
                'success': False,
                'error': '找不到該監考記錄'
            }), 404

        data = request.get_json()

        # 更新可編輯欄位
        if 'proctor_teacher' in data:
            proctor.proctor_teacher = data['proctor_teacher']
        if 'classroom' in data:
            proctor.classroom = data['classroom']
        if 'notes' in data:
            proctor.notes = data['notes']

        proctor.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'success': True,
            'proctor': proctor.to_dict(),
            'message': '監考記錄更新成功'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@midterm_bp.route('/proctors/<int:proctor_id>', methods=['DELETE'])
def delete_proctor(proctor_id):
    """刪除監考記錄"""
    try:
        proctor = MidtermProctor.query.get(proctor_id)
        if not proctor:
            return jsonify({
                'success': False,
                'error': '找不到該監考記錄'
            }), 404

        db.session.delete(proctor)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': '監考記錄刪除成功'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@midterm_bp.route('/proctors/class/<class_name>', methods=['GET'])
def get_proctors_by_class(class_name):
    """取得特定班級的所有監考安排"""
    try:
        proctors = MidtermProctor.query.filter_by(class_name=class_name).order_by(
            MidtermProctor.exam_date, MidtermProctor.period
        ).all()

        return jsonify({
            'success': True,
            'class_name': class_name,
            'proctors': [p.to_dict() for p in proctors],
            'count': len(proctors)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@midterm_bp.route('/proctors/teacher/<teacher_name>', methods=['GET'])
def get_proctors_by_teacher(teacher_name):
    """取得特定老師的監考時段"""
    try:
        proctors = MidtermProctor.query.filter_by(proctor_teacher=teacher_name).order_by(
            MidtermProctor.exam_date, MidtermProctor.period
        ).all()

        return jsonify({
            'success': True,
            'teacher_name': teacher_name,
            'proctors': [p.to_dict() for p in proctors],
            'count': len(proctors)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@midterm_bp.route('/proctors/date/<date>', methods=['GET'])
def get_proctors_by_date(date):
    """取得特定日期的所有監考安排"""
    try:
        exam_date = datetime.strptime(date, '%Y-%m-%d').date()
        proctors = MidtermProctor.query.filter_by(exam_date=exam_date).order_by(
            MidtermProctor.period, MidtermProctor.class_name
        ).all()

        return jsonify({
            'success': True,
            'date': date,
            'proctors': [p.to_dict() for p in proctors],
            'count': len(proctors)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@midterm_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """取得統計資料"""
    try:
        # 總記錄數
        total_proctors = MidtermProctor.query.count()

        # 已填寫監考老師的記錄數
        assigned_proctors = MidtermProctor.query.filter(MidtermProctor.proctor_teacher.isnot(None)).count()

        # 按年級統計
        grade_stats = {}
        for grade in ['G1', 'G2', 'G3', 'G4', 'G5', 'G6']:
            total = MidtermProctor.query.filter_by(grade=grade).count()
            assigned = MidtermProctor.query.filter_by(grade=grade).filter(
                MidtermProctor.proctor_teacher.isnot(None)
            ).count()
            grade_stats[grade] = {
                'total': total,
                'assigned': assigned,
                'percentage': round((assigned / total * 100) if total > 0 else 0, 1)
            }

        # 按日期統計
        date_stats = {}
        schedule = load_midterm_schedule()
        for exam_date in schedule['exam_dates']:
            date = exam_date['date']
            total = MidtermProctor.query.filter_by(exam_date=datetime.strptime(date, '%Y-%m-%d').date()).count()
            assigned = MidtermProctor.query.filter_by(
                exam_date=datetime.strptime(date, '%Y-%m-%d').date()
            ).filter(MidtermProctor.proctor_teacher.isnot(None)).count()
            date_stats[date] = {
                'total': total,
                'assigned': assigned,
                'percentage': round((assigned / total * 100) if total > 0 else 0, 1)
            }

        return jsonify({
            'success': True,
            'statistics': {
                'total_proctors': total_proctors,
                'assigned_proctors': assigned_proctors,
                'unassigned_proctors': total_proctors - assigned_proctors,
                'completion_percentage': round((assigned_proctors / total_proctors * 100) if total_proctors > 0 else 0, 1),
                'grade_stats': grade_stats,
                'date_stats': date_stats
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@midterm_bp.route('/proctors/export', methods=['GET'])
def export_proctors():
    """匯出監考記錄為 CSV"""
    try:
        # 取得所有監考記錄
        proctors = MidtermProctor.query.order_by(
            MidtermProctor.exam_date, MidtermProctor.period, MidtermProctor.class_name
        ).all()

        # 建立 CSV
        output = StringIO()
        writer = csv.writer(output)

        # 寫入標題
        writer.writerow([
            '\ufeff日期', '星期', '節次', '時間', '年級', '班級', '考試類型', '監考老師', '教室', '備註'
        ])

        # 寫入資料
        for p in proctors:
            writer.writerow([
                p.exam_date.strftime('%Y-%m-%d'),
                p.day_name,
                p.period,
                p.period_time,
                p.grade,
                p.class_name,
                p.exam_type,
                p.proctor_teacher or '',
                p.classroom or '',
                p.notes or ''
            ])

        # 轉換為 bytes
        output.seek(0)
        csv_data = output.getvalue().encode('utf-8-sig')

        return send_file(
            BytesIO(csv_data),
            mimetype='text/csv',
            as_attachment=True,
            download_name='midterm_proctors.csv'
        )
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@midterm_bp.route('/initialize', methods=['POST'])
def initialize_proctor_records():
    """初始化監考記錄（為所有班級建立空白記錄）"""
    try:
        # 載入考試時程
        schedule = load_midterm_schedule()

        # 取得所有班級
        classes = ClassInfo.query.all()
        class_by_grade = {}
        for cls in classes:
            grade = cls.grade
            if grade not in class_by_grade:
                class_by_grade[grade] = []
            class_by_grade[grade].append(cls.class_name)

        created_count = 0
        skipped_count = 0

        # 遍歷考試日期
        for exam_date_info in schedule['exam_dates']:
            exam_date = datetime.strptime(exam_date_info['date'], '%Y-%m-%d').date()
            day_name = exam_date_info['day_name']

            # 遍歷該日的考試時段
            for session in exam_date_info['exam_sessions']:
                period = session['period']
                period_time = session['time']
                exam_type = session['exam_type']

                # 遍歷該時段的年級
                for grade in session['grades']:
                    # 為該年級的所有班級建立記錄
                    if grade in class_by_grade:
                        for class_name in class_by_grade[grade]:
                            # 檢查是否已存在
                            existing = MidtermProctor.query.filter_by(
                                exam_date=exam_date,
                                period=period,
                                class_name=class_name
                            ).first()

                            if not existing:
                                proctor = MidtermProctor(
                                    exam_date=exam_date,
                                    day_name=day_name,
                                    period=period,
                                    period_time=period_time,
                                    grade=grade,
                                    class_name=class_name,
                                    exam_type=exam_type
                                )
                                db.session.add(proctor)
                                created_count += 1
                            else:
                                skipped_count += 1

        db.session.commit()

        return jsonify({
            'success': True,
            'message': '監考記錄初始化完成',
            'created': created_count,
            'skipped': skipped_count
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
