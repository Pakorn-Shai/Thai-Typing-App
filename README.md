# ⌨️ Thai Typing Lab (ห้องทดลองพิมพ์สัมผัสไทย-อังกฤษ)

เว็บแอปพลิเคชันเกรดโปรดักชันสำหรับฝึกพิมพ์สัมผัสภาษาไทยและภาษาอังกฤษ เน้นการฝึกฝนตามแถวแป้นพิมพ์ (Row Progression), การวัดผลความเร็วและความแม่นยำแบบเรียลไทม์ และการวิเคราะห์ข้อผิดพลาดเฉพาะบุคคลโดยไม่ต้องล็อกอิน (Privacy-first / Local-first)

---

## ✨ ฟีเจอร์หลัก (Key Features)

### 1. โหมดการฝึกฝนและทดสอบ (Typing Modes)
- **Progressive Lessons (หลักสูตรบทเรียนพิมพ์สัมผัสมาตรฐาน 12 ระดับ ทั้งภาษาไทยและภาษาอังกฤษ ครอบคลุม 100%):**
  - **ภาษาไทย (12 ระดับ):**
    - **Level 1 (แป้นเหย้าหลัก Home Row Base):** `ฟ ห ก ด ่ า ส ว`
    - **Level 2 (แป้นเหย้าขยาย Home Row Extended):** `เ` (ชี้ซ้าย), `้` (ไม้โท ชี้ขวา), `ง` (ก้อยขวา)
    - **Level 3 (แถวบนซ้าย Top Row Left):** `ๆ ไ ำ พ ะ`
    - **Level 4 (แถวบนขวา Top Row Right):** `ั ี ร น ย บ ล`
    - **Level 5 (แถวล่างซ้าย Bottom Row Left):** `ผ ป แ อ ิ`
    - **Level 6 (แถวล่างขวา Bottom Row Right):** `ื ท ม ใ ฝ`
    - **Level 7 (แถวบนสุดและสระอุ-อึ Number Row):** `ภ ถ ุ ึ ค ต จ ข ช ๅ`
    - **Level 8 (แป้นยกแคร่แถวเหย้า Home Row Shift):** `โ ็ ๋ ษ ศ ซ ฌ ฤ ฆ ฏ`
    - **Level 9 (แป้นยกแคร่แถวบน Top Row Shift):** `ธ ณ ฯ ญ ฐ ฎ ฑ ๊ ํ ฅ`
    - **Level 10 (แป้นยกแคร่แถวล่างและสระอู Bottom Shift):** `ู ์ ฉ ฮ ฒ ฬ ฦ`
    - **Level 11 (ตัวเลขไทยและเครื่องหมายวรรคตอน):** `๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙ ๐ ฿ % " () ?`
    - **Level 12 (วรรณคดีไทยและข้อความขั้นสูง):** วรรณคดีสุนทรภู่ บทความวิชาการ และการฝึกผสมผสานครบทุกตัวอักษร 100%
  - **ภาษาอังกฤษ (12 ระดับ QWERTY):**
    - **Level 1 (Home Row Foundation):** `a s d f j k l ;`
    - **Level 2 (Home Row Extended):** `g`, `h`, `'` (Apostrophe)
    - **Level 3 (Top Row Vowels):** `e`, `i`, `r`, `u`
    - **Level 4 (Top Row Reaches):** `t`, `y`, `o`, `p`, `w`, `q`
    - **Level 5 (Bottom Row Center):** `v`, `b`, `n`, `m`, `c`
    - **Level 6 (Bottom Row Outer):** `z`, `x`, `,`, `.`, `/`
    - **Level 7 (Capital Letters & Shift):** ตัวพิมพ์ใหญ่ A-Z และเทคนิคใช้ Shift สลับมือตรงข้าม
    - **Level 8 (Number Row):** ตัวเลข `1 2 3 4 5 6 7 8 9 0 - =`
    - **Level 9 (Symbols & Punctuation):** เครื่องหมาย `! @ # $ % ^ & * ( ) _ + [ ] { } : " < > ?`
    - **Level 10 (Coding & Tech Syntax):** ไวยากรณ์สำหรับโปรแกรมเมอร์ (`const`, `=>`, `{}`, `[]`, `&&`, `||`)
    - **Level 11 (100 Most Common Words):** คำศัพท์ที่พบบ่อย 50% ของภาษาอังกฤษ
    - **Level 12 (Literature & Master Passages):** สุนทรพจน์ระดับโลกและวรรณกรรมความคล่องตัวสูง
- **Timed Test Mode (โหมดจับเวลา):** ทดสอบจับเวลามาตรฐาน 1 นาที, 3 นาที และ 5 นาที พร้อมนับถอยหลังอัตโนมัติ
- **Common Words Mode (คลังคำพบบ่อย):** สุ่มคำศัพท์ที่พบบ่อยจากคลังคำเพื่อฝึกฝนความคล่องตัว
- **Custom Text Mode (ข้อความกำหนดเอง):** วางข้อความที่ต้องการฝึกฝนได้ตามใจชอบ
- **Sudden Death / Strict Mode (โหมดพิมพ์ห้ามผิด):** โหมดท้าทาย หากพิมพ์ผิดแม้แต่ตัวเดียวจะจบการทดสอบทันที
- **Blind Mode (โหมดพิมพ์ไม่มองตัวอักษร):** เบลอข้อความเป้าหมายเพื่อฝึกความจำของกล้ามเนื้อมือ (Muscle Memory)

### 2. ผังแป้นพิมพ์ที่รองรับ (Keyboard Layouts)
- **ภาษาไทย:** แป้นพิมพ์เกษมณี (**Kedmanee**) และ แป้นพิมพ์ปัตตะโชติ (**Pattachote**)
- **ภาษาอังกฤษ:** แป้นพิมพ์มาตรฐาน (**QWERTY**)
- แสดงแป้นพิมพ์เสมือนจริง (Virtual On-Screen Keyboard) แบบ Responsive พร้อม:
  - ไฮไลต์ปุ่มถัดไปที่ต้องกด
  - แจ้งเตือนเมื่อต้องกดปุ่ม `Shift`
  - ไฮไลต์นิ้วมือและมือซ้าย/ขวาที่ถูกต้องตามหลักสรีรศาสตร์
  - มาร์กเกอร์แป้นเหย้าสัมผัส (`ด` / `F` และ `่` / `J`)

### 3. Thai Typing Engine & Metrics
- **CPM (Characters Per Minute):** ดัชนีวัดผลหลักสำหรับภาษาไทย คำนวณจาก `(อักขระถูกต้อง × 60) / เวลา (วินาที)`
- **Normalized WPM:** คำนวณมาตรฐานสากล `CPM / 5`
- **Accuracy (%):** อัตราความถูกต้องคิดเป็นเปอร์เซ็นต์
- **Unicode NFC Normalization & Grapheme Handling:** จัดการสระ-วรรณยุกต์ซ้อนและสระลอย ป้องกันข้อผิดพลาดจากการรวมตัวอักษร Unicode
- **Speed Trajectory Chart (SVG):** พล็อตกราฟความเร็ว CPM วินาทีต่อวินาทีเมื่อพิมพ์เสร็จ

### 4. ระบบเสียง Mechanical Keyboard (Web Audio API)
- สังเคราะห์เสียงสวิตช์กลไกสมจริงผ่าน Web Audio API (ไม่ต้องดาวน์โหลดไฟล์เสียงภายนอก):
  - **Clicky Blue:** เสียงคลิกคมชัดสไตล์สวิตช์ Blue
  - **Thock Brown:** เสียงทุ้มแน่นสไตล์ Tactile/Linear Thock
  - **Bubble Pop:** เสียงฟองสบู่สดใส นุ่มนวล
  - **Mute / Off:** ปิดเสียงสำหรับสภาพแวดล้อมที่ต้องการความเงียบ
- แถบปรับระดับเสียง (Volume Slider) 0% – 100% พร้อมปุ่มทดสอบเสียงล่วงหน้า

### 5. UI/UX & Navigation
- **Left Vertical Sidebar:** เมนูเลือก Level 1–5 อยู่ด้านข้างซ้าย ไม่ต้องเลื่อนแนวนอน แสดงระดับดาวและปุ่มที่ต้องฝึกในแต่ละบทเรียน พร้อมปุ่มย่อ/ขยายบนหน้าจอ Mobile
- **Theme Adaptability:** รองรับ Dark Mode และ Light Mode อย่างสมบูรณ์แบบ สลับธีมได้ทันทีและบันทึกสถานะ
- **Responsive Design:** ใช้งานได้บนคอมพิวเตอร์ แท็บเล็ต และสมาร์ตโฟน (รองรับ Virtual Keyboard บนมือถือ)
- **Keyboard Shortcuts:**
  - `Tab + Enter`: รีสตาร์ตข้อความปัจจุบันทันที
  - `Escape`: ปิดหน้าต่างโมดอล

### 6. การวิเคราะห์ผลและบันทึกข้อมูล (Analytics & Privacy)
- **Local-first / Privacy-first:** ข้อมูลทั้งหมดจัดเก็บใน `localStorage` ของเบราว์เซอร์ ไม่มีการส่งข้อมูลส่วนบุคคลออกนอกเครื่อง
- **Weak Key Analysis:** จัดอันดับปุ่มที่พิมพ์ผิดบ่อยที่สุด พร้อมแนะนำนิ้วมือที่ควรฝึกเพิ่มเติม
- **History Modal:** บันทึกประวัติการทดสอบ ยอดรวมการฝึก สถิติ WPM/CPM สูงสุด และกราฟแท่งแนวโน้มผลการฝึก
- **Shareable Result Card:**
  - ส่งออกภาพสรุปผลความละเอียดสูง (1200×630 PNG) อัตโนมัติด้วย HTML5 Canvas
  - ปุ่มคลิกเดียวเพื่อคัดลอกรูปภาพเข้า Clipboard หรือดาวน์โหลดลงเครื่อง
  - คัดลอกสรุปผลแบบข้อความสำหรับแชร์บน Social Media / Discord

---

## 🚀 การติดตั้งและรันโปรเจกต์ (Getting Started)

### ความต้องการของระบบ (Prerequisites)
- [Node.js](https://nodejs.org/) เวอร์ชัน 18 ขึ้นไป
- [npm](https://www.npmjs.com/) หรือ [pnpm](https://pnpm.io/)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รัน Development Server
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:5173/`

### 3. รัน Unit Tests
```bash
npm run test
```

### 4. Build สำหรับ Production
```bash
npm run build
```
ไฟล์ผลลัพธ์ที่ปรับปรุงประสิทธิภาพแล้วจะอยู่ในโฟลเดอร์ `dist/` พร้อมสำหรับการ Deploy บน Vercel, Netlify, Cloudflare Pages หรือ GitHub Pages

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📁 โครงสร้างโปรเจกต์ (Project Directory Structure)

```text
thai-typing-lab/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI (Build & Test)
├── index.html                     # HTML Entrypoint
├── package.json                   # Dependencies & Scripts
├── tsconfig.json                  # TypeScript Compiler Configuration
├── vite.config.ts                 # Vite & Vitest Configuration
├── tailwind.config.js             # Tailwind CSS Theme & Plugins
├── postcss.config.js              # PostCSS Configuration
├── README.md                      # Project Documentation
└── src/
    ├── main.tsx                   # React DOM Entrypoint
    ├── App.tsx                    # Main App Controller & State
    ├── index.css                  # Global Styles & Animations
    ├── types/
    │   └── typing.ts              # TypeScript Interfaces & Data Contracts
    ├── data/
    │   ├── lessons/
    │   │   ├── thai-lessons.json  # แบบฝึกหัดภาษาไทย 5 เลเวล
    │   │   └── eng-lessons.json   # แบบฝึกหัดภาษาอังกฤษ 5 เลเวล
    │   ├── common-words-th.json   # คลังคำศัพท์ภาษาไทยพบบ่อย
    │   └── keyboard-layouts.json  # ข้อมูลผังแป้นพิมพ์ เกษมณี, ปัตตะโชติ, QWERTY
    ├── hooks/
    │   ├── useTypingEngine.ts     # Typing logic, Keystroke validation, Timeline snapshots
    │   ├── useTimer.ts            # Stopwatch & Countdown timer
    │   └── useLocalStorage.ts     # Type-safe LocalStorage hook
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx         # Brand, Language switcher, Audio controller, Theme toggle
    │   │   └── Footer.tsx         # Shortcut hints, Privacy badge
    │   ├── selector/
    │   │   ├── LevelSidebar.tsx   # เมนูเลือก Level 1-5 ด้านซ้ายมือ (Vertical Sidebar)
    │   │   └── ModeSelector.tsx   # โหมดการฝึก (Lesson, Timed, Words, Custom, Sudden Death, Blind)
    │   ├── typing/
    │   │   ├── TypingArea.tsx     # กล่องข้อความแบบโต้ตอบ ตัวชี้เคอร์เซอร์ และสถานะสี
    │   │   ├── MetricBar.tsx      # แถบแสดง CPM, WPM, Accuracy, เวลา และ Progress Bar
    │   │   └── VirtualKeyboard.tsx# แป้นพิมพ์จำลองแสดงนิ้วมือและไฮไลต์ปุ่มถัดไป
    │   └── analytics/
    │       ├── ResultCard.tsx     # การ์ดสรุปผลคะแนน, SVG Chart, ดาวน์โหลด/คัดลอกรูปภาพ
    │       ├── WeakKeyAnalysis.tsx# วิเคราะห์ปุ่มที่พิมพ์ผิดบ่อยและนิ้วที่แนะนำ
    │       └── HistoryModal.tsx   # บันทึกประวัติการทดสอบ, KPI รวม และกราฟแนวโน้ม
    └── utils/
        ├── metrics.ts             # สูตรคำนวณ CPM, WPM, Accuracy, Time formatting
        ├── metrics.test.ts        # Unit tests สำหรับ metrics
        ├── thaiTokenizer.ts       # Unicode NFC normalization & Grapheme character splitting
        ├── thaiTokenizer.test.ts  # Unit tests สำหรับการตัดสระและวรรณยุกต์ไทย
        ├── sound.ts               # Web Audio API Synthesizer (Blue, Brown, Bubble)
        └── cardImage.ts           # HTML5 Canvas 1200x630 Share Card Generator
```

---

## 🧪 การทดสอบระบบ (Testing & Quality Assurance)

โปรเจกต์ประกอบด้วยชุดการทดสอบครอบคลุมฟังก์ชันหลัก:
- การคำนวณ CPM, WPM, และ Accuracy ถูกต้องตามมาตรฐาน
- การตัดคำและแยกลำดับอักขระภาษาไทย (สระบน/ล่าง วรรณยุกต์ ตัวสะกด) ด้วย Unicode NFC
- การตรวจสอบปุ่มและเลเยอร์ Shift

```bash
npm run test
```

---

## 🔒 นโยบายความเป็นส่วนตัว (Privacy First)

- ไม่มีการติดตั้ง Tracker หรือ Analytics ภายนอก
- ข้อมูลการพิมพ์ ประวัติการทดสอบ และคะแนนทั้งหมดจะถูกจัดเก็บใน `localStorage` ของเครื่องผู้ใช้เท่านั้น
- ไม่มีการส่งข้อความที่ผู้ใช้ป้อนใน Custom Mode ออกนอกเครือข่าย

---

## 📄 License

MIT License — พัฒนาและเผยแพร่อย่างเปิดเผยเพื่อประโยชน์ทางการศึกษาและการพัฒนาทักษะการพิมพ์สัมผัส
