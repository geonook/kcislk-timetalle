# KCISLK 教師課表業務邏輯 Skill

> **用途**: 將康橋國際學校課表邏輯導入其他以教師為使用者的系統
> **版本**: 1.1.0
> **最後更新**: 2025-12-22

---

## 1. 系統概覽

**康橋國際學校林口校區小學部課表系統**

| 項目 | 數量 |
|------|------|
| 教師 | 73 位 |
| 班級 | 42 個（1-6年級各7班） |
| 學生 | 1,036+ 位 |
| 每日課時 | 8 節 |
| 上課日 | 週一至週五 |

---

## 2. 教師資料模型

```
Teacher:
  id: 教師ID (自動遞增主鍵)
  employee_id: 員工編號 (如 C11208015)
  email: 教師 Email (唯一識別，UNIQUE 約束)
  chinese_name: 中文姓名 (如 張家芸)
  english_name: 英文名 (如 Kenny)
  display_name: 顯示名稱 (如 Ms. Kenny)
  teacher_name: 課表顯示名稱 (如 張家芸 Kenny) - 用於課表資料關聯
```

### 教師識別方式

**主要識別**: `email` (唯一值，用於系統登入與識別)

**課表關聯**: `teacher_name` (用於與課表資料關聯)

### 教師名稱格式

| 格式類型 | 範例 | 說明 |
|----------|------|------|
| 中英混合 | `張家芸 Kenny`、`林慧君 Liza` | 本地教師 |
| 純英文 | `Jonathan Perry`、`Sam Thompson` | 外籍教師 |
| 顯示名稱 | `Ms. Kenny`、`Mr. Perry` | 班級導師映射使用 |

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

### 查詢流程（以 email 識別）

```
輸入: email (教師 Email)

步驟 1: 從教師表取得 teacher_name
  SELECT teacher_name FROM Teachers WHERE email = {email}
  → 例: kennyjhang@kcislk.ntpc.edu.tw → "張家芸 Kenny"

步驟 2: 查詢英文班課程
  SELECT * FROM EnglishTimetable WHERE teacher = {teacher_name}

步驟 3: 查詢導師班課程
  SELECT * FROM HomeRoomTimetable WHERE teacher = {teacher_name}

步驟 4: 合併結果
  - 將兩個查詢結果合併
  - 按星期 (day) 和節次 (period) 組織
  - 標記課程類型 (class_type)

步驟 5: 計算統計數據
  - total_classes: 總課時數
  - unique_classes: 不重複班級數
  - days_with_classes: 有課的天數
```

### 範例：查詢 kennyjhang@kcislk.ntpc.edu.tw 的課表

```
1. 從教師表取得對應的 teacher_name
   SELECT * FROM Teachers WHERE email = "kennyjhang@kcislk.ntpc.edu.tw"
   → teacher_name = "張家芸 Kenny"

2. 查詢 EnglishTimetable WHERE teacher = "張家芸 Kenny"
   結果:
   - Monday, Period 3, G1 Visionaries, E101
   - Monday, Period 4, G1 Visionaries, E101
   - Monday, Period 5, G1 Inventors, E101
   - Monday, Period 6, G1 Inventors, E101
   - Tuesday, Period 3, G1 Visionaries, E101
   - ...

3. 查詢 HomeRoomTimetable WHERE teacher = "張家芸 Kenny"
   結果: (空，此教師無導師班課程)

4. 組織為週課表格式:
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

### 8.4 teachers.csv（教師資料）

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

**完整教師資料** (73 筆):
```csv
employee_id,chinese_name,english_name,title,display_name,email,teacher_name
C10908007,杜如潔,Vickie,Ms.,Ms. Vickie,vickielicari@kcislk.ntpc.edu.tw,杜如潔 Vickie
C10707015,李曜宇,Victor,Mr.,Mr. Victor,victorli@kcislk.ntpc.edu.tw,李曜宇 Victor
C10708010,林彥宇,Lynn,Mr.,Mr. Lynn,yenyulin@kcislk.ntpc.edu.tw,林彥宇 Lynn
C11308045,陳宥蓉,Joanne,Ms.,Ms. Joanne,joannechen@kcislk.ntpc.edu.tw,陳宥蓉 Joanne
C11304001,李文歆,Peko,Ms.,Ms. Peko,pekolee@kcislk.ntpc.edu.tw,李文歆 Peko
C11408055,李若華,Samathan,Ms.,Ms. Samathan,samanthalee@kcislk.ntpc.edu.tw,李若華 Samathan
C10811012,石珈嘉,Kassie,Ms.,Ms. Kassie,kassieshih@kcislk.ntpc.edu.tw,石珈嘉 Kassie
C10707009,林慧君,Liza,Ms.,Ms. Liza,lizalin@kcislk.ntpc.edu.tw,林慧君 Liza
C10707117,高頌雯,Michelle,Ms.,Ms. Michelle,michellekao@kcislk.ntpc.edu.tw,高頌雯 Michelle
C11003002,顏思甄,Wendy,Ms.,Ms. Wendy,wendyyen@kcislk.ntpc.edu.tw,顏思甄 Wendy
C11008076,朱韻伃,Ariel,Ms.,Ms. Ariel,arielzhu@kcislk.ntpc.edu.tw,朱韻伃 Ariel
C11108101,簡安安,Ann,Ms.,Ms. Ann,annchien@kcislk.ntpc.edu.tw,簡安安 Ann
C11208015,張家芸,Kenny,Ms.,Ms. Kenny,kennyjhang@kcislk.ntpc.edu.tw,張家芸 Kenny
C10707004,沈家琪,Kim,Ms.,Ms. Kim,kimshen@kcislk.ntpc.edu.tw,沈家琪 Kim
C10707011,何真瑾,Evelyn,Ms.,Ms. Evelyn,evelynho@kcislk.ntpc.edu.tw,何真瑾 Evelyn
C10808127,陳惠文,Julia,Ms.,Ms. Julia,juliachen@kcislk.ntpc.edu.tw,陳惠文 Julia
C10808131,洪禎伶,Cheryl,Ms.,Ms. Cheryl,cherylhung@kcislk.ntpc.edu.tw,洪禎伶 Cheryl
C11108060,林威德,Alvin,Mr.,Mr. Alvin,alvinlin@kcislk.ntpc.edu.tw,林威德 Alvin
C11208018,鄭婷芸,Tiffany,Ms.,Ms. Tiffany,tiffanycheng@kcislk.ntpc.edu.tw,鄭婷芸 Tiffany
C1020810,彭歆芸,Angel,Ms.,Ms. Angel,angelpeng@kcislk.ntpc.edu.tw,彭歆芸 Angel
C1030829,葉慎岑,Jojo,Ms.,Ms. Jojo,jojoyeh@kcislk.ntpc.edu.tw,葉慎岑 Jojo
C10707089,彭可鵑,Kate,Ms.,Ms. Kate,katepeng@kcislk.ntpc.edu.tw,彭可鵑 Kate
C10707090,葛恆婉,Jenny,Ms.,Ms. Jenny,jennyko@kcislk.ntpc.edu.tw,葛恆婉 Jenny
C10707093,黃俐璇,Scarlett,Ms.,Ms. Scarlett,scarletthuang@kcislk.ntpc.edu.tw,黃俐璇 Scarlett
C11202031,陳詩薇,Phoebe,Ms.,Ms. Phoebe,phoebechen@kcislk.ntpc.edu.tw,陳詩薇 Phoebe
C11308078,謝明儒,Rebecca,Ms.,Ms. Rebecca,rebeccahsieh@kcislk.ntpc.edu.tw,謝明儒 Rebecca
C10808110,傅于菁,Josselyn,Ms.,Ms. Josselyn,josselynfu@kcislk.ntpc.edu.tw,傅于菁 Josselyn
C10707091,蔣令珮,Phoebe,Ms.,Ms. Phoebe,phoebechiang@kcislk.ntpc.edu.tw,蔣令珮 Phoebe
C10808111,姜孟妤,Meg,Ms.,Ms. Meg,megchiang@kcislk.ntpc.edu.tw,姜孟妤 Meg
C11112017,王紀剛,Ben,Mr.,Mr. Ben,benwang@kcislk.ntpc.edu.tw,王紀剛 Ben
C11208017,束昀庭,Tim,Mr.,Mr. Tim,timshu@kcislk.ntpc.edu.tw,束昀庭 Tim
C11208153,劉必喬,Charles,Mr.,Mr. Charles,charlesliu@kcislk.ntpc.edu.tw,劉必喬 Charles
C11408116,許亦欣,Elena,Ms.,Ms. Elena,elenahsu@kcislk.ntpc.edu.tw,許亦欣 Elena
C10706008,劉奕伶,Angela,Ms.,Ms. Angela,angelaliou@kcislk.ntpc.edu.tw,劉奕伶 Angela
C10908076,潘思涵,Nydia,Ms.,Ms. Nydia,nydiapan@kcislk.ntpc.edu.tw,潘思涵 Nydia
C11204012,陳則宏,Jason,Mr.,Mr. Jason,tsehungchen@kcislk.ntpc.edu.tw,陳則宏 Jason
C11308081,洪瑀羚,Ling,Ms.,Ms. Ling,linghong@kcislk.ntpc.edu.tw,洪瑀羚 Ling
C11309010,顧欣倫,Sharan,Ms.,Ms. Sharan,sharanku@kcislk.ntpc.edu.tw,顧欣倫 Sharan
C11308141,黃勤媛,,,,chinhuang@kcislk.ntpc.edu.tw,黃勤媛
C11008084,Matthew,Taylor,Mr.,Mr. Taylor,matthewtaylor@kcislk.ntpc.edu.tw,Matthew Taylor
C11208105,Harold,Keys,Mr.,Mr. Keys,haroldkeys@kcislk.ntpc.edu.tw,Harold Keys
C11311009,John Adams,Villamoran,Mr.,Mr. Villamoran,adamsvillamoran@kcislk.ntpc.edu.tw,John Adams Villamoran
C11208109,Natacha,Keys,Mrs.,Mrs. Keys,natachakeys@kcislk.ntpc.edu.tw,Natacha Keys
C11408108,Bryce,Bedillion,Mr.,Mr. Bedillion,brycebedillion@kcislk.ntpc.edu.tw,Bryce Bedillion
C11408109,Aleksandra,Cieslikowska,Ms.,Ms. Cieslikowska,aleksandrac@kcislk.ntpc.edu.tw,Aleksandra Cieslikowska
C10708032,Jonathan,Perry,Mr.,Mr. Perry,jonathanperry@kcislk.ntpc.edu.tw,Jonathan Perry
C10707050,Sam,Thompson,Mr.,Mr. Thompson,samthompson@kcislk.ntpc.edu.tw,Sam Thompson
C11008060,Jeffrey,Hurd,Mr.,Mr. Hurd,jeffreyhurd@kcislk.ntpc.edu.tw,Jeffrey Hurd
C11008088,Nosiviwe,Xwayi,Ms.,Ms. Xwayi,nosiviwexwayi@kcislk.ntpc.edu.tw,Nosiviwe Xwayi
C11008143,Fundiswa,Ngcongo,Ms.,Ms. Ngcongo,fundiswangcongo@kcislk.ntpc.edu.tw,Fundiswa Ngcongo
C11108115,Jesse,Mueller,Mr.,Mr. Mueller,jessemueller@kcislk.ntpc.edu.tw,Jesse Mueller
C11308061,Carlo,Van Rensburg,Mr.,Mr. Van Rensburg,carlorensburg@kcislk.ntpc.edu.tw,Carlo Van Rensburg
C11409017,Sarah,Liebenberg,Ms.,Ms. Liebenberg,sarahliebenberg@kcislk.ntpc.edu.tw,Sarah Liebenberg
C11208106,Jane,Abasalie,Ms.,Ms. Abasalie,janeabasalie@kcislk.ntpc.edu.tw,Jane Abasalie
C11008089,Mark,Ajayi,Mr.,Mr. Ajayi,markajayi@kcislk.ntpc.edu.tw,Mark Ajayi
C11208107,Jeffrey,Doan,Mr.,Mr. Doan,jeffreydoan@kcislk.ntpc.edu.tw,Jeffrey Doan
C11308060,James,Franklin,Mr.,Mr. Franklin,jamesfranklin@kcislk.ntpc.edu.tw,James Franklin
C11308142,Mtika,Destiny,Ms.,Ms. Destiny,mtikadestiny@kcislk.ntpc.edu.tw,Mtika Destiny
C11403008,Thomas,Mathias,Mr.,Mr. Mathias,mathiassullivan@kcislk.ntpc.edu.tw,Thomas Mathias
C11408065,Adeleena,Lee-Hussien,Ms.,Ms. Lee-Hussien,adeleenahussien@kcislk.ntpc.edu.tw,Adeleena Lee-Hussien
C11408064,Richmond,Rapelo,Mr.,Mr. Rapelo,richmondrapelo@kcislk.ntpc.edu.tw,Richmond Rapelo
C10908103,Timothy,Zabinski,Mr.,Mr. Zabinski,timothyzabinski@kcislk.ntpc.edu.tw,Timothy Zabinski
C11308062,Jessie,Su,Ms.,Ms. Su,jessiesu@kcislk.ntpc.edu.tw,Jessie Su
C11308094,Gregory,Porter,Mr.,Mr. Porter,gregoryporter@kcislk.ntpc.edu.tw,Gregory Porter
C11308054,Adriaan,Venter,Mr.,Mr. Venter,adriaanventer@kcislk.ntpc.edu.tw,Adriaan Venter
C11408061,Russell,Aranza,Ms.,Ms. Aranza,russellaranza@kcislk.ntpc.edu.tw,Russell Aranza
C11408063,Jade,Uys,Mrs.,Mrs. Uys,jadeaudriauys@kcislk.ntpc.edu.tw,Jade Uys
C11308055,Carole,Godfrey,Ms.,Ms. Godfrey,carolegodfrey@kcislk.ntpc.edu.tw,Carole Godfrey
C10707042,Adriaan,Louw,Mr.,Mr. Louw,adriaanlouw@kcislk.ntpc.edu.tw,Adriaan Louw
C11308056,Elliot,Turner,Mr.,Mr. Turner,elliotturner@kcislk.ntpc.edu.tw,Elliot Turner
C11310001,Ava Joy,Melocotones,Ms.,Ms. Melocotones,avamelocotones@kcislk.ntpc.edu.tw,Ava Joy Melocotones
C11311005,Marisa,Chapman,Ms.,Ms. Chapman,marisachapman@kcislk.ntpc.edu.tw,Marisa Chapman
C11408062,Caselyn,Javier,Ms.,Ms. Javier,caseylynjavier@kcislk.ntpc.edu.tw,Caselyn Javier
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

1. **教師唯一識別**: 以 `email` 為唯一識別（UNIQUE 約束），用於系統登入
2. **課表關聯**: 使用 `teacher_name` 與課表資料關聯查詢
3. **多班級教學**: 一個教師可同時教授多個班級（如 G1 Visionaries + G1 Inventors）
4. **課表結構**: 按 5 天 × 8 節次 組織
5. **時段無衝突**: 同一教師在同一時段通常只有一個課程
6. **Period 解析**: 格式為 `(數字)時間範圍`，需提取數字作為節次
7. **課程類型區分**: 透過資料來源區分 english / homeroom / ev_myreading
8. **Email 網域**: 所有教師 email 使用 `@kcislk.ntpc.edu.tw` 網域

---

## 11. API 響應格式參考

```json
{
  "success": true,
  "teacher": {
    "id": 1,
    "employee_id": "C11208015",
    "email": "kennyjhang@kcislk.ntpc.edu.tw",
    "chinese_name": "張家芸",
    "english_name": "Kenny",
    "display_name": "Ms. Kenny",
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
-- 教師表（以 email 為唯一識別）
CREATE TABLE teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    chinese_name TEXT,
    english_name TEXT,
    title TEXT,
    display_name TEXT,
    teacher_name TEXT NOT NULL  -- 用於課表關聯
);

-- 英文班課表
CREATE TABLE english_timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    classroom TEXT,
    teacher TEXT NOT NULL,  -- 對應 teachers.teacher_name
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
    teacher TEXT NOT NULL,  -- 對應 teachers.teacher_name
    course_name TEXT
);
```

### 查詢範例（以 email 查詢課表）
```sql
-- 1. 根據 email 取得教師的 teacher_name
SELECT teacher_name FROM teachers WHERE email = 'kennyjhang@kcislk.ntpc.edu.tw';
-- 結果: 張家芸 Kenny

-- 2. 使用 teacher_name 查詢課表
SELECT * FROM english_timetable WHERE teacher = '張家芸 Kenny';
SELECT * FROM homeroom_timetable WHERE teacher = '張家芸 Kenny';

-- 3. 合併查詢（一次取得教師資訊和課表）
SELECT t.*, e.*
FROM teachers t
LEFT JOIN english_timetable e ON t.teacher_name = e.teacher
WHERE t.email = 'kennyjhang@kcislk.ntpc.edu.tw';
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
