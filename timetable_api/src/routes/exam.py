"""
期中考監考管理 API 路由
提供考試場次查詢、班級查詢、監考分配、CSV匯出等功能
"""
from flask import Blueprint, jsonify, request, Response
from src.models.timetable import db
from src.models.exam import ExamSession, ClassExamInfo, ProctorAssignment
from datetime import datetime
import io
import csv

exam_bp = Blueprint('exam', __name__)


# ============================================================
# 考試場次 API
# ============================================================

@exam_bp.route('/exams/sessions', methods=['GET'])
def get_all_exam_sessions():
    """取得所有考試場次"""
    try:
        sessions = ExamSession.query.all()
        return jsonify({
            'success': True,
            'sessions': [session.to_dict() for session in sessions],
            'count': len(sessions)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@exam_bp.route('/exams/sessions/<int:session_id>', methods=['GET'])
def get_exam_session(session_id):
    """取得特定考試場次"""
    try:
        session = ExamSession.query.get(session_id)
        if not session:
            return jsonify({
                'success': False,
                'error': f'找不到 ID 為 {session_id} 的考試場次'
            }), 404

        return jsonify({
            'success': True,
            'session': session.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@exam_bp.route('/exams/sessions/by-date/<date>', methods=['GET'])
def get_sessions_by_date(date):
    """取得特定日期的所有考試場次"""
    try:
        sessions = ExamSession.query.filter_by(exam_date=date).all()
        return jsonify({
            'success': True,
            'date': date,
            'sessions': [session.to_dict() for session in sessions],
            'count': len(sessions)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# 班級考試資訊 API
# ============================================================

@exam_bp.route('/exams/classes', methods=['GET'])
def get_all_class_exam_info():
    """取得所有班級考試資訊"""
    try:
        classes = ClassExamInfo.query.all()
        return jsonify({
            'success': True,
            'classes': [cls.to_full_dict() for cls in classes],
            'count': len(classes)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@exam_bp.route('/exams/classes/grade-band/<grade_band>', methods=['GET'])
def get_classes_by_grade_band(grade_band):
    """取得特定 GradeBand 的所有班級"""
    try:
        # 查詢對應的 ExamSession
        session = ExamSession.query.filter_by(grade_band=grade_band).first()
        if not session:
            return jsonify({
                'success': False,
                'error': f'找不到 GradeBand: {grade_band}'
            }), 404

        # 查詢該 session 下的所有班級
        classes = ClassExamInfo.query.filter_by(exam_session_id=session.id).all()

        return jsonify({
            'success': True,
            'grade_band': grade_band,
            'exam_session': session.to_dict(),
            'classes': [cls.to_full_dict() for cls in classes],
            'count': len(classes)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@exam_bp.route('/exams/classes/<class_name>', methods=['GET'])
def get_class_exam_info(class_name):
    """取得特定班級的考試資訊"""
    try:
        class_info = ClassExamInfo.query.filter_by(class_name=class_name).first()
        if not class_info:
            return jsonify({
                'success': False,
                'error': f'找不到班級: {class_name}'
            }), 404

        return jsonify({
            'success': True,
            'class': class_info.to_full_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# 監考分配 API
# ============================================================

@exam_bp.route('/exams/proctors', methods=['GET'])
def get_all_proctors():
    """取得所有監考分配"""
    try:
        proctors = ProctorAssignment.query.all()
        return jsonify({
            'success': True,
            'proctors': [proctor.to_dict() for proctor in proctors],
            'count': len(proctors)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@exam_bp.route('/exams/proctors', methods=['POST'])
def create_proctor_assignment():
    """新增監考分配"""
    try:
        data = request.get_json()

        # 驗證必要欄位
        required_fields = ['class_exam_info_id', 'proctor_teacher', 'classroom']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'缺少必要欄位: {field}'
                }), 400

        # 檢查該班級是否已有監考分配
        existing = ProctorAssignment.query.filter_by(
            class_exam_info_id=data['class_exam_info_id']
        ).first()

        if existing:
            return jsonify({
                'success': False,
                'error': '該班級已有監考分配，請使用 PUT 方法更新'
            }), 400

        # 建立新的監考分配
        proctor = ProctorAssignment(
            class_exam_info_id=data['class_exam_info_id'],
            proctor_teacher=data['proctor_teacher'],
            classroom=data['classroom'],
            notes=data.get('notes', '')
        )

        db.session.add(proctor)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': '監考分配新增成功',
            'proctor': proctor.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@exam_bp.route('/exams/proctors/<int:proctor_id>', methods=['PUT'])
def update_proctor_assignment(proctor_id):
    """更新監考分配"""
    try:
        proctor = ProctorAssignment.query.get(proctor_id)
        if not proctor:
            return jsonify({
                'success': False,
                'error': f'找不到 ID 為 {proctor_id} 的監考分配'
            }), 404

        data = request.get_json()

        # 更新欄位
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
            'message': '監考分配更新成功',
            'proctor': proctor.to_dict()
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@exam_bp.route('/exams/proctors/<int:proctor_id>', methods=['DELETE'])
def delete_proctor_assignment(proctor_id):
    """刪除監考分配"""
    try:
        proctor = ProctorAssignment.query.get(proctor_id)
        if not proctor:
            return jsonify({
                'success': False,
                'error': f'找不到 ID 為 {proctor_id} 的監考分配'
            }), 404

        db.session.delete(proctor)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': '監考分配刪除成功'
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@exam_bp.route('/exams/proctors/batch', methods=['POST'])
def batch_create_proctor_assignments():
    """批次新增監考分配"""
    try:
        data = request.get_json()

        if 'assignments' not in data or not isinstance(data['assignments'], list):
            return jsonify({
                'success': False,
                'error': '請提供 assignments 陣列'
            }), 400

        created_count = 0
        updated_count = 0
        errors = []

        for assignment in data['assignments']:
            try:
                # 檢查必要欄位
                if 'class_exam_info_id' not in assignment:
                    errors.append(f"缺少 class_exam_info_id")
                    continue

                # 檢查是否已存在
                existing = ProctorAssignment.query.filter_by(
                    class_exam_info_id=assignment['class_exam_info_id']
                ).first()

                if existing:
                    # 更新現有記錄
                    if 'proctor_teacher' in assignment:
                        existing.proctor_teacher = assignment['proctor_teacher']
                    if 'classroom' in assignment:
                        existing.classroom = assignment['classroom']
                    if 'notes' in assignment:
                        existing.notes = assignment['notes']
                    existing.updated_at = datetime.utcnow()
                    updated_count += 1
                else:
                    # 建立新記錄
                    proctor = ProctorAssignment(
                        class_exam_info_id=assignment['class_exam_info_id'],
                        proctor_teacher=assignment.get('proctor_teacher', ''),
                        classroom=assignment.get('classroom', ''),
                        notes=assignment.get('notes', '')
                    )
                    db.session.add(proctor)
                    created_count += 1

            except Exception as e:
                errors.append(str(e))

        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'批次處理完成',
            'created': created_count,
            'updated': updated_count,
            'errors': errors
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# CSV 匯出 API
# ============================================================

@exam_bp.route('/exams/export/csv', methods=['GET'])
def export_all_to_csv():
    """匯出所有班級考試資料為 CSV (15 欄位格式)"""
    try:
        # 查詢所有班級考試資訊（包含 JOIN）
        classes = ClassExamInfo.query.join(ExamSession).all()

        # 建立 CSV
        output = io.StringIO()
        writer = csv.writer(output)

        # 寫入標題列（15 個欄位）
        headers = [
            'ClassName', 'Grade', 'Teacher', 'Level', 'Classroom',
            'GradeBand', 'Duration', 'Periods', 'Self-Study',
            'Preparation', 'ExamTime', 'Proctor', 'Subject', 'Count', 'Students'
        ]
        writer.writerow(headers)

        # 寫入資料列
        for cls in classes:
            session = cls.exam_session
            proctor = cls.proctor_assignment

            row = [
                cls.class_name,  # ClassName (包含 LT/IT 標示)
                cls.grade,  # Grade
                cls.teacher or '',  # Teacher
                cls.level,  # Level
                proctor.classroom if proctor else '',  # Classroom
                session.grade_band,  # GradeBand
                session.duration,  # Duration
                session.periods,  # Periods
                session.self_study_time if session.self_study_time else 'None',  # Self-Study
                session.preparation_time,  # Preparation
                session.exam_time,  # ExamTime
                proctor.proctor_teacher if proctor else '',  # Proctor
                session.subject,  # Subject
                cls.students + 1,  # Count = Students + 1
                cls.students  # Students
            ]
            writer.writerow(row)

        # 準備回應
        output.seek(0)
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={
                'Content-Disposition': 'attachment; filename=midterm_exam_proctor_assignments.csv'
            }
        )

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@exam_bp.route('/exams/export/csv/<grade_band>', methods=['GET'])
def export_grade_band_to_csv(grade_band):
    """匯出特定 GradeBand 的考試資料為 CSV"""
    try:
        # 查詢對應的 ExamSession
        session = ExamSession.query.filter_by(grade_band=grade_band).first()
        if not session:
            return jsonify({
                'success': False,
                'error': f'找不到 GradeBand: {grade_band}'
            }), 404

        # 查詢該 GradeBand 的所有班級
        classes = ClassExamInfo.query.filter_by(exam_session_id=session.id).all()

        # 建立 CSV
        output = io.StringIO()
        writer = csv.writer(output)

        # 寫入標題列
        headers = [
            'ClassName', 'Grade', 'Teacher', 'Level', 'Classroom',
            'GradeBand', 'Duration', 'Periods', 'Self-Study',
            'Preparation', 'ExamTime', 'Proctor', 'Subject', 'Count', 'Students'
        ]
        writer.writerow(headers)

        # 寫入資料列
        for cls in classes:
            proctor = cls.proctor_assignment

            row = [
                cls.class_name,
                cls.grade,
                cls.teacher or '',
                cls.level,
                proctor.classroom if proctor else '',
                session.grade_band,
                session.duration,
                session.periods,
                session.self_study_time if session.self_study_time else 'None',
                session.preparation_time,
                session.exam_time,
                proctor.proctor_teacher if proctor else '',
                session.subject,
                cls.students + 1,
                cls.students
            ]
            writer.writerow(row)

        # 準備回應
        output.seek(0)
        # 清理 grade_band 字串，移除空格和單引號
        cleaned_grade_band = grade_band.replace(" ", "_").replace("'", "")
        filename = f'midterm_exam_{cleaned_grade_band}.csv'
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={
                'Content-Disposition': f'attachment; filename={filename}'
            }
        )

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# 統計 API
# ============================================================

@exam_bp.route('/exams/stats', methods=['GET'])
def get_exam_stats():
    """取得考試統計資訊"""
    try:
        total_classes = ClassExamInfo.query.count()
        assigned_classes = ClassExamInfo.query.join(ProctorAssignment).count()
        unassigned_classes = total_classes - assigned_classes

        # 按日期統計
        dates = db.session.query(ExamSession.exam_date).distinct().all()
        date_stats = []

        for (date,) in dates:
            sessions = ExamSession.query.filter_by(exam_date=date).all()
            session_ids = [s.id for s in sessions]
            total = ClassExamInfo.query.filter(ClassExamInfo.exam_session_id.in_(session_ids)).count()
            assigned = ClassExamInfo.query.filter(ClassExamInfo.exam_session_id.in_(session_ids)).join(ProctorAssignment).count()

            date_stats.append({
                'date': date,
                'total_classes': total,
                'assigned': assigned,
                'unassigned': total - assigned
            })

        return jsonify({
            'success': True,
            'overall': {
                'total_classes': total_classes,
                'assigned': assigned_classes,
                'unassigned': unassigned_classes,
                'progress_percent': round(assigned_classes / total_classes * 100, 2) if total_classes > 0 else 0
            },
            'by_date': date_stats
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
