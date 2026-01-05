"""
期中考資料載入器
載入 2025 Fall Semester Midterm Assessment 的考試場次和班級資訊
"""
import pandas as pd
import os
from src.models.timetable import db
from src.models.exam import ExamSession, ClassExamInfo, ProctorAssignment
from src.models.student import Student, HomeRoomTimetable


def load_exam_sessions():
    """載入 12 個 GradeBand 的考試場次資訊"""

    exam_sessions_data = [
        # LT Assessment (6 個 GradeBand)
        {
            'grade_band': 'G1 LT\'s',
            'exam_type': 'LT',
            'grade': 'G1',
            'exam_date': '2025-11-05',
            'periods': 'P3-P4',
            'duration': 75,
            'self_study_time': None,
            'preparation_time': '10:20-10:30',
            'exam_time': '10:30-11:45',
            'subject': 'LT Assessment'
        },
        {
            'grade_band': 'G2 LT\'s',
            'exam_type': 'LT',
            'grade': 'G2',
            'exam_date': '2025-11-05',
            'periods': 'P1-P2',
            'duration': 75,
            'self_study_time': None,
            'preparation_time': '08:25-08:35',
            'exam_time': '08:35-09:50',
            'subject': 'LT Assessment'
        },
        {
            'grade_band': 'G3 LT\'s',
            'exam_type': 'LT',
            'grade': 'G3',
            'exam_date': '2025-11-05',
            'periods': 'P3-P4',
            'duration': 60,
            'self_study_time': '10:20-10:35',
            'preparation_time': '10:35-10:40',
            'exam_time': '10:40-11:40',
            'subject': 'LT Assessment'
        },
        {
            'grade_band': 'G4 LT\'s',
            'exam_type': 'LT',
            'grade': 'G4',
            'exam_date': '2025-11-05',
            'periods': 'P1-P2',
            'duration': 60,
            'self_study_time': '08:25-08:40',
            'preparation_time': '08:40-08:45',
            'exam_time': '08:45-09:45',
            'subject': 'LT Assessment'
        },
        {
            'grade_band': 'G5 LT\'s',
            'exam_type': 'LT',
            'grade': 'G5',
            'exam_date': '2025-11-05',
            'periods': 'P3-P4',
            'duration': 60,
            'self_study_time': '10:20-10:40',
            'preparation_time': '10:40-10:45',
            'exam_time': '10:45-11:45',
            'subject': 'LT Assessment'
        },
        {
            'grade_band': 'G6 LT\'s',
            'exam_type': 'LT',
            'grade': 'G6',
            'exam_date': '2025-11-05',
            'periods': 'P1-P2',
            'duration': 80,
            'self_study_time': None,
            'preparation_time': '08:25-08:30',
            'exam_time': '08:30-09:50',
            'subject': 'LT Assessment'
        },

        # IT Assessment (6 個 GradeBand)
        {
            'grade_band': 'G1 IT\'s',
            'exam_type': 'IT',
            'grade': 'G1',
            'exam_date': '2025-11-06',
            'periods': 'P3-P4',
            'duration': 75,
            'self_study_time': None,
            'preparation_time': '10:20-10:30',
            'exam_time': '10:30-11:45',
            'subject': 'IT Assessment'
        },
        {
            'grade_band': 'G2 IT\'s',
            'exam_type': 'IT',
            'grade': 'G2',
            'exam_date': '2025-11-06',
            'periods': 'P1-P2',
            'duration': 75,
            'self_study_time': None,
            'preparation_time': '08:25-08:35',
            'exam_time': '08:35-09:50',
            'subject': 'IT Assessment'
        },
        {
            'grade_band': 'G3 IT\'s',
            'exam_type': 'IT',
            'grade': 'G3',
            'exam_date': '2025-11-04',
            'periods': 'P7-P8',
            'duration': 75,
            'self_study_time': None,
            'preparation_time': '14:40-14:45',
            'exam_time': '14:50-16:00',
            'subject': 'IT Assessment'
        },
        {
            'grade_band': 'G4 IT\'s',
            'exam_type': 'IT',
            'grade': 'G4',
            'exam_date': '2025-11-04',
            'periods': 'P5-P6',
            'duration': 75,
            'self_study_time': None,
            'preparation_time': '12:55-13:00',
            'exam_time': '13:00-14:15',
            'subject': 'IT Assessment'
        },
        {
            'grade_band': 'G5 IT\'s',
            'exam_type': 'IT',
            'grade': 'G5',
            'exam_date': '2025-11-04',
            'periods': 'P7-P8',
            'duration': 80,
            'self_study_time': None,
            'preparation_time': '14:40-14:45',
            'exam_time': '14:45-16:05',
            'subject': 'IT Assessment'
        },
        {
            'grade_band': 'G6 IT\'s',
            'exam_type': 'IT',
            'grade': 'G6',
            'exam_date': '2025-11-04',
            'periods': 'P5-P6',
            'duration': 80,
            'self_study_time': None,
            'preparation_time': '12:55-13:00',
            'exam_time': '13:00-14:20',
            'subject': 'IT Assessment'
        }
    ]

    print("開始載入考試場次資料...")

    for session_data in exam_sessions_data:
        # 檢查是否已存在
        existing = ExamSession.query.filter_by(grade_band=session_data['grade_band']).first()
        if existing:
            print(f"  ⚠️  {session_data['grade_band']} 已存在，跳過")
            continue

        session = ExamSession(**session_data)
        db.session.add(session)
        print(f"  ✅ 新增 {session_data['grade_band']} - {session_data['exam_date']} {session_data['periods']}")

    try:
        db.session.commit()
        print("✅ 考試場次資料載入成功！共載入 12 個 GradeBand")
        return True
    except Exception as e:
        db.session.rollback()
        print(f"❌ 考試場次資料載入失敗: {e}")
        return False


def load_class_exam_info():
    """載入 84 個班級的考試資訊"""

    # 載入教師對應表
    csv_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'class_teachers.csv')

    if not os.path.exists(csv_file_path):
        print(f"⚠️  找不到教師對應檔案：{csv_file_path}")
        teacher_map = {}
    else:
        teachers_df = pd.read_csv(csv_file_path)
        teacher_map = {}
        for _, row in teachers_df.iterrows():
            teacher_map[row['EnglishName']] = {
                'LT': row['system_display_lt'],
                'IT': row['system_display_it']
            }
        print(f"✅ 成功載入 {len(teacher_map)} 個班級的教師對應資料")

    # 班級資料：ClassName, Level, Students
    class_data = [
        # G1 - 14 個班級
        ('G1 Achievers', 'G1E1', 20),
        ('G1 Discoverers', 'G1E1', 20),
        ('G1 Voyagers', 'G1E1', 19),
        ('G1 Explorers', 'G1E1', 20),
        ('G1 Navigators', 'G1E1', 20),
        ('G1 Adventurers', 'G1E2', 18),
        ('G1 Guardians', 'G1E2', 18),
        ('G1 Pioneers', 'G1E2', 18),
        ('G1 Innovators', 'G1E2', 18),
        ('G1 Visionaries', 'G1E2', 16),
        ('G1 Pathfinders', 'G1E3', 17),
        ('G1 Seekers', 'G1E3', 16),
        ('G1 Trailblazers', 'G1E3', 16),
        ('G1 Inventors', 'G1E3', 15),

        # G2 - 14 個班級
        ('G2 Pioneers', 'G2E1', 20),
        ('G2 Explorers', 'G2E1', 20),
        ('G2 Inventors', 'G2E1', 20),
        ('G2 Achievers', 'G2E1', 19),
        ('G2 Voyagers', 'G2E1', 20),
        ('G2 Adventurers', 'G2E2', 21),
        ('G2 Innovators', 'G2E2', 20),
        ('G2 Guardians', 'G2E2', 20),
        ('G2 Pathfinders', 'G2E2', 20),
        ('G2 Visionaries', 'G2E2', 20),
        ('G2 Navigators', 'G2E3', 13),
        ('G2 Discoverers', 'G2E3', 14),
        ('G2 Seekers', 'G2E3', 12),
        ('G2 Trailblazers', 'G2E3', 13),

        # G3 - 13 個班級
        ('G3 Inventors', 'G3E1', 19),
        ('G3 Innovators', 'G3E1', 19),
        ('G3 Guardians', 'G3E1', 19),
        ('G3 Achievers', 'G3E1', 19),
        ('G3 Voyagers', 'G3E2', 20),
        ('G3 Visionaries', 'G3E2', 20),
        ('G3 Trailblazers', 'G3E2', 20),
        ('G3 Discoverers', 'G3E2', 20),
        ('G3 Explorers', 'G3E2', 20),
        ('G3 Navigators', 'G3E2', 20),
        ('G3 Adventurers', 'G3E2', 20),
        ('G3 Seekers', 'G3E3', 11),
        ('G3 Pathfinders', 'G3E3', 13),
        ('G3 Pioneers', 'G3E3', 12),

        # G4 - 13 個班級
        ('G4 Seekers', 'G4E1', 19),
        ('G4 Voyagers', 'G4E1', 18),
        ('G4 Visionaries', 'G4E1', 18),
        ('G4 Achievers', 'G4E1', 19),
        ('G4 Navigators', 'G4E2', 20),
        ('G4 Trailblazers', 'G4E2', 20),
        ('G4 Pathfinders', 'G4E2', 17),
        ('G4 Explorers', 'G4E2', 19),
        ('G4 Adventurers', 'G4E2', 20),
        ('G4 Innovators', 'G4E2', 20),
        ('G4 Discoverers', 'G4E2', 18),
        ('G4 Guardians', 'G4E3', 16),
        ('G4 Inventors', 'G4E3', 14),
        ('G4 Pioneers', 'G4E3', 14),

        # G5 - 14 個班級
        ('G5 Adventurers', 'G5E1', 20),
        ('G5 Navigators', 'G5E1', 20),
        ('G5 Pioneers', 'G5E1', 21),
        ('G5 Inventors', 'G5E2', 20),
        ('G5 Seekers', 'G5E2', 19),
        ('G5 Discoverers', 'G5E2', 19),
        ('G5 Guardians', 'G5E2', 19),
        ('G5 Pathfinders', 'G5E2', 19),
        ('G5 Explorers', 'G5E2', 19),
        ('G5 Achievers', 'G5E2', 20),
        ('G5 Voyagers', 'G5E3', 14),
        ('G5 Trailblazers', 'G5E3', 15),
        ('G5 Innovators', 'G5E3', 14),
        ('G5 Visionaries', 'G5E3', 13),

        # G6 - 16 個班級
        ('G6 Explorers', 'G6E1', 20),
        ('G6 Inventors', 'G6E1', 19),
        ('G6 Adventurers', 'G6E1', 19),
        ('G6 Achievers', 'G6E1', 19),
        ('G6 Voyagers', 'G6E2', 19),
        ('G6 Discoverers', 'G6E2', 18),
        ('G6 Innovators', 'G6E2', 18),
        ('G6 Guardians', 'G6E2', 19),
        ('G6 Pathfinders', 'G6E2', 19),
        ('G6 Seekers', 'G6E2', 19),
        ('G6 Visionaries', 'G6E2', 17),
        ('G6 Pioneers', 'G6E3', 14),
        ('G6 Trailblazers', 'G6E3', 16),
        ('G6 Navigators', 'G6E3', 16),
    ]

    print("開始載入班級考試資訊...")

    # 建立 GradeBand 對照表（每個班級對應兩個 GradeBand：LT 和 IT）
    grade_to_gradeband = {
        'G1': ('G1 LT\'s', 'G1 IT\'s'),
        'G2': ('G2 LT\'s', 'G2 IT\'s'),
        'G3': ('G3 LT\'s', 'G3 IT\'s'),
        'G4': ('G4 LT\'s', 'G4 IT\'s'),
        'G5': ('G5 LT\'s', 'G5 IT\'s'),
        'G6': ('G6 LT\'s', 'G6 IT\'s'),
    }

    loaded_count = 0

    for class_name, level, students in class_data:
        # 擷取年級
        grade = class_name.split()[0]  # 'G1 Achievers' -> 'G1'

        # 每個班級需要建立兩筆記錄：LT 和 IT
        for exam_type in ['LT', 'IT']:
            grade_band_name = grade_to_gradeband[grade][0 if exam_type == 'LT' else 1]

            # 查詢對應的 ExamSession
            exam_session = ExamSession.query.filter_by(grade_band=grade_band_name).first()
            if not exam_session:
                print(f"  ⚠️  找不到 {grade_band_name} 的考試場次，跳過 {class_name}")
                continue

            # 建立完整的 class_name（包含考試類型）
            full_class_name = f"{class_name} ({exam_type})"

            # 檢查是否已存在
            existing = ClassExamInfo.query.filter_by(class_name=full_class_name).first()
            if existing:
                continue

            # 查詢教師（從教師對應表，根據考試類型 LT 或 IT）
            teacher = teacher_map.get(class_name, {}).get(exam_type, None)

            # 建立班級考試資訊
            class_exam_info = ClassExamInfo(
                class_name=full_class_name,
                grade=grade,
                level=level,
                exam_session_id=exam_session.id,
                students=students,
                teacher=teacher
            )
            db.session.add(class_exam_info)
            loaded_count += 1

    try:
        db.session.commit()
        print(f"✅ 班級考試資訊載入成功！共載入 {loaded_count} 筆記錄（84班 x 2考試類型 = 168筆）")
        return True
    except Exception as e:
        db.session.rollback()
        print(f"❌ 班級考試資訊載入失敗: {e}")
        return False


def load_proctor_assignments_from_csv():
    """從 CSV 檔案載入監考分配資料"""

    csv_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'proctor_assignments.csv')

    if not os.path.exists(csv_file_path):
        print(f"❌ 找不到監考分配檔案：{csv_file_path}")
        return False

    print("開始載入監考分配資料...")

    # 讀取 CSV 檔案
    df = pd.read_csv(csv_file_path)
    print(f"  ✅ 讀取到 {len(df)} 筆資料")

    loaded_count = 0
    updated_count = 0
    error_count = 0

    for _, row in df.iterrows():
        # 從 CSV 取得資料
        class_name = row['ClassName']
        grade_band = row['GradeBand']
        proctor = row['Proctor']
        classroom = row['Classroom']

        # 根據 GradeBand 判斷考試類型
        exam_type = 'LT' if 'LT' in grade_band else 'IT'

        # 建立完整的 class_name（包含考試類型）
        full_class_name = f"{class_name} ({exam_type})"

        # 查詢對應的 ClassExamInfo
        class_exam_info = ClassExamInfo.query.filter_by(class_name=full_class_name).first()

        if not class_exam_info:
            print(f"  ⚠️  找不到班級：{full_class_name}")
            error_count += 1
            continue

        # 檢查是否已有監考分配
        existing = ProctorAssignment.query.filter_by(class_exam_info_id=class_exam_info.id).first()

        if existing:
            # 更新現有記錄
            existing.proctor_teacher = proctor
            existing.classroom = classroom
            updated_count += 1
        else:
            # 新增記錄
            assignment = ProctorAssignment(
                class_exam_info_id=class_exam_info.id,
                proctor_teacher=proctor,
                classroom=classroom
            )
            db.session.add(assignment)
            loaded_count += 1

    try:
        db.session.commit()
        print(f"✅ 監考分配資料載入成功！")
        print(f"  - 新增：{loaded_count} 筆")
        print(f"  - 更新：{updated_count} 筆")
        print(f"  - 錯誤：{error_count} 筆")
        return True
    except Exception as e:
        db.session.rollback()
        print(f"❌ 監考分配資料載入失敗: {e}")
        return False


def load_all_exam_data():
    """載入所有考試相關資料"""
    print("\n" + "="*60)
    print("開始載入 2025 Fall Semester Midterm Assessment 資料")
    print("="*60 + "\n")

    # 1. 載入考試場次
    success1 = load_exam_sessions()

    # 2. 載入班級考試資訊
    success2 = load_class_exam_info()

    # 3. 載入監考分配資料
    success3 = load_proctor_assignments_from_csv()

    print("\n" + "="*60)
    if success1 and success2 and success3:
        print("✅ 所有考試資料載入完成！")

        # 顯示統計資訊
        session_count = ExamSession.query.count()
        class_count = ClassExamInfo.query.count()
        proctor_count = ProctorAssignment.query.count()

        print(f"\n統計資訊：")
        print(f"  - 考試場次：{session_count} 個 GradeBand")
        print(f"  - 班級記錄：{class_count} 筆（84班 x 2考試類型）")
        print(f"  - 監考分配：{proctor_count} 筆")
    else:
        print("❌ 部分資料載入失敗，請檢查錯誤訊息")
    print("="*60 + "\n")

    return success1 and success2 and success3
