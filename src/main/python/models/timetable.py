from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Timetable(db.Model):
    __tablename__ = 'timetable'
    
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(10), nullable=False)  # Monday, Tuesday, etc.
    period_number = db.Column(db.Integer, nullable=False)  # 1-8
    time_range = db.Column(db.String(20), nullable=False)  # 8:25-9:05
    classroom = db.Column(db.String(20), nullable=False)  # E101, E203, etc.
    teacher = db.Column(db.String(100), nullable=False)  # 張家芸 Kenny
    class_name = db.Column(db.String(50), nullable=False)  # G1 Visionaries
    
    def to_dict(self):
        return {
            'id': self.id,
            'day': self.day,
            'period': self.period_number,
            'time': self.time_range,
            'classroom': self.classroom,
            'teacher': self.teacher,
            'class_name': self.class_name
        }

class ClassInfo(db.Model):
    __tablename__ = 'classes'
    
    id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(50), unique=True, nullable=False)
    grade = db.Column(db.String(10), nullable=False)  # G1, G2, etc.
    
    def to_dict(self):
        return {
            'id': self.id,
            'class_name': self.class_name,
            'grade': self.grade
        }

class Teacher(db.Model):
    __tablename__ = 'teachers'
    
    id = db.Column(db.Integer, primary_key=True)
    teacher_name = db.Column(db.String(100), unique=True, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'teacher_name': self.teacher_name
        }

class Classroom(db.Model):
    __tablename__ = 'classrooms'
    
    id = db.Column(db.Integer, primary_key=True)
    classroom_name = db.Column(db.String(20), unique=True, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'classroom_name': self.classroom_name
        }

class Period(db.Model):
    __tablename__ = 'periods'
    
    id = db.Column(db.Integer, primary_key=True)
    period_number = db.Column(db.Integer, unique=True, nullable=False)
    time_range = db.Column(db.String(20), nullable=False)
    start_time = db.Column(db.String(10), nullable=False)
    end_time = db.Column(db.String(10), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'period_number': self.period_number,
            'time_range': self.time_range,
            'start_time': self.start_time,
            'end_time': self.end_time
        }

