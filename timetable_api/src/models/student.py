from src.models.timetable import db

class Student(db.Model):
    __tablename__ = 'students'
    
    student_id = db.Column(db.String(20), primary_key=True)
    student_name = db.Column(db.String(100), nullable=False)
    english_class_name = db.Column(db.String(50), nullable=False)
    home_room_class_name = db.Column(db.String(20), nullable=False)
    ev_myreading_class_name = db.Column(db.String(20), nullable=True)
    
    def to_dict(self):
        return {
            'student_id': self.student_id,
            'student_name': self.student_name,
            'english_class_name': self.english_class_name,
            'home_room_class_name': self.home_room_class_name,
            'ev_myreading_class_name': self.ev_myreading_class_name
        }

class EnglishTimetable(db.Model):
    __tablename__ = 'english_timetable'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    day = db.Column(db.String(20), nullable=False)
    classroom = db.Column(db.String(20), nullable=False)
    teacher = db.Column(db.String(100), nullable=False)
    period = db.Column(db.String(30), nullable=False)
    class_name = db.Column(db.String(50), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'day': self.day,
            'classroom': self.classroom,
            'teacher': self.teacher,
            'period': self.period,
            'class_name': self.class_name
        }

class HomeRoomTimetable(db.Model):
    __tablename__ = 'homeroom_timetable'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    home_room_class_name = db.Column(db.String(20), nullable=False)
    day = db.Column(db.String(20), nullable=False)
    period = db.Column(db.String(30), nullable=False)
    classroom = db.Column(db.String(20), nullable=False)
    teacher = db.Column(db.String(100), nullable=False)
    course_name = db.Column(db.String(100), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'home_room_class_name': self.home_room_class_name,
            'day': self.day,
            'period': self.period,
            'classroom': self.classroom,
            'teacher': self.teacher,
            'course_name': self.course_name
        }

