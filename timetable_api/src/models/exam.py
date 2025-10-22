"""
期中考監考管理系統 - 資料模型
支援 LT Assessment 和 IT Assessment 的監考老師分配
"""
from src.models.timetable import db
from datetime import datetime


class ExamSession(db.Model):
    """考試場次 - 記錄每個 GradeBand 的考試時間資訊"""
    __tablename__ = 'exam_sessions'

    id = db.Column(db.Integer, primary_key=True)
    grade_band = db.Column(db.String(20), unique=True, nullable=False)  # G1 LT's, G2 IT's, etc.
    exam_type = db.Column(db.String(10), nullable=False)  # LT 或 IT
    grade = db.Column(db.String(5), nullable=False)  # G1, G2, G3, etc.
    exam_date = db.Column(db.String(10), nullable=False)  # 2025-11-04
    periods = db.Column(db.String(10), nullable=False)  # P1-P2, P3-P4, P5-P6, P7-P8
    duration = db.Column(db.Integer, nullable=False)  # 考試時長（分鐘）: 60, 75, 80
    self_study_time = db.Column(db.String(20), nullable=True)  # 10:20-10:35 或 None
    preparation_time = db.Column(db.String(20), nullable=False)  # 08:25-08:30
    exam_time = db.Column(db.String(20), nullable=False)  # 08:30-09:50
    subject = db.Column(db.String(20), nullable=False)  # LT Assessment / IT Assessment

    # 關聯到班級考試資訊
    class_exam_infos = db.relationship('ClassExamInfo', backref='exam_session', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'grade_band': self.grade_band,
            'exam_type': self.exam_type,
            'grade': self.grade,
            'exam_date': self.exam_date,
            'periods': self.periods,
            'duration': self.duration,
            'self_study_time': self.self_study_time if self.self_study_time else 'None',
            'preparation_time': self.preparation_time,
            'exam_time': self.exam_time,
            'subject': self.subject
        }


class ClassExamInfo(db.Model):
    """班級考試資訊 - 記錄每個班級的考試基本資料"""
    __tablename__ = 'class_exam_info'

    id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(50), nullable=False, unique=True)  # G1 Achievers, G3 Trailblazers
    grade = db.Column(db.String(5), nullable=False)  # G1, G2, G3, etc.
    level = db.Column(db.String(10), nullable=False)  # G1E1, G3E2, etc.
    exam_session_id = db.Column(db.Integer, db.ForeignKey('exam_sessions.id'), nullable=False)
    students = db.Column(db.Integer, nullable=False)  # 學生人數
    teacher = db.Column(db.String(100), nullable=True)  # 班級導師（從現有資料查詢）

    # 關聯到監考分配
    proctor_assignment = db.relationship('ProctorAssignment', backref='class_exam_info', uselist=False, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'class_name': self.class_name,
            'grade': self.grade,
            'level': self.level,
            'exam_session_id': self.exam_session_id,
            'students': self.students,
            'count': self.students + 1,  # Count = Students + 1
            'teacher': self.teacher,
            'has_proctor': self.proctor_assignment is not None
        }

    def to_full_dict(self):
        """完整資訊，包含考試場次和監考分配"""
        result = self.to_dict()

        # 加入考試場次資訊
        if self.exam_session:
            result['exam_session'] = self.exam_session.to_dict()

        # 加入監考分配資訊
        if self.proctor_assignment:
            result['proctor'] = self.proctor_assignment.proctor_teacher
            result['classroom'] = self.proctor_assignment.classroom
            result['notes'] = self.proctor_assignment.notes
        else:
            result['proctor'] = None
            result['classroom'] = None
            result['notes'] = None

        return result


class ProctorAssignment(db.Model):
    """監考分配 - 記錄每個班級的監考老師和教室"""
    __tablename__ = 'proctor_assignments'

    id = db.Column(db.Integer, primary_key=True)
    class_exam_info_id = db.Column(db.Integer, db.ForeignKey('class_exam_info.id'), nullable=False, unique=True)
    proctor_teacher = db.Column(db.String(100), nullable=False)  # 監考老師
    classroom = db.Column(db.String(20), nullable=False)  # 考試教室
    notes = db.Column(db.Text, nullable=True)  # 備註
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'class_exam_info_id': self.class_exam_info_id,
            'class_name': self.class_exam_info.class_name if self.class_exam_info else None,
            'proctor_teacher': self.proctor_teacher,
            'classroom': self.classroom,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
