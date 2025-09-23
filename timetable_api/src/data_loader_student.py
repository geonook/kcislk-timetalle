import pandas as pd
import sqlite3
import os
from src.models.timetable import db
from src.models.student import Student, EnglishTimetable, HomeRoomTimetable

def load_student_data():
    """載入學生資料到資料庫"""
    try:
        # 設定學生資料 CSV 檔案路徑
        csv_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'students_template.csv')

        # 檢查檔案是否存在
        if not os.path.exists(csv_file_path):
            print(f"錯誤：找不到學生資料檔案 {csv_file_path}")
            return False

        # 讀取學生資料 CSV
        students_df = pd.read_csv(csv_file_path)
        
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
        return True

    except Exception as e:
        print(f"載入學生資料時發生錯誤: {e}")
        db.session.rollback()
        return False

def load_english_timetable_data():
    """載入英文班課表資料到資料庫"""
    try:
        # 設定英文班課表 CSV 檔案路徑
        csv_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'english_timetable_template.csv')

        # 檢查檔案是否存在
        if not os.path.exists(csv_file_path):
            print(f"錯誤：找不到英文班課表檔案 {csv_file_path}")
            return False

        # 讀取英文班課表 CSV
        timetable_df = pd.read_csv(csv_file_path)
        
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
        return True

    except Exception as e:
        print(f"載入英文班課表資料時發生錯誤: {e}")
        db.session.rollback()
        return False

def load_homeroom_timetable_data():
    """載入 Home Room 課表資料到資料庫"""
    try:
        # 設定 Home Room 課表 CSV 檔案路徑
        csv_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'homeroom_timetable_template.csv')

        # 清空現有資料
        HomeRoomTimetable.query.delete()

        # 檢查檔案是否存在
        if not os.path.exists(csv_file_path):
            print(f"警告：找不到 Home Room 課表檔案 {csv_file_path}，跳過載入")
            db.session.commit()
            return True

        # 讀取 Home Room 課表 CSV
        homeroom_df = pd.read_csv(csv_file_path)

        # 載入 Home Room 課表資料
        for _, row in homeroom_df.iterrows():
            homeroom_entry = HomeRoomTimetable(
                home_room_class_name=row['Home Room Class Name'],
                day=row['Day'],
                period=row['Period'],
                classroom=row['Classroom'],
                teacher=row['Teacher'],
                course_name=row['Course Name']
            )
            db.session.add(homeroom_entry)

        db.session.commit()
        print(f"成功載入 {len(homeroom_df)} 筆 Home Room 課表資料")
        return True

    except Exception as e:
        print(f"處理 Home Room 課表資料時發生錯誤: {e}")
        db.session.rollback()
        return False

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

