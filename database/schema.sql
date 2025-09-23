-- KCISLK 課表查詢系統 - 資料庫架構
-- 康橋國際學校林口校區小學部課表查詢系統

-- 建立資料庫表格

-- 1. 時間表 (periods) - 定義節次和時間
CREATE TABLE periods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_number INTEGER NOT NULL UNIQUE,
    time_range TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 班級列表 (classes)
CREATE TABLE classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name TEXT NOT NULL UNIQUE,
    grade TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 教師列表 (teachers)
CREATE TABLE teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_name TEXT NOT NULL UNIQUE,
    teacher_name_en TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 教室列表 (classrooms)
CREATE TABLE classrooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    classroom_name TEXT NOT NULL UNIQUE,
    building TEXT,
    floor INTEGER,
    capacity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 課程表 (timetable) - 主要課表資料
CREATE TABLE timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    classroom_id INTEGER NOT NULL,
    period_id INTEGER NOT NULL,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')),
    subject TEXT,
    subject_en TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
    FOREIGN KEY (period_id) REFERENCES periods(id),
    UNIQUE(class_id, day_of_week, period_id)
);

-- 建立索引以提升查詢效能
CREATE INDEX idx_timetable_class ON timetable(class_id);
CREATE INDEX idx_timetable_teacher ON timetable(teacher_id);
CREATE INDEX idx_timetable_classroom ON timetable(classroom_id);
CREATE INDEX idx_timetable_day ON timetable(day_of_week);
CREATE INDEX idx_timetable_period ON timetable(period_id);
CREATE INDEX idx_timetable_class_day ON timetable(class_id, day_of_week);

-- 插入時間表基礎資料
INSERT INTO periods (period_number, time_range, start_time, end_time) VALUES
(1, '08:25-09:05', '08:25:00', '09:05:00'),
(2, '09:10-09:50', '09:10:00', '09:50:00'),
(3, '10:20-11:00', '10:20:00', '11:00:00'),
(4, '11:05-11:45', '11:05:00', '11:45:00'),
(5, '13:00-13:40', '13:00:00', '13:40:00'),
(6, '13:45-14:25', '13:45:00', '14:25:00'),
(7, '14:30-15:10', '14:30:00', '15:10:00'),
(8, '15:15-15:55', '15:15:00', '15:55:00');