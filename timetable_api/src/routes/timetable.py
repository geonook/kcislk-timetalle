from flask import Blueprint, jsonify, request
from src.models.timetable import db, Timetable, ClassInfo, Teacher, Classroom, Period
from src.models.student import HomeRoomTimetable, EnglishTimetable
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
    """取得特定班級的週課表 - 整合所有課表類型"""
    try:
        days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        result_timetable = {}

        # 初始化每一天的課表
        for day in days_order:
            result_timetable[day] = []

        has_courses = False

        # 1. 查詢英文班課表 (EnglishTimetable)
        english_courses = EnglishTimetable.query.filter_by(class_name=class_name).all()
        for course in english_courses:
            has_courses = True
            # 解析節次（期待格式如 "(3)10:20-11:00" -> 3）
            try:
                period_num = int(course.period.split(')')[0].replace('(', ''))
                time_range = course.period.split(')')[-1] if ')' in course.period else course.period
            except:
                period_num = 0
                time_range = course.period

            result_timetable[course.day].append({
                'period': period_num,
                'time': time_range,
                'teacher': course.teacher,
                'classroom': course.classroom,
                'course_name': f'English - {class_name}',
                'class_type': 'english'
            })

        # 2. 查詢 homeroom 課表 - 根據班級名稱匹配 home_room_class_name
        # 注意：這裡假設 class_name 可能需要映射到 home_room_class_name
        # 先嘗試直接匹配
        homeroom_courses = HomeRoomTimetable.query.filter_by(home_room_class_name=class_name).all()

        # 如果沒有找到，嘗試用英文班名稱查找對應的學生，然後獲取他們的 homeroom
        if not homeroom_courses:
            from src.models.student import Student
            # 查找屬於這個英文班的學生
            students = Student.query.filter_by(english_class_name=class_name).all()
            homeroom_classes = set(student.home_room_class_name for student in students)

            # 獲取所有相關 homeroom 班級的課表
            for homeroom_class in homeroom_classes:
                homeroom_courses.extend(
                    HomeRoomTimetable.query.filter_by(home_room_class_name=homeroom_class).all()
                )

        for course in homeroom_courses:
            has_courses = True
            # 解析節次
            try:
                period_num = int(course.period.split(')')[0].replace('(', ''))
                time_range = course.period.split(')')[-1] if ')' in course.period else course.period
            except:
                period_num = 0
                time_range = course.period

            result_timetable[course.day].append({
                'period': period_num,
                'time': time_range,
                'teacher': course.teacher,
                'classroom': course.classroom,
                'course_name': course.course_name,
                'class_type': 'homeroom'
            })

        # 3. 查詢原有的 Timetable 表
        regular_courses = Timetable.query.filter_by(class_name=class_name).all()
        for course in regular_courses:
            has_courses = True
            result_timetable[course.day].append({
                'period': course.period_number,
                'time': course.time_range,
                'teacher': course.teacher,
                'classroom': course.classroom,
                'course_name': f'Regular - {class_name}',
                'class_type': 'regular'
            })

        if not has_courses:
            return jsonify({
                'success': False,
                'error': f'找不到班級 {class_name} 的課表'
            }), 404

        # 確保每天的課程按節次排序
        for day in result_timetable:
            result_timetable[day].sort(key=lambda x: x['period'])

        # 轉換為前端期望的物件格式（以 period 為 key）
        final_timetable = {}
        for day in days_order:
            day_courses = result_timetable[day]
            final_timetable[day] = {}

            for course in day_courses:
                period_key = str(course['period'])
                # 如果同一時段有多個課程，取第一個（或可以選擇合併邏輯）
                if period_key not in final_timetable[day]:
                    final_timetable[day][period_key] = course

        return jsonify({
            'success': True,
            'class_name': class_name,
            'timetable': final_timetable
        })
    except Exception as e:
        import traceback
        print(f"Error in get_class_timetable: {e}")
        print(traceback.format_exc())
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

