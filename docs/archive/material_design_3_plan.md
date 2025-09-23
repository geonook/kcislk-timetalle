# KCISLK 課表查詢系統 - Material Design 3 介面設計規劃

## 🎨 設計理念

基於 Google Material Design 3 (Material You) 設計系統，為 KCISLK 小學課表查詢系統打造現代化、直觀且具有親和力的使用者介面。

## 🌈 色彩系統

### 主色調 (Primary)
- **Primary**: #1976D2 (深藍色) - 代表教育的專業性和可信度
- **On Primary**: #FFFFFF (白色)
- **Primary Container**: #E3F2FD (淺藍色容器)
- **On Primary Container**: #0D47A1 (深藍文字)

### 次要色調 (Secondary)
- **Secondary**: #7C4DFF (紫色) - 代表創新和學習
- **On Secondary**: #FFFFFF (白色)
- **Secondary Container**: #F3E5F5 (淺紫色容器)
- **On Secondary Container**: #4A148C (深紫文字)

### 第三色調 (Tertiary)
- **Tertiary**: #FF6F00 (橙色) - 代表活力和成長
- **On Tertiary**: #FFFFFF (白色)
- **Tertiary Container**: #FFF3E0 (淺橙色容器)
- **On Tertiary Container**: #E65100 (深橙文字)

### 中性色調
- **Surface**: #FEFBFF (幾乎白色的表面)
- **On Surface**: #1C1B1F (深灰文字)
- **Surface Variant**: #F4EFF4 (變體表面)
- **On Surface Variant**: #49454F (中灰文字)
- **Outline**: #79747E (邊框色)
- **Outline Variant**: #CAC4D0 (淺邊框色)

### 錯誤色調
- **Error**: #BA1A1A (錯誤紅色)
- **On Error**: #FFFFFF (白色)
- **Error Container**: #FFDAD6 (淺紅色容器)
- **On Error Container**: #410002 (深紅文字)

## 🏗️ 組件設計

### 1. 導航欄 (Top App Bar)
- **樣式**: Material 3 Medium Top App Bar
- **高度**: 112dp (包含標題和副標題)
- **背景**: Surface 色調
- **陰影**: Elevation Level 2 (3dp)
- **內容**:
  - 左側: 系統圖示 + 標題
  - 右側: 語言切換按鈕 + 功能按鈕

### 2. 導航按鈕 (Navigation Buttons)
- **樣式**: Material 3 Segmented Button
- **狀態**:
  - 未選中: Outline 樣式
  - 選中: Filled 樣式，Primary 色調
- **圖示**: Material Symbols (Outlined)
- **文字**: 中英文雙語支援

### 3. 搜尋框 (Search Field)
- **樣式**: Material 3 Outlined Text Field
- **狀態**:
  - 預設: Outline 邊框
  - 聚焦: Primary 色調邊框，加粗 2dp
  - 錯誤: Error 色調邊框
- **圖示**: 左側搜尋圖示，右側清除按鈕
- **動畫**: 標籤浮動動畫

### 4. 卡片 (Cards)
- **樣式**: Material 3 Elevated Card
- **圓角**: 12dp
- **陰影**: Elevation Level 1 (1dp)
- **內邊距**: 16dp
- **狀態**:
  - 預設: Surface 背景
  - 懸停: Surface + 4% Primary 疊加
  - 按下: Surface + 8% Primary 疊加

### 5. 按鈕系統
- **主要按鈕**: Filled Button (Primary 色調)
- **次要按鈕**: Outlined Button
- **文字按鈕**: Text Button
- **浮動按鈕**: Extended FAB (用於快速操作)

### 6. 徽章 (Badges/Chips)
- **樣式**: Material 3 Filter Chip
- **狀態**:
  - 未選中: Outline 樣式
  - 選中: Filled 樣式，Secondary 色調
- **用途**: 課程類型標籤、統計標籤

## 📱 響應式設計

### 斷點設計
- **Compact**: 0-599dp (手機直向)
- **Medium**: 600-839dp (手機橫向、小平板)
- **Expanded**: 840dp+ (大平板、桌面)

### 佈局適配
- **Compact**: 單欄佈局，底部導航
- **Medium**: 雙欄佈局，側邊導航
- **Expanded**: 三欄佈局，永久側邊導航

## 🎭 動畫系統

### 過渡動畫
- **頁面切換**: Shared Element Transition
- **卡片展開**: Container Transform
- **列表項目**: Fade Through
- **按鈕狀態**: 標準 Material Motion

### 微互動
- **按鈕點擊**: Ripple Effect
- **卡片懸停**: Elevation 變化
- **輸入框聚焦**: 邊框顏色過渡
- **載入狀態**: Circular Progress Indicator

## 🌐 多語言適配

### 文字處理
- **字體**: Roboto (英文) + Noto Sans CJK (中文)
- **字重**: Regular (400), Medium (500), Bold (700)
- **行高**: 1.5 倍字體大小
- **字間距**: 0.01em

### 佈局適配
- **文字長度**: 動態調整容器寬度
- **RTL 支援**: 預留未來擴展
- **圖示**: 使用通用 Material Symbols

## 📊 資料視覺化

### 統計卡片
- **樣式**: Material 3 Filled Card
- **數字**: Display Large (57sp)
- **標籤**: Body Medium (14sp)
- **圖示**: 24dp Material Symbols
- **色彩**: 使用 Primary、Secondary、Tertiary 色調區分

### 課表網格
- **樣式**: Material 3 Data Table 變體
- **行**: 48dp 最小高度
- **列**: 彈性寬度，最小 120dp
- **分隔線**: Outline Variant 色調
- **懸停**: Surface Variant 背景

## 🎯 無障礙設計

### 色彩對比
- **文字對比**: 最小 4.5:1 (AA 級)
- **大文字對比**: 最小 3:1 (AA 級)
- **圖示對比**: 最小 3:1

### 觸控目標
- **最小尺寸**: 48dp × 48dp
- **間距**: 最小 8dp
- **狀態指示**: 視覺 + 語義

### 鍵盤導航
- **Tab 順序**: 邏輯順序
- **焦點指示**: 明顯的焦點環
- **快捷鍵**: 常用功能快捷鍵

## 🔧 技術實現

### CSS 變數系統
```css
:root {
  --md-sys-color-primary: #1976D2;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #E3F2FD;
  --md-sys-color-on-primary-container: #0D47A1;
  
  --md-sys-elevation-level0: 0dp;
  --md-sys-elevation-level1: 1dp;
  --md-sys-elevation-level2: 3dp;
  --md-sys-elevation-level3: 6dp;
  
  --md-sys-motion-duration-short1: 50ms;
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-medium1: 250ms;
  --md-sys-motion-duration-medium2: 300ms;
}
```

### 組件庫選擇
- **基礎**: 自定義 CSS + Material Symbols
- **動畫**: CSS Transitions + Framer Motion
- **狀態管理**: React Context (現有)
- **主題切換**: CSS 變數動態更新

## 📋 實現優先級

### Phase 1: 基礎組件
1. 色彩系統和 CSS 變數
2. 導航欄和按鈕
3. 卡片和基礎佈局

### Phase 2: 互動組件
1. 搜尋框和表單元素
2. 課表網格和資料展示
3. 統計卡片和視覺化

### Phase 3: 進階功能
1. 動畫和過渡效果
2. 響應式佈局優化
3. 無障礙功能完善

### Phase 4: 優化和測試
1. 效能優化
2. 跨瀏覽器測試
3. 使用者體驗測試

## 🎨 視覺範例

### 主頁面佈局
```
┌─────────────────────────────────────────┐
│ [🏫] KCISLK 課表查詢系統        [🌐] EN │
├─────────────────────────────────────────┤
│ [👥 班級課表] [👨‍🎓 學生課表]              │
├─────────────────────────────────────────┤
│                                         │
│     [🔍 搜尋學生姓名或學號...]           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📊 歡迎使用課表查詢系統             │ │
│ │                                     │ │
│ │ • 支援 1,512 位學生資料查詢         │ │
│ │ • 涵蓋 G1-G6 所有年級               │ │
│ │ • 中英文雙語介面                    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 學生課表頁面
```
┌─────────────────────────────────────────┐
│ 👨‍🎓 鄧欣愉 Alice Hsin (LE13105)  [🔄 重新搜尋] │
├─────────────────────────────────────────┤
│ [📚 G2 Explorers] [🏠 203] [📖 G2H]     │
├─────────────────────────────────────────┤
│ 📊 課表統計                              │
│ [18] 總課程 [5] 上課天數 [16] 英文課 [2] EV │
├─────────────────────────────────────────┤
│ 📅 週課表                               │
│ ┌───┬───┬───┬───┬───┐                   │
│ │週一│週二│週三│週四│週五│                   │
│ ├───┼───┼───┼───┼───┤                   │
│ │[1]│[1]│[1]│[1]│[1]│                   │
│ │英文│英文│英文│英文│英文│                   │
│ └───┴───┴───┴───┴───┘                   │
└─────────────────────────────────────────┘
```

這個設計規劃將確保新的介面既符合 Material Design 3 的設計原則，又能完美適配 KCISLK 課表查詢系統的功能需求。

