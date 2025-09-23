import pandas as pd
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.timetable import db, Timetable, ClassInfo, Teacher, Classroom, Period
from src.main import app

def load_timetable_data(csv_file_path):
    """載入課表資料到資料庫"""
    
    # 讀取CSV檔案
    df = pd.read_csv(csv_file_path, sep=',')
    
    # 提取節次號碼和時間範圍
    df['Period_Number'] = df['Period'].apply(lambda x: int(x.split(')')[0].replace('(', '')))
    df['Time_Range'] = df['Period'].apply(lambda x: x.split(')')[1])
    
    with app.app_context():
        # 清空現有資料
        db.drop_all()
        db.create_all()
        
        # 載入節次資訊
        periods_data = {}
        for _, row in df.iterrows():
            period_num = row['Period_Number']
            time_range = row['Time_Range']
            if period_num not in periods_data:
                start_time, end_time = time_range.split('-')
                periods_data[period_num] = {
                    'time_range': time_range,
                    'start_time': start_time,
                    'end_time': end_time
                }
        
        for period_num, period_info in periods_data.items():
            period = Period(
                period_number=period_num,
                time_range=period_info['time_range'],
                start_time=period_info['start_time'],
                end_time=period_info['end_time']
            )
            db.session.add(period)
        
        # 載入班級資訊
        unique_classes = df['ClassName'].unique()
        for class_name in unique_classes:
            # 提取年級 (G1, G2, etc.)
            grade = 'Unknown'
            if class_name.startswith('G'):
                grade = class_name.split(' ')[0]
            
            class_info = ClassInfo(
                class_name=class_name,
                grade=grade
            )
            db.session.add(class_info)
        
        # 載入教師資訊
        unique_teachers = df['Teacher'].unique()
        for teacher_name in unique_teachers:
            teacher = Teacher(teacher_name=teacher_name)
            db.session.add(teacher)
        
        # 載入教室資訊
        unique_classrooms = df['Classroom'].unique()
        for classroom_name in unique_classrooms:
            classroom = Classroom(classroom_name=classroom_name)
            db.session.add(classroom)
        
        # 載入課表資料
        for _, row in df.iterrows():
            timetable_entry = Timetable(
                day=row['Day'],
                period_number=row['Period_Number'],
                time_range=row['Time_Range'],
                classroom=row['Classroom'],
                teacher=row['Teacher'],
                class_name=row['ClassName']
            )
            db.session.add(timetable_entry)
        
        # 提交所有變更
        db.session.commit()
        
        print(f"成功載入 {len(df)} 筆課表資料")
        print(f"班級數量: {len(unique_classes)}")
        print(f"教師數量: {len(unique_teachers)}")
        print(f"教室數量: {len(unique_classrooms)}")
        print(f"節次數量: {len(periods_data)}")

if __name__ == '__main__':
    csv_file = '/home/ubuntu/upload/students_classschedule-english_timetable_template.csv'
    load_timetable_data(csv_file)

