# 📚 Documentation — ITA-QOS

ไฟล์เหล่านี้สำหรับใช้ตอน present + พัฒนาต่อ

## 📖 Files

| File | ใช้ทำอะไร |
|---|---|
| [PITCH_SCRIPT.md](PITCH_SCRIPT.md) | สคริปต์พูด 5 นาที + Q&A 12+ คำถาม |
| [DEMO_SCRIPT.md](DEMO_SCRIPT.md) | สคริปต์สำหรับบันทึกวิดีโอ demo (3 นาที) |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System diagram + tech stack + security |
| [ROI_STATS.md](ROI_STATS.md) | ตัวเลข ROI + market size + competitive table |

## 🎬 ลำดับเตรียม present

### ขั้นตอน 1: ทำสไลด์ (PowerPoint)
1. อ่าน [PITCH_SCRIPT.md](PITCH_SCRIPT.md) — เห็นโครง 12 สไลด์
2. ใช้ตัวเลขจาก [ROI_STATS.md](ROI_STATS.md) ใส่สไลด์ "Impact"
3. Export ASCII diagram ใน [ARCHITECTURE.md](ARCHITECTURE.md) ทำเป็นภาพใน Figma/Canva
4. capture screenshot 4-5 หน้าจอจาก https://ita-qos.vercel.app

### ขั้นตอน 2: บันทึกวิดีโอ Demo
1. อ่าน [DEMO_SCRIPT.md](DEMO_SCRIPT.md)
2. เปิด OBS Studio (หรือ Win + G)
3. ทำตาม storyboard 10 scenes
4. Export เป็น MP4 ใส่ในสไลด์ที่ 6

### ขั้นตอน 3: ซ้อม
1. อ่าน script ออกเสียง 3-5 ครั้ง
2. จับเวลา — ต้องอยู่ใน 5 นาที
3. ดู Q&A ใน [PITCH_SCRIPT.md](PITCH_SCRIPT.md) — ฝึกตอบ 5 คำถาม

### ขั้นตอน 4: Backup plan
- ✅ มี internet สำรอง? (hotspot มือถือ)
- ✅ มี laptop สำรอง? (เผื่อเครื่องหลักพัง)
- ✅ บันทึกวิดีโอ demo ไว้แล้ว? (เผื่อ live demo มีปัญหา)
- ✅ พิมพ์ QR code ติดไว้บนกระดาษ? (เผื่อกรรมการอยากลอง)

## 💡 Pro Tips

### สำหรับการ present
- **เริ่มด้วย hook กระแทกใจ** — ตัวเลข medication error
- **โชว์ NFC tap จริงในมือถือ** ถ้าทำได้ (ไม่ใช่แค่วิดีโอ)
- **เน้น "เริ่มใช้งานวันนี้ได้เลย"** — ให้ URL กรรมการลองเอง
- **ถ้าโดนถามตรงๆ ที่ไม่รู้ — ตอบตรงๆ** ว่ายังไม่ได้ทำ + Phase ไหนจะทำ

### Avoid these mistakes
- ❌ อย่าโชว์โค้ดยาวๆ บนสไลด์ (เบื่อ)
- ❌ อย่าใช้คำเทคนิคเยอะเกิน (RLS, RSC) ถ้ากรรมการเป็นหมอ
- ❌ อย่าพูดเกินจริง — ROI 1,000% บอก "ตามคำนวณเบื้องต้น"
- ❌ อย่ายึดติด script ตายตัว — ปรับตามบรรยากาศ

## 🎯 Quick Reference

| ต้องการ... | เปิดไฟล์ไหน |
|---|---|
| สคริปต์พูด 5 นาที | PITCH_SCRIPT.md → "สคริปต์เต็ม" |
| Q&A กรรมการ | PITCH_SCRIPT.md → "Q&A เตรียมรับมือ" |
| โครงสไลด์ | PITCH_SCRIPT.md → "โครงสไลด์แนะนำ" |
| ตัวเลข ROI | ROI_STATS.md → "ROI Calculation" |
| Tech diagram | ARCHITECTURE.md → "Visual Diagram" |
| Storyboard วิดีโอ | DEMO_SCRIPT.md → "Storyboard" |
| ตอบเรื่อง security | ARCHITECTURE.md → "Security Architecture" |
| ตอบเรื่อง scale | ARCHITECTURE.md → "Scalability" |
