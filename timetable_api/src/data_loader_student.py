import pandas as pd
import sqlite3
from src.models.timetable import db
from src.models.student import Student, EnglishTimetable, HomeRoomTimetable

def load_student_data():
    """載入學生資料到資料庫"""
    try:
        # 讀取學生資料 CSV
        students_df = pd.read_csv('/home/ubuntu/upload/students_classschedule-students_template.csv')
        
        # 清空現有資料
        Student.query.delete()
        
        # 載入學生資料
        for _, row in students_df.iterrows():
            student = Student(
                student_id=row['Student ID'],
                student_name=row['Student Name'],
                english_class_name=row['English Class Name'],
                home_room_class_name=str(row['Home Room Class Name']),
                ev_myreading_class_name=row['EV & myReading Class Name'] if pd.notna(row['EV & myReading Class Name']) else None
            )
            db.session.add(student)
        
        db.session.commit()
        print(f"成功載入 {len(students_df)} 筆學生資料")
        
    except Exception as e:
        print(f"載入學生資料時發生錯誤: {e}")
        db.session.rollback()

def load_english_timetable_data():
    """載入英文班課表資料到資料庫"""
    try:
        # 讀取英文班課表 CSV
        timetable_df = pd.read_csv('/home/ubuntu/upload/students_classschedule-english_timetable_template.csv')
        
        # 清空現有資料
        EnglishTimetable.query.delete()
        
        # 載入課表資料
        for _, row in timetable_df.iterrows():
            timetable = EnglishTimetable(
                day=row['Day'],
                classroom=row['Classroom'],
                teacher=row['Teacher'],
                period=row['Period'],
                class_name=row['ClassName']
            )
            db.session.add(timetable)
        
        db.session.commit()
        print(f"成功載入 {len(timetable_df)} 筆英文班課表資料")
        
    except Exception as e:
        print(f"載入英文班課表資料時發生錯誤: {e}")
        db.session.rollback()

def load_homeroom_timetable_data():
    """載入 Home Room 課表資料到資料庫（目前為空，等待資料）"""
    try:
        # 清空現有資料
        HomeRoomTimetable.query.delete()
        db.session.commit()
        print("Home Room 課表資料表已清空，等待資料載入")
        
    except Exception as e:
        print(f"處理 Home Room 課表資料時發生錯誤: {e}")
        db.session.rollback()

def load_all_data():
    """載入所有資料"""
    print("開始載入學生課表資料...")
    from src.main import app
    with app.app_context():
        db.create_all()
        load_student_data()
        load_english_timetable_data()
        load_homeroom_timetable_data()
    print("資料載入完成！")

if __name__ == '__main__':
    from src.main import app
    with app.app_context():
        db.create_all()
        load_all_data()

