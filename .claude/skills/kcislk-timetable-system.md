# KCISLK 課表系統完整業務邏輯 Skill

> **用途**: 將康橋國際學校課表邏輯導入其他系統，支援班級、學生、教師三種課表查詢
> **版本**: 1.0.0
> **最後更新**: 2025-12-22

---

## 1. 系統概覽

**康橋國際學校林口校區小學部課表系統**

| 項目 | 數量 |
|------|------|
| 教師 | 73 位 |
| 班級 | 42 個英文班 + 42 個導師班 |
| 學生 | 1,036+ 位 |
| 每日課時 | 8 節 |
| 上課日 | 週一至週五 |

---

## 2. 三種課表類型

### 2.1 課表類型定義

| 類型 | 說明 | 班級格式 | 範例 |
|------|------|----------|------|
| **English** | 英文班課程 | G + 年級 + 空格 + 英文名稱 | G1 Visionaries, G2 Explorers |
| **Home Room** | 導師班課程（國語、數學、生活、社會等） | 純數字（年級 + 班號） | 101, 207, 305 |
| **EV & myReading** | 特殊課程 | G + 年級 + 字母 | G1I, G2B, G3A |

### 2.2 年級對應

| 年級 | 英文班格式 | 導師班格式 |
|------|------------|------------|
| 一年級 | G1 xxx | 101-107 |
| 二年級 | G2 xxx | 201-207 |
| 三年級 | G3 xxx | 301-307 |
| 四年級 | G4 xxx | 401-407 |
| 五年級 | G5 xxx | 501-507 |
| 六年級 | G6 xxx | 601-607 |

---

## 3. 時段定義 (Period 1-8)

| 節次 | 時間 | 說明 |
|------|------|------|
| Period 1 | 08:25 - 09:05 | 早上第一節 |
| Period 2 | 09:10 - 09:50 | 早上第二節 |
| Period 3 | 10:20 - 11:00 | 早上第三節（課間休息後） |
| Period 4 | 11:05 - 11:45 | 早上第四節 |
| Period 5 | 12:55 - 13:35 | 下午第一節（午休後） |
| Period 6 | 13:40 - 14:20 | 下午第二節 |
| Period 7 | 14:25 - 15:05 | 下午第三節 |
| Period 8 | 15:10 - 15:50 | 下午第四節 |

**Period 格式**: `(數字)時間範圍`，如 `(3)10:20-11:00`

---

## 4. 資料模型

### 4.1 學生 (Student)

```
Student:
  student_id: 學號 (如 LE14007，唯一識別)
  student_name: 中英文姓名 (如 "陳星甯Lollie Chen")
  english_class_name: 英文班級 (如 "G1 Achievers")
  homeroom_class_name: 導師班級 (如 "102")
  ev_myreading_class_name: EV班級 (如 "G1I")
```

### 4.2 教師 (Teacher)

```
Teacher:
  employee_id: 員工編號 (如 C11208015)
  email: 教師 Email (唯一識別)
  chinese_name: 中文姓名 (如 張家芸)
  english_name: 英文名 (如 Kenny)
  display_name: 顯示名稱 (如 Ms. Kenny)
  teacher_name: 課表顯示名稱 (如 "張家芸 Kenny") - 用於課表資料關聯
```

### 4.3 班級 (Class)

```
Class:
  english_name: 英文班名稱 (如 "G1 Visionaries")
  homeroom_name: 對應導師班 (如 "101")
  lead_teacher: 班導師 (如 "Ms. Kenny")
  international_teacher: 外籍教師 (如 "Mr. Hurd")
  grade: 年級 (1-6)
```

### 4.4 課表項目 (TimetableEntry)

```
TimetableEntry:
  day: 星期 (Monday / Tuesday / Wednesday / Thursday / Friday)
  period: 節次 (1-8)
  time: 時間範圍 (如 "10:20-11:00")
  classroom: 教室代碼 (如 "E101", "一年一班")
  class_name: 班級名稱 (如 "G1 Visionaries", "101")
  course_name: 課程名稱 (如 "English", "國語", "數學")
  teacher: 教師名稱 (如 "張家芸 Kenny")
  class_type: 課程類型 ("english" / "homeroom" / "ev_myreading")
```

---

## 5. 班級課表查詢邏輯

### 5.1 英文班課表查詢

```
輸入: english_class_name (如 "G1 Visionaries")

步驟 1: 查詢英文班課表
  SELECT * FROM EnglishTimetable WHERE class_name = {english_class_name}

步驟 2: 取得班級導師資訊
  SELECT * FROM ClassTeachers WHERE english_name = {english_class_name}

步驟 3: 組織為週課表格式
  - 按星期 (day) 和節次 (period) 組織
  - 標記課程類型為 "english"

輸出: 該英文班完整週課表 + 導師資訊
```

### 5.2 導師班課表查詢

```
輸入: homeroom_class_name (如 "101")

步驟 1: 查詢導師班課表
  SELECT * FROM HomeRoomTimetable WHERE home_room_class_name = {homeroom_class_name}

步驟 2: 組織為週課表格式
  - 按星期 (day) 和節次 (period) 組織
  - 標記課程類型為 "homeroom"

輸出: 該導師班完整週課表
```

### 5.3 範例：查詢 G1 Visionaries 班級課表

```
1. 查詢 EnglishTimetable WHERE class_name = "G1 Visionaries"
   結果:
   - Monday, Period 3, E101, 張家芸 Kenny
   - Monday, Period 4, E101, 張家芸 Kenny
   - Tuesday, Period 3, E101, 張家芸 Kenny
   - ...

2. 查詢 ClassTeachers WHERE english_name = "G1 Visionaries"
   結果:
   - lead_teacher: Ms. Kenny
   - international_teacher: Mr. Hurd

3. 組織為週課表:
   {
     "class_info": {
       "name": "G1 Visionaries",
       "lead_teacher": "Ms. Kenny",
       "international_teacher": "Mr. Hurd"
     },
     "timetable": {
       "Monday": {
         "3": { period: 3, time: "10:20-11:00", teacher: "張家芸 Kenny", classroom: "E101" },
         "4": { period: 4, time: "11:05-11:45", teacher: "張家芸 Kenny", classroom: "E101" }
       },
       "Tuesday": { ... }
     }
   }
```

---

## 6. 學生課表查詢邏輯

### 6.1 查詢流程

```
輸入: student_id (學號，如 "LE14007")

步驟 1: 查詢學生基本資料
  SELECT * FROM Students WHERE student_id = {student_id}
  → 取得 english_class_name, homeroom_class_name, ev_myreading_class_name

步驟 2: 查詢英文班課表
  SELECT * FROM EnglishTimetable WHERE class_name = {english_class_name}

步驟 3: 查詢導師班課表
  SELECT * FROM HomeRoomTimetable WHERE home_room_class_name = {homeroom_class_name}

步驟 4: 查詢 EV & myReading 課表（如有）
  SELECT * FROM EnglishTimetable WHERE class_name = {ev_myreading_class_name}

步驟 5: 合併三種課表
  - 以時段為基準合併
  - 同一時段可能只有一種課程
  - 標記各課程的 class_type

輸出: 學生完整個人週課表（整合三種課表）
```

### 6.2 範例：查詢學號 LE14007 的課表

```
1. 查詢學生資料:
   SELECT * FROM Students WHERE student_id = "LE14007"
   結果:
   - student_name: "陳星甯Lollie Chen"
   - english_class_name: "G1 Achievers"
   - homeroom_class_name: "102"
   - ev_myreading_class_name: "G1I"

2. 查詢三種課表並合併:
   - English: G1 Achievers 的課表
   - Home Room: 102 班的課表
   - EV & myReading: G1I 的課表

3. 輸出格式:
   {
     "student": {
       "student_id": "LE14007",
       "student_name": "陳星甯Lollie Chen",
       "english_class": "G1 Achievers",
       "homeroom_class": "102",
       "ev_class": "G1I"
     },
     "timetable": {
       "Monday": {
         "1": { class_type: "homeroom", course_name: "生活", ... },
         "2": { class_type: "homeroom", course_name: "國語", ... },
         "3": { class_type: "english", class_name: "G1 Achievers", ... },
         ...
       }
     }
   }
```

### 6.3 學生搜尋支援

支援以下搜尋方式：
- **學號**: 精確匹配 student_id
- **中文姓名**: 模糊匹配 student_name 中的中文部分
- **英文姓名**: 模糊匹配 student_name 中的英文部分
- **班級名稱**: 匹配 english_class_name 或 homeroom_class_name

---

## 7. 教師課表查詢邏輯

### 7.1 查詢流程（以 email 識別）

```
輸入: email (教師 Email)

步驟 1: 從教師表取得 teacher_name
  SELECT teacher_name FROM Teachers WHERE email = {email}
  → 例: kennyjhang@kcislk.ntpc.edu.tw → "張家芸 Kenny"

步驟 2: 查詢英文班課程
  SELECT * FROM EnglishTimetable WHERE teacher = {teacher_name}

步驟 3: 合併結果
  - 按星期 (day) 和節次 (period) 組織
  - 標記課程類型

步驟 4: 計算統計數據
  - total_classes: 總課時數
  - unique_classes: 不重複班級數
  - days_with_classes: 有課的天數
```

### 7.2 範例：查詢 kennyjhang@kcislk.ntpc.edu.tw 的課表

```
1. 取得 teacher_name:
   SELECT * FROM Teachers WHERE email = "kennyjhang@kcislk.ntpc.edu.tw"
   → teacher_name = "張家芸 Kenny"

2. 查詢課表:
   SELECT * FROM EnglishTimetable WHERE teacher = "張家芸 Kenny"

3. 組織為週課表:
   {
     "teacher": {
       "email": "kennyjhang@kcislk.ntpc.edu.tw",
       "chinese_name": "張家芸",
       "english_name": "Kenny",
       "display_name": "Ms. Kenny"
     },
     "timetable": {
       "Monday": {
         "3": { class_name: "G1 Visionaries", classroom: "E101" },
         "4": { class_name: "G1 Visionaries", classroom: "E101" },
         "5": { class_name: "G1 Inventors", classroom: "E101" },
         "6": { class_name: "G1 Inventors", classroom: "E101" }
       },
       ...
     },
     "statistics": {
       "total_classes": 24,
       "unique_classes": 2,
       "days_with_classes": 5
     }
   }
```

---

## 8. CSV 資料格式與範例

### 8.1 students.csv（學生資料）

**欄位定義**:
| 欄位 | 說明 | 範例 |
|------|------|------|
| Student ID | 學號（唯一識別） | LE14007 |
| Student Name | 中英文姓名 | 陳星甯Lollie Chen |
| English Class Name | 英文班級 | G1 Achievers |
| Home Room Class Name | 導師班級 | 102 |
| EV & myReading Class Name | EV班級 | G1I |

**資料範例** (1,036+ 筆):
```csv
Student ID,Student Name,English Class Name,Home Room Class Name,EV & myReading Class Name
LE14007,陳星甯Lollie Chen,G1 Achievers,102,G1I
LE14008,王允睿RAYMOND,G1 Achievers,103,G1J
LE14142,高偉捷Jason Kao,G1 Achievers,106,G1B
LE14149,高楷博Harry,G1 Achievers,102,G1H
LE14154,胡嘉涵Hannah,G1 Achievers,107,G1C
LE14159,許禾樂Lele,G1 Achievers,101,G1H
LE14162,游晴安Gianna,G1 Achievers,103,G1I
LE14169,蔡尚宸Chen,G1 Achievers,106,G1B
LE14174,兒玉澪Mio,G1 Achievers,107,G1C
LE14176,李宜穎Sophia,G1 Achievers,102,G1I
LE14017,林軒宇Steven Lin,G1 Adventurers,104,G1C
LE14018,周于涵Esme Chou,G1 Adventurers,103,G1L
LE14024,陳品潼Aimee Chen,G1 Adventurers,107,G1E
LE14025,王璽Roy Wang,G1 Adventurers,106,G1E
LE14038,林恩睿Vincent Lin,G1 Adventurers,104,G1D
```

### 8.2 english_timetable.csv（英文班課表）

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
Monday,E306,石珈嘉 Kassie,(3)10:20-11:00,G1 Navigators
Monday,E306,石珈嘉 Kassie,(4)11:05-11:45,G1 Navigators
Monday,E103,林威德 Alvin,(5)12:55-13:35,G2B
Monday,E103,林威德 Alvin,(6)13:40-14:20,G2B
Monday,E103,林威德 Alvin,(7)14:40-15:20,G2 Innovators
Monday,E103,林威德 Alvin,(8)15:25-16:05,G2 Innovators
```

### 8.3 homeroom_timetable.csv（導師班課表）

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
Monday,201,(1)08:25-09:05,二年一班,莊佳珍,國語
Monday,202,(1)08:25-09:05,二年二班,鄭乙璇,生活
Monday,301,(1)08:25-09:05,三年一班,周兆翃,國語
Monday,401,(1)08:25-09:05,四年一班,李雅琦,社會
Monday,501,(1)08:25-09:05,五年一班,李沛珊,國語
Monday,601,(1)08:25-09:05,六年一班,陳俞廷,數學
Monday,101,(2)09:10-09:50,一年一班,温小嫺,國語
Monday,102,(2)09:10-09:50,一年二班,常嘉文,國語
Monday,201,(2)09:10-09:50,二年一班,莊佳珍,生活
```

### 8.4 class_teachers.csv（班級導師映射）

**欄位定義**:
| 欄位 | 說明 | 範例 |
|------|------|------|
| EnglishName | 英文班級名稱 | G1 Achievers |
| system_display_lt | 班級導師 | Ms. Wendy |
| system_display_it | 外籍教師 | Mr. Perry |

**完整資料** (84 筆):
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
G2 Adventurers,Ms. Tiffany,Mrs. Rader
G2 Innovators,Mr. Alvin,Mr. Hurd
G2 Guardians,Ms. Evelyn,Ms. Ngcongo
G2 Pathfinders,Ms. Evelyn,Ms. Ngcongo
G2 Visionaries,Mr. Alvin,Mr. Hurd
G2 Navigators,Ms. Julia,Mrs. Rader
G2 Discoverers,Ms. Cheryl,Mr. Mueller
G2 Seekers,Ms. Kim,Ms. Xwayi
G2 Trailblazers,Ms. Smantha,Mr. Thompson
G3 Inventors,Ms. Phoebe Chen,Ms. Mtika
G3 Innovators,Ms. Jenny K.,Mr. Ajayi
G3 Guardians,Ms. Angel,Mr. Doan
G3 Achievers,Mr. Victor L.,Mr. Doan
G3 Voyagers,Ms. Jojo,Mr. Franklin
G3 Visionaries,Ms. Jojo,Mr. Franklin
G3 Trailblazers,Ms. Scarlett,Ms. Lee-Hussien
G3 Discoverers,Ms. Scarlett,Ms. Lee-Hussien
G3 Explorers,Ms. Rebecca,Mr. Mathias
G3 Navigators,Ms. Rebecca,Mr. Mathias
G3 Adventurers,Mr. Lynn,Mr. Ajayi
G3 Seekers,Ms. Phoebe Chen,Ms. Mtika
G3 Pathfinders,Ms. Kate,Mrs. Keys
G3 Pioneers,Ms. Kate,Ms. Abasalie
G4 Seekers,Ms. Jenny K.,Mr. Doan
G4 Voyagers,Ms. Kate,Ms. Lee-Hussien
G4 Visionaries,Ms. Kate,Ms. Lee-Hussien
G4 Achievers,Ms. Scarlett,Ms. Cieslikowska
G4 Navigators,Ms. Jojo,Ms. Mtika
G4 Trailblazers,Ms. Jojo,Ms. Mtika
G4 Pathfinders,Ms. Angel,Mr. Franklin
G4 Explorers,Ms. Angel,Mr. Franklin
G4 Adventurers,Ms. Phoebe Chen,Ms. Abasalie
G4 Innovators,Ms. Phoebe Chen,Ms. Abasalie
G4 Discoverers,Ms. Jenny K.,Mr. Doan
G4 Guardians,Ms. Scarlett,Mr. Mathias
G4 Inventors,Ms. Rebecca,Mr. Ajayi
G4 Pioneers,Ms. Rebecca,Mr. Ajayi
G5 Adventurers,Ms. Elena,Mr. Rapelo
G5 Navigators,Mr. Ben,Mr. Venter
G5 Pioneers,Mr. Charles,Mr. Zabinski
G5 Inventors,Ms. Phoebe Chiang,Ms. Aranza
G5 Seekers,Ms. Phoebe Chiang,Ms. Aranza
G5 Discoverers,Mr. Charles,Mr. Zabinski
G5 Guardians,Ms. Elena,Mr. Rapelo
G5 Pathfinders,Ms. Meg,Mrs. Uys
G5 Explorers,Mr. Ben,Mr. Venter
G5 Achievers,Mr. Tim,Mr. Bedillion
G5 Voyagers,Ms. Josselyn,Mr. Porter
G5 Trailblazers,Ms. Meg,Mrs. Uys
G5 Innovators,Mr. Tim,Ms. Su
G5 Visionaries,Ms. Joanne,Mr. Porter
G6 Explorers,Mr. Tim,Mr. Porter
G6 Inventors,Mr. Charles,Ms. Su
G6 Adventurers,Ms. Meg,Ms. Aranza
G6 Achievers,Ms. Josselyn,Mr. Venter
G6 Voyagers,Mr. Ben,Mrs. Uys
G6 Discoverers,Mr. Tim,Mr. Porter
G6 Innovators,Ms. Meg,Ms. Aranza
G6 Guardians,Ms. Josselyn,Mr. Venter
G6 Pathfinders,Ms. Phoebe Chiang,Mr. Bedillion
G6 Seekers,Mr. Charles,Ms. Su
G6 Visionaries,Mr. Ben,Mrs. Uys
G6 Pioneers,Ms. Phoebe Chiang,Mr. Rapelo
G6 Trailblazers,Ms. Elena,Mr. Zabinski
G6 Navigators,Ms. Elena,Mr. Zabinski
```

### 8.5 teachers.csv（教師資料）

**欄位定義**:
| 欄位 | 說明 | 範例 |
|------|------|------|
| employee_id | 員工編號 | C11208015 |
| chinese_name | 中文姓名 | 張家芸 |
| english_name | 英文名 | Kenny |
| title | 稱謂 | Ms. / Mr. / Mrs. |
| display_name | 顯示名稱 | Ms. Kenny |
| email | Email（唯一識別）| kennyjhang@kcislk.ntpc.edu.tw |
| teacher_name | 課表顯示名稱 | 張家芸 Kenny |

**資料範例** (73 筆):
```csv
employee_id,chinese_name,english_name,title,display_name,email,teacher_name
C11208015,張家芸,Kenny,Ms.,Ms. Kenny,kennyjhang@kcislk.ntpc.edu.tw,張家芸 Kenny
C10707009,林慧君,Liza,Ms.,Ms. Liza,lizalin@kcislk.ntpc.edu.tw,林慧君 Liza
C10811012,石珈嘉,Kassie,Ms.,Ms. Kassie,kassieshih@kcislk.ntpc.edu.tw,石珈嘉 Kassie
C11003002,顏思甄,Wendy,Ms.,Ms. Wendy,wendyyen@kcislk.ntpc.edu.tw,顏思甄 Wendy
C11008076,朱韻伃,Ariel,Ms.,Ms. Ariel,arielzhu@kcislk.ntpc.edu.tw,朱韻伃 Ariel
C10708032,Jonathan,Perry,Mr.,Mr. Perry,jonathanperry@kcislk.ntpc.edu.tw,Jonathan Perry
C10707050,Sam,Thompson,Mr.,Mr. Thompson,samthompson@kcislk.ntpc.edu.tw,Sam Thompson
C11008060,Jeffrey,Hurd,Mr.,Mr. Hurd,jeffreyhurd@kcislk.ntpc.edu.tw,Jeffrey Hurd
C11108115,Jesse,Mueller,Mr.,Mr. Mueller,jessemueller@kcislk.ntpc.edu.tw,Jesse Mueller
C11308061,Carlo,Van Rensburg,Mr.,Mr. Van Rensburg,carlorensburg@kcislk.ntpc.edu.tw,Carlo Van Rensburg
```

### 8.6 teacher_timetable_english.csv（教師英文班課表 - 整合版）

**欄位定義**:
| 欄位 | 說明 | 範例 |
|------|------|------|
| email | 教師 Email | kennyjhang@kcislk.ntpc.edu.tw |
| teacher_name | 教師名稱 | 張家芸 Kenny |
| day | 星期 | Monday |
| period | 節次 | 3 |
| time | 時間 | 10:20-11:00 |
| classroom | 教室 | E101 |
| class_name | 班級 | G1 Visionaries |
| course_name | 課程 | English - G1 Visionaries |

**資料範例** (1,289 筆):
```csv
email,teacher_name,day,period,time,classroom,class_name,course_name
kennyjhang@kcislk.ntpc.edu.tw,張家芸 Kenny,Monday,3,10:20-11:00,E101,G1 Visionaries,English - G1 Visionaries
kennyjhang@kcislk.ntpc.edu.tw,張家芸 Kenny,Monday,4,11:05-11:45,E101,G1 Visionaries,English - G1 Visionaries
kennyjhang@kcislk.ntpc.edu.tw,張家芸 Kenny,Monday,5,12:55-13:35,E101,G1 Inventors,English - G1 Inventors
kennyjhang@kcislk.ntpc.edu.tw,張家芸 Kenny,Monday,6,13:40-14:20,E101,G1 Inventors,English - G1 Inventors
lizalin@kcislk.ntpc.edu.tw,林慧君 Liza,Monday,3,10:20-11:00,E203,G1 Discoverers,English - G1 Discoverers
lizalin@kcislk.ntpc.edu.tw,林慧君 Liza,Monday,4,11:05-11:45,E203,G1 Discoverers,English - G1 Discoverers
```

---

## 9. 關鍵業務規則

### 9.1 識別規則

| 實體 | 唯一識別欄位 | 說明 |
|------|--------------|------|
| 學生 | student_id | 學號，如 LE14007 |
| 教師 | email | 教師 Email |
| 英文班 | english_class_name | 如 G1 Visionaries |
| 導師班 | homeroom_class_name | 如 101 |

### 9.2 關聯規則

1. **學生 → 班級**: 一個學生同時屬於一個英文班、一個導師班、一個 EV 班
2. **教師 → 課表**: 使用 `teacher_name` 欄位與課表資料關聯
3. **班級 → 導師**: 透過 `class_teachers.csv` 映射英文班與導師

### 9.3 課表規則

1. **時段無衝突**: 同一學生/教師在同一時段只有一個課程
2. **Period 解析**: 格式為 `(數字)時間範圍`，需提取數字作為節次
3. **課表結構**: 按 5 天 × 8 節次組織
4. **學生課表整合**: 需合併英文班、導師班、EV班三種課表

---

## 10. API 響應格式參考

### 10.1 班級課表響應

```json
{
  "success": true,
  "class": {
    "name": "G1 Visionaries",
    "type": "english",
    "lead_teacher": "Ms. Kenny",
    "international_teacher": "Mr. Hurd"
  },
  "timetable": {
    "Monday": {
      "3": { "period": 3, "time": "10:20-11:00", "teacher": "張家芸 Kenny", "classroom": "E101" },
      "4": { "period": 4, "time": "11:05-11:45", "teacher": "張家芸 Kenny", "classroom": "E101" }
    },
    "Tuesday": { ... }
  },
  "statistics": {
    "total_periods": 24,
    "days_with_class": 5
  }
}
```

### 10.2 學生課表響應

```json
{
  "success": true,
  "student": {
    "student_id": "LE14007",
    "student_name": "陳星甯Lollie Chen",
    "english_class": "G1 Achievers",
    "homeroom_class": "102",
    "ev_class": "G1I"
  },
  "timetable": {
    "Monday": {
      "1": { "class_type": "homeroom", "course_name": "生活", "teacher": "常嘉文", "classroom": "一年二班" },
      "2": { "class_type": "homeroom", "course_name": "國語", "teacher": "常嘉文", "classroom": "一年二班" },
      "3": { "class_type": "english", "class_name": "G1 Achievers", "teacher": "顏思甄 Wendy", "classroom": "E309" },
      "4": { "class_type": "english", "class_name": "G1 Achievers", "teacher": "顏思甄 Wendy", "classroom": "E309" }
    },
    "Tuesday": { ... }
  },
  "statistics": {
    "english_periods": 20,
    "homeroom_periods": 12,
    "ev_periods": 8
  }
}
```

### 10.3 教師課表響應

```json
{
  "success": true,
  "teacher": {
    "email": "kennyjhang@kcislk.ntpc.edu.tw",
    "chinese_name": "張家芸",
    "english_name": "Kenny",
    "display_name": "Ms. Kenny"
  },
  "timetable": {
    "Monday": {
      "3": { "class_name": "G1 Visionaries", "classroom": "E101" },
      "4": { "class_name": "G1 Visionaries", "classroom": "E101" },
      "5": { "class_name": "G1 Inventors", "classroom": "E101" },
      "6": { "class_name": "G1 Inventors", "classroom": "E101" }
    },
    "Tuesday": { ... }
  },
  "statistics": {
    "total_classes": 24,
    "unique_classes": 2,
    "days_with_classes": 5
  }
}
```

---

## 11. 實作建議

### 11.1 資料庫設計

```sql
-- 學生表
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    student_name TEXT NOT NULL,
    english_class_name TEXT,
    homeroom_class_name TEXT,
    ev_myreading_class_name TEXT
);

-- 教師表
CREATE TABLE teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    chinese_name TEXT,
    english_name TEXT,
    title TEXT,
    display_name TEXT,
    teacher_name TEXT NOT NULL
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

-- 班級導師映射
CREATE TABLE class_teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    english_name TEXT UNIQUE NOT NULL,
    lead_teacher TEXT,
    international_teacher TEXT
);
```

### 11.2 Period 解析邏輯

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

### 11.3 學生課表整合邏輯

```python
def get_student_timetable(student_id):
    """
    取得學生完整課表（整合三種課表）
    """
    # 1. 取得學生資料
    student = get_student_by_id(student_id)

    # 2. 取得各類課表
    english_tt = get_english_timetable(student.english_class_name)
    homeroom_tt = get_homeroom_timetable(student.homeroom_class_name)
    ev_tt = get_english_timetable(student.ev_myreading_class_name)  # EV 也在英文課表中

    # 3. 整合課表
    combined = {}
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

    for day in days:
        combined[day] = {}
        for period in range(1, 9):
            # 優先級: homeroom > english > ev
            entry = None
            if day in homeroom_tt and str(period) in homeroom_tt[day]:
                entry = homeroom_tt[day][str(period)]
                entry['class_type'] = 'homeroom'
            elif day in english_tt and str(period) in english_tt[day]:
                entry = english_tt[day][str(period)]
                entry['class_type'] = 'english'
            elif day in ev_tt and str(period) in ev_tt[day]:
                entry = ev_tt[day][str(period)]
                entry['class_type'] = 'ev_myreading'

            if entry:
                combined[day][str(period)] = entry

    return combined
```

---

## 12. 週課表顯示格式範例

### 12.1 班級週課表 (G1 Visionaries)

| 節次 | 時間 | 週一 | 週二 | 週三 | 週四 | 週五 |
|------|------|------|------|------|------|------|
| 1 | 08:25-09:05 | - | - | - | - | - |
| 2 | 09:10-09:50 | - | - | - | - | - |
| 3 | 10:20-11:00 | English | English | English | English | English |
| 4 | 11:05-11:45 | English | English | English | English | English |
| 5 | 12:55-13:35 | - | - | - | - | - |
| 6 | 13:40-14:20 | - | - | - | - | - |
| 7 | 14:25-15:05 | - | - | - | - | - |
| 8 | 15:10-15:50 | - | - | - | - | - |

### 12.2 學生週課表 (LE14007 陳星甯)

| 節次 | 時間 | 週一 | 週二 | 週三 | 週四 | 週五 |
|------|------|------|------|------|------|------|
| 1 | 08:25-09:05 | 生活 (HR) | 國語 (HR) | 數學 (HR) | 國語 (HR) | 生活 (HR) |
| 2 | 09:10-09:50 | 國語 (HR) | 數學 (HR) | 國語 (HR) | 數學 (HR) | 國語 (HR) |
| 3 | 10:20-11:00 | English | English | English | English | English |
| 4 | 11:05-11:45 | English | English | English | English | English |
| 5 | 12:55-13:35 | EV | 生活 (HR) | 數學 (HR) | EV | 社會 (HR) |
| 6 | 13:40-14:20 | EV | 社會 (HR) | 彈性 (HR) | EV | 自然 (HR) |
| 7 | 14:25-15:05 | - | - | - | - | - |
| 8 | 15:10-15:50 | - | - | - | - | - |

### 12.3 教師週課表 (張家芸 Kenny)

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

*此 Skill 提供完整的課表系統業務邏輯，支援班級、學生、教師三種課表查詢，可直接用於導入其他系統。*
