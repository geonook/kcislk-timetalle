from flask import Blueprint, jsonify, request
from src.models.timetable import db, Timetable, ClassInfo, Teacher, Classroom, Period
from collections import defaultdict

timetable_bp = Blueprint('timetable', __name__)

@timetable_bp.route('/classes', methods=['GET'])
def get_all_classes():
    """取得所有班級列表"""
    try:
        classes = ClassInfo.query.all()
        class_names = [cls.class_name for cls in classes]
        return jsonify({
            'success': True,
            'classes': sorted(class_names)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@timetable_bp.route('/timetable/<class_name>', methods=['GET'])
def get_class_timetable(class_name):
    """取得特定班級的週課表"""
    try:
        # 查詢該班級的所有課程
        courses = Timetable.query.filter_by(class_name=class_name).all()
        
        if not courses:
            return jsonify({
                'success': False,
                'error': f'找不到班級 {class_name} 的課表'
            }), 404
        
        # 按星期組織課表
        timetable = defaultdict(list)
        days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        
        for course in courses:
            timetable[course.day].append({
                'period': course.period_number,
                'time': course.time_range,
                'teacher': course.teacher,
                'classroom': course.classroom
            })
        
        # 確保每天的課程按節次排序
        for day in timetable:
            timetable[day].sort(key=lambda x: x['period'])
        
        # 確保所有星期都有資料（即使是空的）
        result_timetable = {}
        for day in days_order:
            result_timetable[day] = timetable[day]
        
        return jsonify({
            'success': True,
            'class_name': class_name,
            'timetable': result_timetable
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@timetable_bp.route('/timetable/<class_name>/<day>', methods=['GET'])
def get_class_day_timetable(class_name, day):
    """取得特定班級在特定日期的課表"""
    try:
        courses = Timetable.query.filter_by(class_name=class_name, day=day).all()
        
        if not courses:
            return jsonify({
                'success': True,
                'class_name': class_name,
                'day': day,
                'courses': []
            })
        
        courses_data = []
        for course in courses:
            courses_data.append({
                'period': course.period_number,
                'time': course.time_range,
                'teacher': course.teacher,
                'classroom': course.classroom
            })
        
        # 按節次排序
        courses_data.sort(key=lambda x: x['period'])
        
        return jsonify({
            'success': True,
            'class_name': class_name,
            'day': day,
            'courses': courses_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@timetable_bp.route('/search', methods=['GET'])
def search_courses():
    """搜尋課程"""
    try:
        class_name = request.args.get('class_name')
        teacher = request.args.get('teacher')
        classroom = request.args.get('classroom')
        day = request.args.get('day')
        
        query = Timetable.query
        
        if class_name:
            query = query.filter(Timetable.class_name.ilike(f'%{class_name}%'))
        if teacher:
            query = query.filter(Timetable.teacher.ilike(f'%{teacher}%'))
        if classroom:
            query = query.filter(Timetable.classroom.ilike(f'%{classroom}%'))
        if day:
            query = query.filter(Timetable.day.ilike(f'%{day}%'))
        
        courses = query.all()
        
        results = []
        for course in courses:
            results.append(course.to_dict())
        
        return jsonify({
            'success': True,
            'results': results,
            'count': len(results)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@timetable_bp.route('/teachers', methods=['GET'])
def get_all_teachers():
    """取得所有教師列表"""
    try:
        teachers = Teacher.query.all()
        teacher_names = [teacher.teacher_name for teacher in teachers]
        return jsonify({
            'success': True,
            'teachers': sorted(teacher_names)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@timetable_bp.route('/classrooms', methods=['GET'])
def get_all_classrooms():
    """取得所有教室列表"""
    try:
        classrooms = Classroom.query.all()
        classroom_names = [classroom.classroom_name for classroom in classrooms]
        return jsonify({
            'success': True,
            'classrooms': sorted(classroom_names)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@timetable_bp.route('/periods', methods=['GET'])
def get_all_periods():
    """取得所有節次資訊"""
    try:
        periods = Period.query.order_by(Period.period_number).all()
        periods_data = [period.to_dict() for period in periods]
        return jsonify({
            'success': True,
            'periods': periods_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

