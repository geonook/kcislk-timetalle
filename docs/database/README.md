# 資料庫設計文檔

## 概述

KCISLK 課表查詢系統使用 SQLite 資料庫儲存所有課表和學生資訊。系統採用 SQLAlchemy ORM 進行資料庫操作。

## 資料庫配置

- **資料庫類型**: SQLite
- **ORM**: SQLAlchemy 2.0
- **資料庫檔案位置**: `timetable_api/src/database/app.db`
- **連線 URI**: `sqlite:///src/database/app.db`

## 資料表結構

### 1. 課表主表 (timetable)

存儲班級課表的基本資訊。

```sql
CREATE TABLE timetable (
    id INTEGER PRIMARY KEY,
    day VARCHAR(10) NOT NULL,           -- 星期 (Monday, Tuesday, ...)
    period_number INTEGER NOT NULL,     -- 節次 (1-8)
    time_range VARCHAR(20) NOT NULL,    -- 時間範圍 (8:25-9:05)
    classroom VARCHAR(20) NOT NULL,     -- 教室 (E101, E203, ...)
    teacher VARCHAR(100) NOT NULL,      -- 教師 (張家芸 Kenny)
    class_name VARCHAR(50) NOT NULL     -- 班級名稱 (G1 Visionaries)
);
```

**欄位說明**:
- `day`: 星期一到星期五 (Monday-Friday)
- `period_number`: 課程節次，通常為 1-8
- `time_range`: 課程時間，格式為 "開始時間-結束時間"
- `classroom`: 上課教室代碼
- `teacher`: 授課教師姓名（可能包含中英文）
- `class_name`: 班級完整名稱

### 2. 班級資訊表 (classes)

存儲班級的基本資訊。

```sql
CREATE TABLE classes (
    id INTEGER PRIMARY KEY,
    class_name VARCHAR(50) UNIQUE NOT NULL,  -- 班級名稱
    grade VARCHAR(10) NOT NULL               -- 年級 (G1, G2, ...)
);
```

### 3. 教師表 (teachers)

存儲所有教師資訊。

```sql
CREATE TABLE teachers (
    id INTEGER PRIMARY KEY,
    teacher_name VARCHAR(100) UNIQUE NOT NULL  -- 教師姓名
);
```

### 4. 教室表 (classrooms)

存儲所有教室資訊。

```sql
CREATE TABLE classrooms (
    id INTEGER PRIMARY KEY,
    classroom_name VARCHAR(20) UNIQUE NOT NULL  -- 教室名稱
);
```

### 5. 節次表 (periods)

存儲課程節次和時間資訊。

```sql
CREATE TABLE periods (
    id INTEGER PRIMARY KEY,
    period_number INTEGER UNIQUE NOT NULL,  -- 節次編號
    time_range VARCHAR(20) NOT NULL,        -- 時間範圍
    start_time VARCHAR(10) NOT NULL,        -- 開始時間
    end_time VARCHAR(10) NOT NULL           -- 結束時間
);
```

### 6. 學生表 (students)

存儲學生基本資訊和所屬班級。

```sql
CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,       -- 學號
    student_name VARCHAR(100) NOT NULL,       -- 學生姓名
    english_class_name VARCHAR(50) NOT NULL,  -- 英文班級
    home_room_class_name VARCHAR(20) NOT NULL, -- 導師班級
    ev_myreading_class_name VARCHAR(20)       -- EV & myReading 班級
);
```

**特殊說明**:
- 每個學生同時屬於三種不同類型的班級
- `ev_myreading_class_name` 可以為空（部分學生可能沒有此類課程）

### 7. 英文課表 (english_timetable)

存儲英文班級的課表資訊。

```sql
CREATE TABLE english_timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day VARCHAR(20) NOT NULL,           -- 星期
    classroom VARCHAR(20) NOT NULL,     -- 教室
    teacher VARCHAR(100) NOT NULL,      -- 教師
    period VARCHAR(30) NOT NULL,        -- 節次（可能包含特殊格式）
    class_name VARCHAR(50) NOT NULL     -- 班級名稱
);
```

### 8. 導師班課表 (homeroom_timetable)

存儲導師班的課表資訊。

```sql
CREATE TABLE homeroom_timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    home_room_class_name VARCHAR(20) NOT NULL, -- 導師班級名稱
    day VARCHAR(20) NOT NULL,                  -- 星期
    period VARCHAR(30) NOT NULL,               -- 節次
    classroom VARCHAR(20) NOT NULL,            -- 教室
    teacher VARCHAR(100) NOT NULL,             -- 教師
    course_name VARCHAR(100) NOT NULL          -- 課程名稱
);
```

## 資料模型 (SQLAlchemy Models)

### Timetable 模型

```python
class Timetable(db.Model):
    __tablename__ = 'timetable'

    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(10), nullable=False)
    period_number = db.Column(db.Integer, nullable=False)
    time_range = db.Column(db.String(20), nullable=False)
    classroom = db.Column(db.String(20), nullable=False)
    teacher = db.Column(db.String(100), nullable=False)
    class_name = db.Column(db.String(50), nullable=False)
```

### Student 模型

```python
class Student(db.Model):
    __tablename__ = 'students'

    student_id = db.Column(db.String(20), primary_key=True)
    student_name = db.Column(db.String(100), nullable=False)
    english_class_name = db.Column(db.String(50), nullable=False)
    home_room_class_name = db.Column(db.String(20), nullable=False)
    ev_myreading_class_name = db.Column(db.String(20), nullable=True)
```

## 資料載入流程

### 1. 資料庫初始化

應用程式啟動時會自動檢查資料庫狀態：

```python
def initialize_data():
    # 檢查是否已有數據
    if ClassInfo.query.count() == 0:
        # 載入課表數據
        load_timetable_data()
        # 載入學生數據
        load_all_data()
```

### 2. 資料來源

- **課表資料**: 從 CSV 檔案載入 (透過 `data_loader.py`)
- **學生資料**: 從 CSV 檔案載入 (透過 `data_loader_student.py`)

### 3. 資料驗證

載入過程中會進行以下驗證：
- 重複資料檢查
- 外鍵完整性驗證
- 必填欄位檢查

## 查詢模式

### 1. 學生課表查詢

系統會整合三種課表類型的資料：

```python
# 英文班課表
english_classes = EnglishTimetable.query.filter_by(
    class_name=student.english_class_name
).all()

# 導師班課表
homeroom_classes = HomeRoomTimetable.query.filter_by(
    home_room_class_name=student.home_room_class_name
).all()

# EV & myReading 課表
ev_classes = EnglishTimetable.query.filter_by(
    class_name=student.ev_myreading_class_name
).all()
```

### 2. 班級課表查詢

```python
# 取得特定班級的週課表
courses = Timetable.query.filter_by(class_name=class_name).all()

# 按星期組織
timetable = defaultdict(list)
for course in courses:
    timetable[course.day].append({
        'period': course.period_number,
        'time': course.time_range,
        'teacher': course.teacher,
        'classroom': course.classroom
    })
```

## 效能考量

### 1. 索引策略

建議在以下欄位建立索引：
- `students.student_name` - 用於學生姓名搜尋
- `students.student_id` - 主鍵，自動索引
- `timetable.class_name` - 用於班級課表查詢
- `english_timetable.class_name` - 用於英文班課表查詢
- `homeroom_timetable.home_room_class_name` - 用於導師班課表查詢

### 2. 查詢最佳化

- 使用 SQLAlchemy 的 lazy loading 減少不必要的查詢
- 對於複雜查詢使用 join 減少資料庫往返次數
- 快取常用查詢結果

## 備份與維護

### 1. 資料備份

```bash
# 複製 SQLite 檔案
cp timetable_api/src/database/app.db backup/app_$(date +%Y%m%d).db
```

### 2. 資料庫維護

```python
# 重建資料庫（開發環境）
with app.app_context():
    db.drop_all()
    db.create_all()
    initialize_data()
```

## 資料完整性

### 1. 約束條件

- 主鍵約束：確保記錄唯一性
- 非空約束：關鍵欄位不可為空
- 唯一約束：防止重複資料

### 2. 業務邏輯驗證

- 學生必須同時屬於英文班和導師班
- 課程時間不可衝突
- 教室在同一時間只能有一個班級使用

---

*最後更新: 2025-01-22*