# KCISLK 教師課表業務邏輯 Skill

> **用途**: 將康橋國際學校課表邏輯導入其他以教師為使用者的系統
> **版本**: 1.0.0
> **最後更新**: 2025-12-22

---

## 1. 系統概覽

**康橋國際學校林口校區小學部課表系統**

| 項目 | 數量 |
|------|------|
| 教師 | 66+ 位 |
| 班級 | 42 個（1-6年級各7班） |
| 學生 | 1,036+ 位 |
| 每日課時 | 8 節 |
| 上課日 | 週一至週五 |

---

## 2. 教師資料模型

```
Teacher:
  id: 教師ID (自動遞增主鍵)
  teacher_name: 教師名稱 (唯一值，UNIQUE 約束)
```

### 教師名稱格式

| 格式類型 | 範例 |
|----------|------|
| 中英混合 | `張家芸 Kenny`、`林慧君 Liza`、`石珈嘉 Kassie` |
| 純英文 | `Ms. Wendy`、`Mr. Perry`、`Mr. Thompson` |
| 命名規則 | `[中文名] [英文名]` 或 `[稱謂]. [英文名]` |

---

## 3. 課表類型

教師可能同時教授以下三種課程類型：

| 類型 | 說明 | 資料來源 |
|------|------|----------|
| **English** | 英文班課程 | EnglishTimetable 表 |
| **Home Room** | 導師班課程（國語、數學、生活、社會等） | HomeRoomTimetable 表 |
| **EV & myReading** | 特殊課程 | EnglishTimetable 表（班級名如 G1I） |

---

## 4. 時段定義 (Period 1-8)

| 節次 | 時間 |
|------|------|
| Period 1 | 08:25 - 09:05 |
| Period 2 | 09:10 - 09:50 |
| Period 3 | 10:20 - 11:00 |
| Period 4 | 11:05 - 11:45 |
| Period 5 | 12:55 - 13:35 |
| Period 6 | 13:40 - 14:20 |
| Period 7 | 14:25 - 15:05 |
| Period 8 | 15:10 - 15:50 |

**Period 格式**: `(數字)時間範圍`，如 `(3)10:20-11:00`

---

## 5. 課表項目結構

```
TimetableEntry:
  day: 星期 (Monday / Tuesday / Wednesday / Thursday / Friday)
  period: 節次 (1-8)
  time: 時間範圍 (如 "10:20-11:00")
  classroom: 教室代碼 (如 "E101", "一年一班")
  class_name: 班級名稱 (如 "G1 Visionaries", "101")
  course_name: 課程名稱 (如 "English", "國語", "數學")
  class_type: 課程類型 ("english" / "homeroom" / "ev_myreading")
```

---

## 6. 教師個人課表查詢邏輯

### 查詢流程

```
輸入: teacher_name (教師名稱)

步驟 1: 查詢英文班課程
  SELECT * FROM EnglishTimetable WHERE teacher = {teacher_name}

步驟 2: 查詢導師班課程
  SELECT * FROM HomeRoomTimetable WHERE teacher = {teacher_name}

步驟 3: 合併結果
  - 將兩個查詢結果合併
  - 按星期 (day) 和節次 (period) 組織
  - 標記課程類型 (class_type)

步驟 4: 計算統計數據
  - total_classes: 總課時數
  - unique_classes: 不重複班級數
  - days_with_classes: 有課的天數
```

### 範例：查詢「張家芸 Kenny」的課表

```
1. 查詢 EnglishTimetable WHERE teacher = "張家芸 Kenny"
   結果:
   - Monday, Period 3, G1 Visionaries, E101
   - Monday, Period 4, G1 Visionaries, E101
   - Monday, Period 5, G1 Inventors, E101
   - Monday, Period 6, G1 Inventors, E101
   - Tuesday, Period 3, G1 Visionaries, E101
   - ...

2. 查詢 HomeRoomTimetable WHERE teacher = "張家芸 Kenny"
   結果: (空，此教師無導師班課程)

3. 組織為週課表格式:
   {
     "Monday": {
       "3": { class_name: "G1 Visionaries", classroom: "E101", class_type: "english" },
       "4": { class_name: "G1 Visionaries", classroom: "E101", class_type: "english" },
       "5": { class_name: "G1 Inventors", classroom: "E101", class_type: "english" },
       "6": { class_name: "G1 Inventors", classroom: "E101", class_type: "english" }
     },
     "Tuesday": { ... },
     "Wednesday": { ... },
     "Thursday": { ... },
     "Friday": { ... }
   }
```

---

## 7. 教師統計數據

```
statistics:
  total_classes: 總課時數 (整週所有課程)
  days_with_classes: 有課的天數 (1-5)
  english_classes: 英文班課時數
  homeroom_classes: 導師班課時數
  ev_myreading_classes: EV 課時數
  unique_classes: 不重複教授班級數
```

---

## 8. CSV 資料格式與範例

### 8.1 english_timetable.csv（英文班課表）

**欄位定義**:
| 欄位 | 說明 | 範例 |
|------|------|------|
| Day | 星期 | Monday, Tuesday, ... |
| Classroom | 教室代碼 | E101, E203, E306 |
| Teacher | 教師名稱 | 張家芸 Kenny |
| Period | 節次與時間 | (3)10:20-11:00 |
| ClassName | 班級名稱 | G1 Visionaries |

**資料範例** (~1,289 筆):
```csv
Day,Classroom,Teacher,Period,ClassName
Monday,E101,張家芸 Kenny,(3)10:20-11:00,G1 Visionaries
Monday,E101,張家芸 Kenny,(4)11:05-11:45,G1 Visionaries
Monday,E101,張家芸 Kenny,(5)12:55-13:35,G1 Inventors
Monday,E101,張家芸 Kenny,(6)13:40-14:20,G1 Inventors
Monday,E203,林慧君 Liza,(3)10:20-11:00,G1 Discoverers
Monday,E203,林慧君 Liza,(4)11:05-11:45,G1 Discoverers
Monday,E203,林慧君 Liza,(5)12:55-13:35,G1 Voyagers
Monday,E203,林慧君 Liza,(6)13:40-14:20,G1 Voyagers
Monday,E301,朱韻伃 Ariel,(4)11:05-11:45,G1 Seekers
Monday,E301,朱韻伃 Ariel,(5)12:55-13:35,G1 Seekers
Monday,E301,朱韻伃 Ariel,(6)13:40-14:20,G1 Seekers
Monday,E306,石珈嘉 Kassie,(3)10:20-11:00,G1 Navigators
Monday,E306,石珈嘉 Kassie,(4)11:05-11:45,G1 Navigators
Monday,E306,石珈嘉 Kassie,(5)12:55-13:35,G1 Explorers
Monday,E306,石珈嘉 Kassie,(6)13:40-14:20,G1 Explorers
Monday,E309,顏思甄 Wendy,(3)10:20-11:00,G1 Pathfinders
Monday,E309,顏思甄 Wendy,(4)11:05-11:45,G1 Pathfinders
Monday,E309,顏思甄 Wendy,(5)12:55-13:35,G1 Achievers
Monday,E309,顏思甄 Wendy,(6)13:40-14:20,G1 Achievers
Monday,E312,高頌雯 Michelle,(3)10:20-11:00,G1 Innovators
Monday,E312,高頌雯 Michelle,(4)11:05-11:45,G1 Trailblazers
Monday,E409,簡安安 Ann,(3)10:20-11:00,G1 Pioneers
Monday,E409,簡安安 Ann,(4)11:05-11:45,G1 Pioneers
Monday,E409,簡安安 Ann,(5)12:55-13:35,G1 Guardians
Monday,E409,簡安安 Ann,(6)13:40-14:20,G1 Guardians
Monday,E103,林威德 Alvin,(5)12:55-13:35,G2B
Monday,E103,林威德 Alvin,(6)13:40-14:20,G2B
Monday,E103,林威德 Alvin,(7)14:40-15:20,G2 Innovators
Monday,E103,林威德 Alvin,(8)15:25-16:05,G2 Innovators
```

### 8.2 homeroom_timetable.csv（導師班課表）

**欄位定義**:
| 欄位 | 說明 | 範例 |
|------|------|------|
| Day | 星期 | Monday, Tuesday, ... |
| Home Room Class Name | 班級號碼 | 101, 201, 301 |
| Period | 節次與時間 | (1)08:25-09:05 |
| Classroom | 教室名稱 | 一年一班, 二年三班 |
| Teacher | 教師名稱 | 温小嫺, 莊佳珍 |
| Course Name | 課程名稱 | 生活, 國語, 數學, 社會 |

**資料範例** (~1,036 筆):
```csv
Day,Home Room Class Name,Period,Classroom,Teacher,Course Name
Monday,101,(1)08:25-09:05,一年一班,温小嫺,生活
Monday,102,(1)08:25-09:05,一年二班,常嘉文,生活
Monday,103,(1)08:25-09:05,一年三班,陳紀蓉,生活
Monday,104,(1)08:25-09:05,一年四班,陳璿安,生活
Monday,105,(1)08:25-09:05,一年五班,蔡孟均,生活
Monday,106,(1)08:25-09:05,一年六班,黃若芸,生活
Monday,107,(1)08:25-09:05,一年七班,王尹容,生活
Monday,201,(1)08:25-09:05,二年一班,莊佳珍,國語
Monday,202,(1)08:25-09:05,二年二班,鄭乙璇,生活
Monday,203,(1)08:25-09:05,二年三班,林宛柔,國語
Monday,204,(1)08:25-09:05,二年四班,林詩旆,生活
Monday,205,(1)08:25-09:05,二年五班,曾雨柔,生活
Monday,206,(1)08:25-09:05,二年六班,沈婉筑,生活
Monday,207,(1)08:25-09:05,二年七班,劉嘉惠,國語
Monday,301,(1)08:25-09:05,三年一班,周兆翃,國語
Monday,302,(1)08:25-09:05,三年二班,林姵君,國語
Monday,303,(1)08:25-09:05,三年三班,莊雅筑,數學
Monday,304,(1)08:25-09:05,三年四班,林慈鈺,國語
Monday,305,(1)08:25-09:05,三年五班,林秀珍,國語
Monday,306,(1)08:25-09:05,三年六班,黃淨微,國語
Monday,307,(1)08:25-09:05,三年七班,楊思婷,國語
Monday,401,(1)08:25-09:05,四年一班,李雅琦,社會
Monday,402,(1)08:25-09:05,四年二班,鄭舒心,國語
Monday,403,(1)08:25-09:05,四年三班,陳胤君,數學
Monday,404,(1)08:25-09:05,四年四班,許晏綾,國語
Monday,405,(1)08:25-09:05,四年五班,江容瑋,數學
Monday,406,(1)08:25-09:05,四年六班,王瀞桾,社會
Monday,407,(1)08:25-09:05,四年七班,吳蕎安,國語
Monday,501,(1)08:25-09:05,五年一班,李沛珊,國語
```

### 8.3 class_teachers.csv（班級導師映射）

**欄位定義**:
| 欄位 | 說明 | 範例 |
|------|------|------|
| EnglishName | 英文班級名稱 | G1 Achievers |
| system_display_lt | 班級導師 | Ms. Wendy |
| system_display_it | 副班導師 | Mr. Perry |

**資料範例** (42 筆):
```csv
EnglishName,system_display_lt,system_display_it
G1 Achievers,Ms. Wendy,Mr. Perry
G1 Discoverers,Ms. Liza,Mr. Thompson
G1 Voyagers,Ms. Liza,Mr. Thompson
G1 Explorers,Ms. Kassie,Mr. Mueller
G1 Navigators,Ms. Kassie,Mr. Mueller
G1 Adventurers,Ms. Ariel,Mr. Van Rensburg
G1 Guardians,Ms. Ann,Ms. Xwayi
G1 Pioneers,Ms. Ann,Ms. Xwayi
G1 Innovators,Ms. Michelle,Ms. Ngcongo
G1 Visionaries,Ms. Kenny,Mr. Hurd
G1 Pathfinders,Ms. Wendy,Mr. Perry
G1 Seekers,Ms. Ariel,Mr. Van Rensburg
G1 Trailblazers,Ms. Michelle,Ms. Ngcongo
G1 Inventors,Ms. Kenny,Mr. Hurd
G2 Pioneers,Ms. Tiffany,Mr. Perry
G2 Explorers,Ms. Julia,Mr. Van Rensburg
G2 Inventors,Ms. Peko,Mr. Thompson
G2 Achievers,Ms. Kim,Ms. Xwayi
G2 Voyagers,Ms. Cheryl,Mr. Mueller
```

---

## 9. 班級命名規則

| 類型 | 格式 | 範例 |
|------|------|------|
| 英文班 | `G + 年級 + 空格 + 英文名稱` | G1 Visionaries, G2 Explorers |
| 導師班 | 純數字（年級 + 班號） | 101, 207, 305 |
| EV 班 | `G + 年級 + 字母` | G1I, G2B |

**年級對應**:
- G1 / 1xx = 一年級
- G2 / 2xx = 二年級
- G3 / 3xx = 三年級
- G4 / 4xx = 四年級
- G5 / 5xx = 五年級
- G6 / 6xx = 六年級

---

## 10. 關鍵業務規則

1. **教師唯一識別**: 教師名稱為唯一值（UNIQUE 約束）
2. **多班級教學**: 一個教師可同時教授多個班級（如 G1 Visionaries + G1 Inventors）
3. **課表結構**: 按 5 天 × 8 節次 組織
4. **時段無衝突**: 同一教師在同一時段通常只有一個課程
5. **Period 解析**: 格式為 `(數字)時間範圍`，需提取數字作為節次
6. **課程類型區分**: 透過資料來源區分 english / homeroom / ev_myreading

---

## 11. API 響應格式參考

```json
{
  "success": true,
  "teacher": {
    "id": 1,
    "teacher_name": "張家芸 Kenny"
  },
  "timetables": {
    "english_timetable": {
      "Monday": {
        "3": {
          "period": 3,
          "time": "10:20-11:00",
          "classroom": "E101",
          "class_name": "G1 Visionaries",
          "course_name": "English - G1 Visionaries",
          "class_type": "english"
        },
        "4": { ... },
        "5": { ... },
        "6": { ... }
      },
      "Tuesday": { ... },
      "Wednesday": { ... },
      "Thursday": { ... },
      "Friday": { ... }
    },
    "homeroom_timetable": { ... },
    "ev_myreading_timetable": { ... }
  },
  "statistics": {
    "total_classes": 24,
    "days_with_classes": 5,
    "english_classes": 20,
    "homeroom_classes": 4,
    "ev_myreading_classes": 0,
    "unique_classes": 2
  }
}
```

---

## 12. 週課表顯示格式

以「張家芸 Kenny」為例的完整週課表：

| 節次 | 時間 | 週一 | 週二 | 週三 | 週四 | 週五 |
|------|------|------|------|------|------|------|
| 1 | 08:25-09:05 | - | - | - | - | - |
| 2 | 09:10-09:50 | - | - | - | - | - |
| 3 | 10:20-11:00 | G1 Visionaries | G1 Visionaries | G1 Inventors | G1 Inventors | G1 Visionaries |
| 4 | 11:05-11:45 | G1 Visionaries | G1 Visionaries | G1 Inventors | G1 Inventors | G1 Visionaries |
| 5 | 12:55-13:35 | G1 Inventors | G1 Inventors | G1 Visionaries | G1 Visionaries | G1 Inventors |
| 6 | 13:40-14:20 | G1 Inventors | G1 Inventors | G1 Visionaries | G1 Visionaries | G1 Inventors |
| 7 | 14:25-15:05 | - | - | - | - | - |
| 8 | 15:10-15:50 | - | - | - | - | - |

---

## 13. 實作建議

### 資料庫設計
```sql
-- 教師表
CREATE TABLE teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_name TEXT UNIQUE NOT NULL
);

-- 英文班課表
CREATE TABLE english_timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    classroom TEXT,
    teacher TEXT NOT NULL,
    period TEXT NOT NULL,
    class_name TEXT NOT NULL
);

-- 導師班課表
CREATE TABLE homeroom_timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    home_room_class_name TEXT NOT NULL,
    day TEXT NOT NULL,
    period TEXT NOT NULL,
    classroom TEXT,
    teacher TEXT NOT NULL,
    course_name TEXT
);
```

### Period 解析邏輯
```python
import re

def parse_period(period_str):
    """
    解析 Period 格式，如 "(3)10:20-11:00"
    返回: (節次數字, 時間範圍)
    """
    match = re.search(r'\((\d+)\)([\d:]+[-][\d:]+)', period_str)
    if match:
        return int(match.group(1)), match.group(2)
    return None, None

# 範例
period_num, time_range = parse_period("(3)10:20-11:00")
# period_num = 3
# time_range = "10:20-11:00"
```

---

*此 Skill 提供完整的教師課表業務邏輯，可直接用於導入其他以教師為使用者的系統。*
