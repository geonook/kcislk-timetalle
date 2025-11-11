from flask import Blueprint, jsonify, request
from src.models.timetable import Teacher
from src.models.student import EnglishTimetable, HomeRoomTimetable

teacher_bp = Blueprint('teacher', __name__)

@teacher_bp.route('/teachers', methods=['GET'])
def get_all_teachers():
    """取得所有教師列表"""
    try:
        teachers = Teacher.query.all()
        return jsonify({
            'success': True,
            'teachers': [teacher.to_dict() for teacher in teachers]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@teacher_bp.route('/teachers/search', methods=['GET'])
def search_teachers():
    """搜尋教師"""
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify({'success': True, 'teachers': []})

        teachers = Teacher.query.filter(
            Teacher.teacher_name.contains(query)
        ).limit(20).all()

        return jsonify({
            'success': True,
            'teachers': [teacher.to_dict() for teacher in teachers]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@teacher_bp.route('/teachers/<teacher_name>/timetable', methods=['GET'])
def get_teacher_timetable(teacher_name):
    """取得特定教師的完整課表"""
    try:
        # 查找教師
        teacher = Teacher.query.filter_by(teacher_name=teacher_name).first()
        if not teacher:
            return jsonify({'success': False, 'error': '找不到該教師'}), 404

        # 取得所有教師教的課
        all_classes = []

        # 英文班課表
        english_classes = EnglishTimetable.query.filter_by(
            teacher=teacher_name
        ).all()
        for cls in english_classes:
            all_classes.append({
                'day': cls.day,
                'period': cls.period,
                'time': f'{cls.period}',
                'classroom': cls.classroom,
                'class_name': cls.class_name,
                'teacher': cls.teacher,
                'subject': f'English - {cls.class_name}',
                'class_type': 'english'
            })

        # Home Room 課表
        homeroom_classes = HomeRoomTimetable.query.filter_by(
            teacher=teacher_name
        ).all()
        for cls in homeroom_classes:
            all_classes.append({
                'day': cls.day,
                'period': cls.period,
                'time': f'{cls.period}',
                'classroom': cls.classroom,
                'class_name': cls.home_room_class_name,
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
            # 正確處理 period 字段 - 移除括號並提取數字
            period_raw = str(cls['period']).strip()
            # 處理可能的格式: "第18節" -> "18", "(18)" -> "18", "18" -> "18"
            import re
            period_match = re.search(r'(\d+)', period_raw)
            period = period_match.group(1) if period_match else period_raw

            course_data = {
                'subject': cls['subject'],
                'course_name': cls['subject'],  # 確保有 course_name 字段
                'teacher': cls['teacher'],
                'classroom': cls['classroom'],
                'class_name': cls['class_name'],
                'period': int(period) if period.isdigit() else 0,
                'time': cls['time'],
                'class_type': cls['class_type']
            }

            if cls['class_type'] == 'english':
                timetables['english_timetable'][day][period] = course_data
            elif cls['class_type'] == 'homeroom':
                timetables['homeroom_timetable'][day][period] = course_data
            elif cls['class_type'] == 'ev_myreading':
                timetables['ev_myreading_timetable'][day][period] = course_data

        # 統計教學班級數（去重複）
        unique_classes = set()
        for cls in all_classes:
            unique_classes.add(cls['class_name'])

        return jsonify({
            'success': True,
            'teacher': teacher.to_dict(),
            'timetables': timetables,
            'statistics': {
                'total_classes': len(all_classes),
                'days_with_classes': len([day for day in days if any(
                    len(timetables[tt][day]) > 0 for tt in timetables
                )]),
                'english_classes': len([cls for cls in all_classes if cls['class_type'] == 'english']),
                'ev_myreading_classes': len([cls for cls in all_classes if cls['class_type'] == 'ev_myreading']),
                'homeroom_classes': len([cls for cls in all_classes if cls['class_type'] == 'homeroom']),
                'unique_classes': len(unique_classes)
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@teacher_bp.route('/teachers/<teacher_name>/timetable/weekly', methods=['GET'])
def get_teacher_weekly_timetable(teacher_name):
    """取得特定教師的週課表（按星期和節次排列）"""
    try:
        # 查找教師
        teacher = Teacher.query.filter_by(teacher_name=teacher_name).first()
        if not teacher:
            return jsonify({'error': '找不到該教師'}), 404

        # 取得所有教師教的課
        all_classes = []

        # 英文班課表
        english_classes = EnglishTimetable.query.filter_by(
            teacher=teacher_name
        ).all()
        for cls in english_classes:
            all_classes.append({
                'day': cls.day,
                'period': cls.period,
                'classroom': cls.classroom,
                'teacher': cls.teacher,
                'class_name': cls.class_name,
                'course_name': f'English - {cls.class_name}',
                'class_type': 'english'
            })

        # Home Room 課表
        homeroom_classes = HomeRoomTimetable.query.filter_by(
            teacher=teacher_name
        ).all()
        for cls in homeroom_classes:
            all_classes.append({
                'day': cls.day,
                'period': cls.period,
                'classroom': cls.classroom,
                'teacher': cls.teacher,
                'class_name': cls.home_room_class_name,
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

        # 統計教學班級數（去重複）
        unique_classes = set()
        for cls in all_classes:
            unique_classes.add(cls['class_name'])

        return jsonify({
            'success': True,
            'teacher': teacher.to_dict(),
            'weekly_timetable': weekly_timetable,
            'statistics': {
                'total_classes': len(all_classes),
                'days_with_classes': len([day for day in days if weekly_timetable[day]]),
                'english_classes': len([cls for cls in all_classes if cls['class_type'] == 'english']),
                'ev_myreading_classes': len([cls for cls in all_classes if cls['class_type'] == 'ev_myreading']),
                'homeroom_classes': len([cls for cls in all_classes if cls['class_type'] == 'homeroom']),
                'unique_classes': len(unique_classes)
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
