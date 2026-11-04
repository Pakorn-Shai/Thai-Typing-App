# ⌨️ Thai Typing Lab

เว็บแอปพลิเคชันสำหรับฝึกพิมพ์สัมผัสภาษาไทยและภาษาอังกฤษ เน้นการฝึกฝนตามแถวแป้นพิมพ์ (Row Progression), การวัดผลความเร็วและความแม่นยำแบบเรียลไทม์ และการวิเคราะห์ข้อผิดพลาดเฉพาะบุคคลโดยไม่ต้องล็อกอิน (Privacy-first / Local-first)

---

## 🎯 วัตถุประสงค์และฟีเจอร์หลัก (MVP)

1. **โหมดการฝึกฝนตามลำดับขั้น (Progressive Lessons):**
   - **Level 1 (Home Row):** `ฟ ห ก ด ่ า ส ว`
   - **Level 2 (Top Row):** `ๆ ไ ำ พ ะ ั ี ร น ย บ ล`
   - **Level 3 (Bottom Row):** `ผ ป แ อ ิ ื ท ม ใ ฝ`
   - **Level 4 (Shift Layer):** สระลอย วรรณยุกต์พิเศษ และอักขระแถวบน
   - **Level 5 (Common Words):** คำศัพท์ภาษาไทยและอังกฤษที่พบบ่อย
   - **Timed Test Mode:** โหมดทดสอบจับเวลา 1 นาที, 3 นาที, 5 นาที
2. **Thai Typing Engine & Metrics:**
   - **CPM (Characters Per Minute):** ดัชนีหลักสำหรับภาษาไทย คำนวณจาก `(อักขระถูกต้อง * 60) / เวลา (วินาที)`
   - **Normalized WPM:** คำนวณจากเกณฑ์สากล `CPM / 5`
   - **Accuracy (%):** เปอร์เซ็นต์ความถูกต้องของคีย์สโตรก
   - **Unicode Normalization:** รองรับการจัดการสระลอยและวรรณยุกต์ซ้อน (`NFC`) เพื่อป้องกันปัญหาลำดับการเคาะคีย์
3. **Interactive Visual Feedback:**
   - Text display แยกสีชัดเจน: เขียว (ถูกต้อง), แดง (ผิดพลาด), ไฮไลต์เคอร์เซอร์ตำแหน่งปัจจุบัน
   - แป้นพิมพ์จำลอง (On-screen Virtual Keyboard) รองรับ Kedmanee (เกษมณี) พร้อมแถบไฮไลต์ปุ่มถัดไป
4. **Local Data Persistence & Privacy:**
   - ไม่บังคับสมัครสมาชิก ไม่ส่งข้อความที่พิมพ์ออกนอกเครื่อง
   - บันทึกสถิติ ประวัติการทดสอบ และ Heatmap แป้นที่พิมพ์ผิดบ่อย (Weak Keys) ลงใน `LocalStorage`
5. **Shareable Result Card:**
   - การ์ดสรุปผลคะแนนท้ายการทดสอบ พร้อมฟังก์ชัน Copy ข้อความ/รูปภาพเพื่อนำไปแชร์

---

## 🛠 Tech Stack

- **Framework:** React 18 / 19 + Vite (TypeScript)
- **Styling:** Tailwind CSS + Lucide Icons (สำหรับ UI Icons)
- **State Management:** React Hooks (`useReducer`, `useState`, `useEffect`)
- **Storage:** Browser LocalStorage API
- **Audio Feedback (Optional):** Web Audio API (Synthesized click / error sounds)

---

## 📁 โครงสร้างโฟลเดอร์ที่กำหนด (Project Directory Structure)

```text
thai-typing-lab/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── typing.ts              # Type definitions (Stats, Lesson, KeyState, Result)
    ├── data/
    │   ├── lessons/
    │   │   ├── thai-lessons.json   # บทเรียนแถวแป้นพิมพ์ไทย (Home row, Top, Bottom, Shift)
    │   │   └── eng-lessons.json    # บทเรียนแถวแป้นพิมพ์อังกฤษ
    │   ├── common-words-th.json   # คำศัพท์ภาษาไทยที่ใช้บ่อย
    │   └── keyboard-layouts.json  # ผังคีย์บอร์ด เกษมณี & QWERTY
    ├── hooks/
    │   ├── useTypingEngine.ts     # Core logic คำนวณ CPM, WPM, Accuracy, Key index
    │   ├── useTimer.ts            # จับเวลา Countdown และ Elapsed time
    │   └── useLocalStorage.ts     # Wrapper จัดการ LocalStorage
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx         # โลโก้, ตัวเลือกภาษา (TH/EN), สลับธีม
    │   │   └── Footer.tsx
    │   ├── typing/
    │   │   ├── TypingArea.tsx     # กล่องแสดงข้อความและตรวจจับการพิมพ์
    │   │   ├── MetricBar.tsx      # แถบแสดง WPM, CPM, Accuracy, เวลาที่เหลือ
    │   │   └── VirtualKeyboard.tsx# แป้นพิมพ์จำลองแสดงนิ้วและไฮไลต์ปุ่มถัดไป
    │   ├── analytics/
    │   │   ├── ResultCard.tsx     # สรุปคะแนนเมื่อจบเวลา พร้อมปุ่มแชร์
    │   │   └── WeakKeyAnalysis.tsx# วิเคราะห์ปุ่มที่กดผิดบ่อย
    │   └── selector/
    │       └── ModeSelector.tsx   # เมนูเลือก Level / Mode / เวลา
    └── utils/
        ├── metrics.ts             # ฟังก์ชันคำนวณ CPM, WPM, Accuracy
        ├── thaiTokenizer.ts       # Utility สำหรับจัดการ Grapheme Clusters และ String Normalize
        └── sound.ts               # Web Audio API สร้างเสียงคีย์บอร์ด