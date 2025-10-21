#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
匯出所有班級課表為 CSV 檔案
Export all class timetables to CSV file
"""

import os
import sys
import csv
from pathlib import Path

# 設定路徑以便導入專案模組
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.timetable import db, Timetable, ClassInfo
from src.main import app


def export_all_timetables_to_csv(output_file):
    """
    匯出所有班級課表到 CSV 檔案

    Args:
        output_file: 輸出檔案路徑
    """
    print("=" * 60)
    print("📊 開始匯出所有班級課表...")
    print("=" * 60)

    with app.app_context():
        # 查詢所有課表資料，按照班級、星期、節次排序
        timetables = Timetable.query.order_by(
            Timetable.class_name,
            db.case(
                (Timetable.day == 'Monday', 1),
                (Timetable.day == 'Tuesday', 2),
                (Timetable.day == 'Wednesday', 3),
                (Timetable.day == 'Thursday', 4),
                (Timetable.day == 'Friday', 5),
                else_=6
            ),
            Timetable.period_number
        ).all()

        if not timetables:
            print("❌ 資料庫中沒有課表資料！")
            return

        # 建立輸出目錄
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # 寫入 CSV 檔案
        with open(output_file, 'w', newline='', encoding='utf-8-sig') as csvfile:
            # 定義欄位
            fieldnames = ['班級', '年級', '星期', '節次', '時間', '教師', '教室']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            # 寫入標題行
            writer.writeheader()

            # 寫入資料
            for entry in timetables:
                # 提取年級資訊
                grade = entry.class_name.split()[0] if ' ' in entry.class_name else 'Unknown'

                writer.writerow({
                    '班級': entry.class_name,
                    '年級': grade,
                    '星期': entry.day,
                    '節次': entry.period_number,
                    '時間': entry.time_range,
                    '教師': entry.teacher,
                    '教室': entry.classroom
                })

        # 統計資訊
        unique_classes = set(entry.class_name for entry in timetables)
        unique_teachers = set(entry.teacher for entry in timetables)
        unique_classrooms = set(entry.classroom for entry in timetables)

        print("\n✅ 匯出成功！")
        print(f"📁 輸出檔案: {output_file}")
        print(f"\n📊 統計資訊:")
        print(f"   • 總課程數: {len(timetables)} 堂")
        print(f"   • 班級數量: {len(unique_classes)} 個")
        print(f"   • 教師數量: {len(unique_teachers)} 位")
        print(f"   • 教室數量: {len(unique_classrooms)} 間")
        print(f"\n📝 班級列表 (前 10 個):")
        for i, class_name in enumerate(sorted(unique_classes)[:10], 1):
            class_courses = [t for t in timetables if t.class_name == class_name]
            print(f"   {i}. {class_name} - {len(class_courses)} 堂課")

        if len(unique_classes) > 10:
            print(f"   ... 還有 {len(unique_classes) - 10} 個班級")

        print("=" * 60)


if __name__ == '__main__':
    # 輸出檔案路徑（遵循專案規範：放在 output/ 資料夾）
    project_root = Path(__file__).parent.parent.parent
    output_file = project_root / 'output' / 'all_class_timetables.csv'

    export_all_timetables_to_csv(str(output_file))
