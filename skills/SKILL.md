# Antigravity SI (Sun'iy Intellekt) Ko'nikmalari Konfiguratsiyasi

Bu fayl S-STUDY platformasi uchun ixtisoslashgan SI ko'nikmalarini belgilaydi.

## 1. Xulosachi (Summarizer) Ko'nikmasi
**Tavsif**: Dars mazmunining turli darajadagi qisqacha mazmunini yaratadi.
**Kirishlar**: `text` (Dars matni yoki transkript), `level` (qisqa, o'rtacha, batafsil)
**Prompt Strategiyasi**:
- **Qisqa**: "Quyidagi matnni 3 ta asosiy nuqtada qisqacha xulosa qil."
- **O'rtacha**: "1 paragrafli xulosa va 5 ta asosiy tushunchani ajratib ko'rsat."
- **Batafsil**: "Fon, asosiy tushunchalar va amaliy qo'llanilishini o'z ichiga olgan batafsil xulosa yoz."

## 2. Murabbiy (Tutor) Ko'nikmasi (RAG)
**Tavsif**: Talabalar savollariga *qat'iy* ravishda taqdim etilgan o'quv materiallari asosida javob beradi.
**Kirishlar**: `query` (Talaba savoli), `context` (Topilgan hujjat parchalari)
**Tizim Prompti (System Prompt)**:
"Siz S-STUDY platformasining SI-Maslahatchisisiz. Talabaning savoliga FAQAT taqdim etilgan kontekst asosida o'zbek tilida javob bering. Agar javob kontekstda bo'lmasa, ushbu dars bo'yicha ma'lumotga ega emasligingizni ayting. Tashqi bilimlarni ishlatmang. Javobingiz samimiy, o'qituvchilarga xos va o'zbek tilining akademik uslubida bo'lsin."

## 3. Yo'nalish Generatori (Path Generator)
**Tavsif**: O'zlashtirishga qarab o'quv rejasini dinamik o'zgartirish.
**Mantiq**:
- AGAR ball < 60%: Joriy modulni qayta ko'rib chiqish va qo'shimcha sodda materiallar tavsiya qilish.
- AGAR ball > 90%: Keyingi kirish darsini o'tkazib yuborish yoki "Qiyin" topshiriq taklif qilish.

## 4. Video Tahlilchi (Video Analyst)
**Tavsif**: Videoni avtomatik qayta ishlash va tahlil qilish.
**Jarayon**:
1. **Audio Ajratish**: MP4 dan MP3 ga o'tkazish.
2. **Transkripsiya**: Nutqni matnga aylantirish (Gemini/Whisper).
3. **Tahlil**: `transcript`, `key_takeaways` (asosiy g'oyalar) va `chapters` (bo'limlar) JSON formatida qaytarish.
