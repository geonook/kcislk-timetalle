from flask import Blueprint, jsonify, request
from src.models.student import Student, EnglishTimetable, HomeRoomTimetable

student_bp = Blueprint('student', __name__)

@student_bp.route('/students', methods=['GET'])
def get_all_students():
    """取得所有學生列表"""
    try:
        students = Student.query.all()
        return jsonify([student.to_dict() for student in students])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/students/search', methods=['GET'])
def search_students():
    """搜尋學生"""
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify({'success': True, 'students': []})
        
        students = Student.query.filter(
            (Student.student_name.contains(query)) |
            (Student.student_id.contains(query))
        ).limit(20).all()
        
        return jsonify({
            'success': True,
            'students': [student.to_dict() for student in students]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@student_bp.route('/students/<student_id>', methods=['GET'])
def get_student_by_id(student_id):
    """根據學生ID取得學生資訊和週課表"""
    try:
        # 查找學生
        student = Student.query.filter_by(student_id=student_id).first()
        if not student:
            return jsonify({'success': False, 'error': '找不到該學生'}), 404
        
        # 取得所有相關課表
        all_classes = []
        
        # 英文班課表
        english_classes = EnglishTimetable.query.filter_by(
            class_name=student.english_class_name
        ).all()
        for cls in english_classes:
            all_classes.append({
                'day': cls.day,
                'period': cls.period,
                'time': f'{cls.period}',  # 可以根據需要調整時間格式
                'classroom': cls.classroom,
                'teacher': cls.teacher,
                'course_name': f'English - {cls.class_name}',
                'class_type': 'english'
            })
        
        # EV & myReading 班課表
        if student.ev_myreading_class_name:
            ev_classes = EnglishTimetable.query.filter_by(
                class_name=student.ev_myreading_class_name
            ).all()
            for cls in ev_classes:
                all_classes.append({
                    'day': cls.day,
                    'period': cls.period,
                    'time': f'{cls.period}',
                    'classroom': cls.classroom,
                    'teacher': cls.teacher,
                    'course_name': f'EV & myReading - {cls.class_name}',
                    'class_type': 'ev_myreading'
                })
        
        # Home Room 課表
        homeroom_classes = HomeRoomTimetable.query.filter_by(
            home_room_class_name=student.home_room_class_name
        ).all()
        for cls in homeroom_classes:
            all_classes.append({
                'day': cls.day,
                'period': cls.period,
                'time': f'{cls.period}',
                'classroom': cls.classroom,
                'teacher': cls.teacher,
                'course_name': cls.course_name,
                'class_type': 'homeroom'
            })
        
        # 按星期和節次排列
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        weekly_timetable = {}
        
        for day in days:
            day_classes = [cls for cls in all_classes if cls['day'] == day]
            # 按節次排序
            day_classes.sort(key=lambda x: x['period'])
            weekly_timetable[day] = day_classes
        
        # 組織課表資料以匹配前端期望的格式
        timetables = {
            'english_timetable': {},
            'homeroom_timetable': {},
            'ev_myreading_timetable': {}
        }

        # 將課表按類型和結構組織
        for day in days:
            day_classes = weekly_timetable[day]

            # 初始化每天的時段
            for timetable_type in timetables:
                timetables[timetable_type][day] = {}

            # 將課程分配到相應的課表類型
            for cls in day_classes:
                period = str(cls['period']).replace('(', '').replace(')', '').split(')')[0]

                course_data = {
                    'subject': cls['course_name'],
                    'teacher': cls['teacher'],
                    'classroom': cls['classroom']
                }

                if cls['class_type'] == 'english':
                    timetables['english_timetable'][day][period] = course_data
                elif cls['class_type'] == 'homeroom':
                    timetables['homeroom_timetable'][day][period] = course_data
                elif cls['class_type'] == 'ev_myreading':
                    timetables['ev_myreading_timetable'][day][period] = course_data

        return jsonify({
            'success': True,
            'student': student.to_dict(),
            'timetables': timetables,
            'statistics': {
                'total_classes': len(all_classes),
                'days_with_classes': len([day for day in days if weekly_timetable[day]]),
                'english_classes': len([cls for cls in all_classes if cls['class_type'] == 'english']),
                'ev_myreading_classes': len([cls for cls in all_classes if cls['class_type'] == 'ev_myreading']),
                'homeroom_classes': len([cls for cls in all_classes if cls['class_type'] == 'homeroom'])
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@student_bp.route('/students/<student_id>/timetable', methods=['GET'])
def get_student_timetable(student_id):
    """取得特定學生的完整課表"""
    try:
        # 查找學生
        student = Student.query.filter_by(student_id=student_id).first()
        if not student:
            return jsonify({'success': False, 'error': '找不到該學生'}), 404

        # 取得所有相關課表
        all_classes = []

        # 英文班課表
        english_classes = EnglishTimetable.query.filter_by(
            class_name=student.english_class_name
        ).all()
        for cls in english_classes:
            all_classes.append({
                'day': cls.day,
                'period': cls.period,
                'time': f'{cls.period}',
                'classroom': cls.classroom,
                'teacher': cls.teacher,
                'subject': f'English - {cls.class_name}',
                'class_type': 'english'
            })

        # EV & myReading 班課表
        if student.ev_myreading_class_name:
            ev_classes = EnglishTimetable.query.filter_by(
                class_name=student.ev_myreading_class_name
            ).all()
            for cls in ev_classes:
                all_classes.append({
                    'day': cls.day,
                    'period': cls.period,
                    'time': f'{cls.period}',
                    'classroom': cls.classroom,
                    'teacher': cls.teacher,
                    'subject': f'EV & myReading - {cls.class_name}',
                    'class_type': 'ev_myreading'
                })

        # Home Room 課表
        homeroom_classes = HomeRoomTimetable.query.filter_by(
            home_room_class_name=student.home_room_class_name
        ).all()
        for cls in homeroom_classes:
            all_classes.append({
                'day': cls.day,
                'period': cls.period,
                'time': f'{cls.period}',
                'classroom': cls.classroom,
                'teacher': cls.teacher,
                'subject': cls.course_name,
                'class_type': 'homeroom'
            })

        # 組織課表資料以匹配前端期望的格式
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        timetables = {
            'english_timetable': {},
            'homeroom_timetable': {},
            'ev_myreading_timetable': {}
        }

        # 為每天初始化空的時段
        for day in days:
            for timetable_type in timetables:
                timetables[timetable_type][day] = {}

        # 將課程分配到相應的課表類型和時段
        for cls in all_classes:
            day = cls['day']
            period = str(cls['period']).replace('(', '').replace(')', '').split(')')[0]

            course_data = {
                'subject': cls['subject'],
                'teacher': cls['teacher'],
                'classroom': cls['classroom'],
                'period': cls['period'],
                'time': cls['time']
            }

            if cls['class_type'] == 'english':
                timetables['english_timetable'][day][period] = course_data
            elif cls['class_type'] == 'homeroom':
                timetables['homeroom_timetable'][day][period] = course_data
            elif cls['class_type'] == 'ev_myreading':
                timetables['ev_myreading_timetable'][day][period] = course_data

        return jsonify({
            'success': True,
            'student': student.to_dict(),
            'timetables': timetables,
            'statistics': {
                'total_classes': len(all_classes),
                'days_with_classes': len([day for day in days if any(
                    len(timetables[tt][day]) > 0 for tt in timetables
                )]),
                'english_classes': len([cls for cls in all_classes if cls['class_type'] == 'english']),
                'ev_myreading_classes': len([cls for cls in all_classes if cls['class_type'] == 'ev_myreading']),
                'homeroom_classes': len([cls for cls in all_classes if cls['class_type'] == 'homeroom'])
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@student_bp.route('/students/<student_id>/timetable/weekly', methods=['GET'])
def get_student_weekly_timetable(student_id):
    """取得特定學生的週課表（按星期和節次排列）"""
    try:
        # 查找學生
        student = Student.query.filter_by(student_id=student_id).first()
        if not student:
            return jsonify({'error': '找不到該學生'}), 404
        
        # 取得所有相關課表
        all_classes = []
        
        # 英文班課表
        english_classes = EnglishTimetable.query.filter_by(
            class_name=student.english_class_name
        ).all()
        for cls in english_classes:
            all_classes.append({
                'day': cls.day,
                'period': cls.period,
                'classroom': cls.classroom,
                'teacher': cls.teacher,
                'course_name': f'English - {cls.class_name}',
                'class_type': 'english'
            })
        
        # EV & myReading 班課表
        if student.ev_myreading_class_name:
            ev_classes = EnglishTimetable.query.filter_by(
                class_name=student.ev_myreading_class_name
            ).all()
            for cls in ev_classes:
                all_classes.append({
                    'day': cls.day,
                    'period': cls.period,
                    'classroom': cls.classroom,
                    'teacher': cls.teacher,
                    'course_name': f'EV & myReading - {cls.class_name}',
                    'class_type': 'ev_myreading'
                })
        
        # Home Room 課表
        homeroom_classes = HomeRoomTimetable.query.filter_by(
            home_room_class_name=student.home_room_class_name
        ).all()
        for cls in homeroom_classes:
            all_classes.append({
                'day': cls.day,
                'period': cls.period,
                'classroom': cls.classroom,
                'teacher': cls.teacher,
                'course_name': cls.course_name,
                'class_type': 'homeroom'
            })
        
        # 按星期和節次排列
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        weekly_timetable = {}
        
        for day in days:
            day_classes = [cls for cls in all_classes if cls['day'] == day]
            # 按節次排序
            day_classes.sort(key=lambda x: x['period'])
            weekly_timetable[day] = day_classes
        
        return jsonify({
            'success': True,
            'student': student.to_dict(),
            'weekly_timetable': weekly_timetable,
            'statistics': {
                'total_classes': len(all_classes),
                'days_with_classes': len([day for day in days if weekly_timetable[day]]),
                'english_classes': len([cls for cls in all_classes if cls['class_type'] == 'english']),
                'ev_myreading_classes': len([cls for cls in all_classes if cls['class_type'] == 'ev_myreading']),
                'homeroom_classes': len([cls for cls in all_classes if cls['class_type'] == 'homeroom'])
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

