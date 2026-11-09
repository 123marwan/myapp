require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- الاتصال بقاعدة البيانات ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err.message));

// ---------- شكل بيانات المستخدم ----------
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true, default: "" },
    gender: { type: String, enum: ["male", "female"], default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

// الأفاتارات المسموح بيها (إيموجي)
const AVATARS = [
  "🦊",
  "🐼",
  "🐯",
  "🦁",
  "🐨",
  "🐸",
  "🦉",
  "🐙",
  "🦄",
  "🐳",
  "🐝",
  "🦋",
];

// شكل بيانات المستخدم اللي بيرجع للتطبيق (من غير الباسورد)
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    gender: user.gender || "",
    avatar: user.avatar || "",
    createdAt: user.createdAt,
  };
}

// ---------- حماية الطلبات بالتوكن ----------
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// ---------- تسجيل حساب جديد ----------
app.post("/api/register", async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const password = (req.body.password || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const phone = (req.body.phone || "").trim();
    const gender = (req.body.gender || "").trim();
    const avatar = (req.body.avatar || "").trim();

    if (!name || !email || !password || !phone || !gender || !avatar)
      return res
        .status(400)
        .json({ message: "من فضلك اكمل كل الحقول المطلوبة" });

    if (!AVATARS.includes(avatar))
      return res.status(400).json({ message: "اختار الأفاتار بتاعك" });

    if (!/^[0-9]{7,15}$/.test(phone))
      return res.status(400).json({ message: "رقم التليفون غير صحيح" });

    if (!["male", "female"].includes(gender))
      return res.status(400).json({ message: "الجندر غير صحيح" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "الباسورد لازم يكون 6 حروف على الأقل" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      gender,
      avatar,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      token,
      user: publicUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- تسجيل دخول ----------
app.post("/api/login", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password)
      return res.status(400).json({ message: "من فضلك اكتب الإيميل والباسورد" });

    const user = await User.findOne({ email });
    console.log(
      `[login] ${email} -> ${user ? "user found" : "no user"}${
        user ? ` | password ${"(checking)"} | length ${password.length}` : ""
      }`
    );
    if (!user)
      return res.status(400).json({ message: "الإيميل ده مش مسجل عندنا" });

    let ok = await bcrypt.compare(password, user.password);
    // لو فيه مسافة زيادة في آخر الباسورد بالغلط، جرّب من غيرها كمان
    if (!ok && password.trim() !== password)
      ok = await bcrypt.compare(password.trim(), user.password);
    console.log(
      `[login] ${email} -> password ${ok ? "OK" : "WRONG"} | length ${password.length}`
    );
    if (!ok)
      return res.status(400).json({ message: "الباسورد غير صحيح" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: publicUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- بيانات المستخدم الحالي ----------
app.get("/api/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    res.json(publicUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- عرض كل المستخدمين (للشاشة الثالثة) ----------
app.get("/api/users", auth, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map(publicUser));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));