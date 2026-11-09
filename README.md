# myapp — Auth + Users + Profile (Expo + Node.js + MongoDB)

تطبيق موبايل كامل (تسجيل حساب / تسجيل دخول / عرض المستخدمين / بروفايل) مبني بـ **Expo (React Native)** و **Node.js + Express + MongoDB**، وبيوضّح رحلة البيانات من الفورم لحد قاعدة البيانات ورجوعها للشاشة.

## المميزات

- **إنشاء حساب** مع اختيار **أفاتار إجباري** (إيموجي) + الاسم والإيميل والتليفون والجندر والباسورد.
- **تسجيل دخول** مع إظهار/إخفاء الباسورد ورسائل خطأ واضحة بالعربي.
- **حفظ الجلسة** تلقائيًا باستخدام `AsyncStorage` (تفضل داخل حتى بعد إغلاق التطبيق).
- **قائمة المستخدمين** مع بحث فوري بالاسم/الإيميل/التليفون وإحصائيات.
- **شاشة البروفايل** بتعرض البيانات الحقيقية من الداتابيز: الاسم، الإيميل، الجندر، التليفون، الأفاتار، وتاريخ التسجيل.
- تصميم عربي RTL بهوية بصرية موحّدة (تدرجات، كروت، ظلال) في `theme.js`.

## هيكل المشروع

```
myapp/
├── backend/            # API (Express + Mongoose)
│   ├── server.js       # كل الـ routes والموديل
│   ├── test.js         # اختبار اتصال MongoDB
│   └── .env            # (مش مرفوع) MONGO_URI + JWT_SECRET
└── mobile/             # تطبيق Expo
    ├── App.js          # التنقل وحفظ الجلسة
    ├── theme.js        # نظام التصميم + الأفاتارات
    ├── api.js          # axios + رسائل الأخطاء
    ├── config.js       # اكتشاف عنوان السيرفر تلقائيًا
    ├── AuthContext.js
    └── screens/
        ├── LoginScreen.js
        ├── RegisterScreen.js
        ├── UsersScreen.js
        └── ProfileScreen.js
```

## التشغيل

### 1) الباك اند

```bash
cd backend
npm install
cp .env.example .env     # وعدّل القيم
npm start
```

`.env`:

```env
MONGO_URI=mongodb+srv://user:pass@cluster/db
JWT_SECRET=change-me-to-a-long-random-string
PORT=5000
```

### 2) التطبيق

```bash
cd mobile
npm install
npx expo start --web      # أو npx expo start للـ Expo Go
```

> على الموبايل الحقيقي: التطبيق بياخد IP جهاز الكمبيوتر تلقائيًا من Expo (`config.js`)، فخلّي الموبايل والكمبيوتر على نفس الشبكة.

## API

| Method | Endpoint | الوصف | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/register` | إنشاء حساب جديد | ❌ |
| `POST` | `/api/login` | تسجيل الدخول | ❌ |
| `GET` | `/api/me` | بيانات المستخدم الحالي | ✅ Bearer |
| `GET` | `/api/users` | كل المستخدمين | ✅ Bearer |

### مثال — إنشاء حساب

```json
POST /api/register
{
  "name": "مروان خالد",
  "email": "marwan@demo.com",
  "password": "123456",
  "phone": "01012345678",
  "gender": "male",
  "avatar": "🦊"
}
```

الاستجابة:

```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "6af1...",
    "name": "مروان خالد",
    "email": "marwan@demo.com",
    "phone": "01012345678",
    "gender": "male",
    "avatar": "🦊",
    "createdAt": "2026-11-09T12:31:06.708Z"
  }
}
```

### قواعد التحقق

- الاسم والإيميل والتليفون والجندر والأفاتار **إجباريين**.
- التليفون: أرقام فقط من 7 لـ 15 رقم.
- الباسورد: 6 حروف على الأقل.
- الجندر: `male` أو `female`.
- الأفاتار لازم يكون واحد من القائمة المتاحة في `theme.js` / `server.js`.

## حساب تجريبي

```
Email:    marwan@demo.com
Password: 123456
```

## ملاحظات

- الباسورد متخزّن مشفّر بـ `bcrypt`.
- التوكن JWT صالح 7 أيام.
- ملف `.env` مستثنى من Git، وموجود `.env.example` للتوضيح.
