const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      id: Date.now(),
      username,
      email,
      password: hashedPassword,
      role: "customer",
      balance: 0,
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // Không dùng JWT, chỉ trả về thông tin user
    res.json({ message: "Đăng nhập thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
