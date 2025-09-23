# 課表查詢系統 - 資料庫設計

## 資料庫表格設計

### 1. 課程表 (timetable)
- id: 主鍵 (自動遞增)
- day: 星期 (Monday, Tuesday, Wednesday, Thursday, Friday)
- period_number: 節次 (1-8)
- time_range: 時間範圍 (例如: 8:25-9:05)
- classroom: 教室 (例如: E101, E203)
- teacher: 教師 (例如: 張家芸 Kenny)
- class_name: 班級名稱 (例如: G1 Visionaries)

### 2. 班級列表 (classes)
- id: 主鍵 (自動遞增)
- class_name: 班級名稱 (唯一)
- grade: 年級 (從班級名稱提取，例如: G1, G2)

### 3. 教師列表 (teachers)
- id: 主鍵 (自動遞增)
- teacher_name: 教師姓名 (唯一)

### 4. 教室列表 (classrooms)
- id: 主鍵 (自動遞增)
- classroom_name: 教室名稱 (唯一)

### 5. 時間表 (periods)
- id: 主鍵 (自動遞增)
- period_number: 節次 (1-8)
- time_range: 時間範圍
- start_time: 開始時間
- end_time: 結束時間

## API 端點設計

### 1. 取得所有班級列表
- **GET** `/api/classes`
- 回應: 所有班級名稱的列表

### 2. 取得特定班級的週課表
- **GET** `/api/timetable/{class_name}`
- 參數: class_name (班級名稱)
- 回應: 該班級一週的完整課表，按星期和節次排列

### 3. 取得特定班級在特定日期的課表
- **GET** `/api/timetable/{class_name}/{day}`
- 參數: class_name (班級名稱), day (星期)
- 回應: 該班級在指定日期的課表

### 4. 搜尋課程
- **GET** `/api/search`
- 查詢參數: 
  - class_name (可選): 班級名稱
  - teacher (可選): 教師姓名
  - classroom (可選): 教室
  - day (可選): 星期
- 回應: 符合條件的課程列表

## 資料結構範例

### 班級週課表回應格式
```json
{
  "class_name": "G1 Visionaries",
  "timetable": {
    "Monday": [
      {
        "period": 3,
        "time": "10:20-11:00",
        "teacher": "張家芸 Kenny",
        "classroom": "E101"
      },
      {
        "period": 4,
        "time": "11:05-11:45",
        "teacher": "張家芸 Kenny",
        "classroom": "E101"
      }
    ],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": []
  }
}
```

### 班級列表回應格式
```json
{
  "classes": [
    "G1 Visionaries",
    "G1 Inventors",
    "G1 Discoverers",
    "G2 Innovators"
  ]
}
```

