# API Documentation

## 概述

KCISLK 課表查詢系統提供 RESTful API，支援學生課表查詢和班級課表管理。

## 基本資訊

- **開發環境**: `http://localhost:8081/api`
- **生產環境**: `https://kcislk-backend.zeabur.app/api`
- **格式**: JSON
- **編碼**: UTF-8

## API 端點

### 學生相關 API

#### 1. 搜尋學生
```http
GET /api/students/search?q={query}
```

**參數**:
- `q` (string): 搜尋關鍵字（學生姓名或學號）

**回應**:
```json
{
  "success": true,
  "students": [
    {
      "student_id": "20241001",
      "student_name": "王小明",
      "english_class_name": "1A_English",
      "home_room_class_name": "1A_HomeRoom",
      "ev_myreading_class_name": "1A_EV",
      "grade": "1"
    }
  ]
}
```

#### 2. 取得學生詳細資訊
```http
GET /api/students/{student_id}
```

**回應**:
```json
{
  "success": true,
  "student": {
    "student_id": "20241001",
    "student_name": "王小明",
    "english_class_name": "1A_English",
    "home_room_class_name": "1A_HomeRoom",
    "ev_myreading_class_name": "1A_EV",
    "grade": "1"
  },
  "timetables": {
    "english_timetable": { /* 英文班課表 */ },
    "homeroom_timetable": { /* 導師班課表 */ },
    "ev_myreading_timetable": { /* EV & myReading 課表 */ }
  },
  "statistics": {
    "total_classes": 25,
    "days_with_classes": 5,
    "english_classes": 10,
    "ev_myreading_classes": 8,
    "homeroom_classes": 7
  }
}
```

#### 3. 取得學生課表
```http
GET /api/students/{student_id}/timetable
```

**回應**:
```json
{
  "student": { /* 學生資訊 */ },
  "english_classes": [
    {
      "class_name": "1A_English",
      "day": "Monday",
      "period": "1",
      "teacher": "John Smith",
      "classroom": "E101"
    }
  ],
  "ev_myreading_classes": [ /* EV & myReading 課程 */ ],
  "homeroom_classes": [ /* 導師班課程 */ ]
}
```

#### 4. 取得學生週課表
```http
GET /api/students/{student_id}/timetable/weekly
```

**回應**:
```json
{
  "success": true,
  "student": { /* 學生資訊 */ },
  "weekly_timetable": {
    "Monday": [
      {
        "day": "Monday",
        "period": "1",
        "classroom": "E101",
        "teacher": "John Smith",
        "course_name": "English - 1A_English",
        "class_type": "english"
      }
    ],
    "Tuesday": [ /* 星期二課程 */ ],
    /* ... 其他星期 */
  },
  "statistics": {
    "total_classes": 25,
    "days_with_classes": 5,
    "english_classes": 10,
    "ev_myreading_classes": 8,
    "homeroom_classes": 7
  }
}
```

### 班級相關 API

#### 1. 取得所有班級
```http
GET /api/classes
```

**說明**: 此 API 支援回傳英文班級和 Homeroom 班級列表

**回應**:
```json
{
  "success": true,
  "classes": [
    "G1 Achievers",
    "G1 Pioneers",
    "101",
    "102",
    "201",
    "202"
  ],
  "counts": {
    "english_classes": 16,
    "homeroom_classes": 42,
    "total_classes": 58
  }
}
```

#### 2. 取得班級週課表
```http
GET /api/timetables/{class_name}
```

**回應**:
```json
{
  "success": true,
  "class_name": "1A_English",
  "timetable": {
    "Monday": [
      {
        "period": 1,
        "time": "08:30-09:15",
        "teacher": "John Smith",
        "classroom": "E101"
      }
    ],
    "Tuesday": [ /* 星期二課程 */ ],
    /* ... 其他星期 */
  }
}
```

#### 3. 取得班級日課表
```http
GET /api/timetables/{class_name}/{day}
```

**參數**:
- `class_name` (string): 班級名稱
- `day` (string): 星期 (Monday, Tuesday, Wednesday, Thursday, Friday)

**回應**:
```json
{
  "success": true,
  "class_name": "1A_English",
  "day": "Monday",
  "courses": [
    {
      "period": 1,
      "time": "08:30-09:15",
      "teacher": "John Smith",
      "classroom": "E101"
    }
  ]
}
```

### 搜尋 API

#### 1. 搜尋課程
```http
GET /api/search?class_name={class_name}&teacher={teacher}&classroom={classroom}&day={day}
```

**參數** (全部為選填):
- `class_name` (string): 班級名稱
- `teacher` (string): 教師名稱
- `classroom` (string): 教室名稱
- `day` (string): 星期

**回應**:
```json
{
  "success": true,
  "results": [
    {
      "class_name": "1A_English",
      "day": "Monday",
      "period_number": 1,
      "time_range": "08:30-09:15",
      "teacher": "John Smith",
      "classroom": "E101"
    }
  ],
  "count": 1
}
```

### 資源列表 API

#### 1. 取得所有教師
```http
GET /api/teachers
```

**回應**:
```json
{
  "success": true,
  "teachers": [
    "John Smith",
    "Mary Johnson",
    "李小華"
  ]
}
```

#### 2. 取得所有教室
```http
GET /api/classrooms
```

**回應**:
```json
{
  "success": true,
  "classrooms": [
    "E101",
    "E102",
    "M201"
  ]
}
```

#### 3. 取得所有節次資訊
```http
GET /api/periods
```

**回應**:
```json
{
  "success": true,
  "periods": [
    {
      "period_number": 1,
      "time_range": "08:30-09:15",
      "duration": 45
    },
    {
      "period_number": 2,
      "time_range": "09:25-10:10",
      "duration": 45
    }
  ]
}
```

## 錯誤處理

所有 API 在發生錯誤時會回傳以下格式：

```json
{
  "success": false,
  "error": "錯誤訊息描述"
}
```

常見的 HTTP 狀態碼：
- `200` - 成功
- `404` - 找不到資源
- `500` - 伺服器內部錯誤

## 課表類型說明

系統支援三種課表類型：

1. **English Class** (英文班): 英語授課班級
2. **Home Room Class** (導師班): 導師時間課程
3. **EV & myReading**: 閱讀與語言發展課程

每個學生會同時擁有這三種類型的課表安排。

## 使用範例

### JavaScript (Fetch API)

```javascript
// 搜尋學生
const searchStudents = async (query) => {
  const response = await fetch(`/api/students/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data;
};

// 取得學生週課表
const getStudentTimetable = async (studentId) => {
  const response = await fetch(`/api/students/${studentId}/timetable/weekly`);
  const data = await response.json();
  return data;
};

// 取得班級課表
const getClassTimetable = async (className) => {
  const response = await fetch(`/api/timetable/${encodeURIComponent(className)}`);
  const data = await response.json();
  return data;
};
```

### Python (requests)

```python
import requests

# API Base URL
API_BASE = "http://localhost:8081/api"  # 開發環境
# API_BASE = "https://kcislk-backend.zeabur.app/api"  # 生產環境

# 搜尋學生
def search_students(query):
    response = requests.get(f"{API_BASE}/students/search?q={query}")
    return response.json()

# 取得學生課表
def get_student_timetable(student_id):
    response = requests.get(f"{API_BASE}/students/{student_id}/timetable/weekly")
    return response.json()

# 取得所有班級
def get_all_classes():
    response = requests.get(f"{API_BASE}/classes")
    return response.json()
```

---

*最後更新: 2025-09-24*
*版本: 2.0*
*狀態: 生產環境已部署*