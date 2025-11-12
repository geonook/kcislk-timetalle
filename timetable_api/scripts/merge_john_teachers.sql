-- ==========================================
-- KCISLK 課表系統 - 教師名稱合併腳本
-- 將 "John" 合併至 "John Adams Villamoran"
-- Created: 2025-11-13
-- Purpose: 修復教師名稱重複問題
-- ==========================================

BEGIN TRANSACTION;

-- 1. 更新 timetable 表（舊數據表）
UPDATE timetable
SET teacher = 'John Adams Villamoran'
WHERE teacher = 'John';

-- 2. 更新 english_timetable 表（實際使用中）
UPDATE english_timetable
SET teacher = 'John Adams Villamoran'
WHERE teacher = 'John';

-- 3. 從 teachers 表中刪除重複的 "John"
DELETE FROM teachers
WHERE teacher_name = 'John';

-- 4. 驗證更新結果
SELECT '=== 驗證更新結果 ===' as status;

SELECT 'timetable 表中 John 相關記錄:' as check_type,
       COUNT(*) as count
FROM timetable
WHERE teacher LIKE '%John%';

SELECT 'english_timetable 表中 John 相關記錄:' as check_type,
       COUNT(*) as count
FROM english_timetable
WHERE teacher LIKE '%John%';

SELECT 'teachers 表中 John 相關記錄:' as check_type,
       teacher_name, COUNT(*) as count
FROM teachers
WHERE teacher_name LIKE '%John%'
GROUP BY teacher_name;

-- 5. 顯示更新後的課程詳情
SELECT '=== John Adams Villamoran 的所有課程 ===' as status;

SELECT day, period, classroom, class_name, teacher
FROM english_timetable
WHERE teacher = 'John Adams Villamoran'
ORDER BY
  CASE day
    WHEN 'Monday' THEN 1
    WHEN 'Tuesday' THEN 2
    WHEN 'Wednesday' THEN 3
    WHEN 'Thursday' THEN 4
    WHEN 'Friday' THEN 5
  END,
  period;

COMMIT;

-- ==========================================
-- 執行完成後的預期結果:
-- - timetable: 6 筆記錄全部為 "John Adams Villamoran"
-- - english_timetable: 6 筆記錄全部為 "John Adams Villamoran"
-- - teachers: 1 筆記錄 "John Adams Villamoran"
-- - 課程: G2 Guardians + G4 Navigators + G4 Visionaries
-- ==========================================
