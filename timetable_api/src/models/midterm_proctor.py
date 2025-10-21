from src.models.timetable import db
from datetime import datetime

class MidtermProctor(db.Model):
    """期中考監考老師資料模型"""
    __tablename__ = 'midterm_proctors'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    exam_date = db.Column(db.Date, nullable=False)                    # 考試日期 (2025-11-04)
    day_name = db.Column(db.String(20), nullable=False)               # 星期 (Tuesday, Wednesday, Thursday)
    period = db.Column(db.Integer, nullable=False)                    # 節次 (3, 4, 5, 6, 7, 8)
    period_time = db.Column(db.String(20), nullable=False)            # 時間 (12:55-13:35)
    grade = db.Column(db.String(10), nullable=False)                  # 年級 (G1, G2, G3, G4, G5, G6)
    class_name = db.Column(db.String(50), nullable=False)             # 班級 (G1 Visionaries)
    exam_type = db.Column(db.String(50), nullable=False)              # 考試類型 (IT Assessment / LT Assessment)
    proctor_teacher = db.Column(db.String(100), nullable=True)        # 監考老師
    classroom = db.Column(db.String(20), nullable=True)               # 考場教室
    notes = db.Column(db.Text, nullable=True)                         # 備註
    created_at = db.Column(db.DateTime, default=datetime.utcnow)      # 建立時間
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新時間

    # 唯一性約束：同一個班級在同一個時段只能有一筆記錄
    __table_args__ = (
        db.UniqueConstraint('exam_date', 'period', 'class_name', name='unique_class_exam_slot'),
    )

    def to_dict(self):
        """轉換為字典格式"""
        return {
            'id': self.id,
            'exam_date': self.exam_date.strftime('%Y-%m-%d') if self.exam_date else None,
            'day_name': self.day_name,
            'period': self.period,
            'period_time': self.period_time,
            'grade': self.grade,
            'class_name': self.class_name,
            'exam_type': self.exam_type,
            'proctor_teacher': self.proctor_teacher,
            'classroom': self.classroom,
            'notes': self.notes,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S') if self.updated_at else None,
        }

    def __repr__(self):
        return f'<MidtermProctor {self.class_name} on {self.exam_date} Period {self.period}>'
