const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { fn, col, literal } = require("sequelize");
const createTestTransporter = require("../config/email");

// In-memory storage for OTPs
const otpStore = {};

// ============================
// Register function with OTP generation
// ============================
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store user data temporarily
    otpStore[email] = {
      fullName,
      email,
      password: hashedPassword,
      role,
      otp,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
      avatar: req.body.avatar,
      location: req.body.location,
      occupation: req.body.occupation,
      website: req.body.website,
      phone: req.body.phone,
      bio: req.body.bio,
    };

    // Send OTP email
    const transporter = await createTestTransporter();
    await transporter.sendMail({
      from: '"QuickCourt" <no-reply@quickcourt.com>',
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6baf;">QuickCourt Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="background: #4a6baf; color: white; padding: 10px 20px;
              display: inline-block; border-radius: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log(`OTP for ${email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

// ============================
// Verify OTP and complete registration
// ============================
exports.verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedData = otpStore[email];

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or OTP has expired.",
      });
    }

    if (storedData.expiry < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please register again.",
      });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Create user
    const newUser = await User.create({
      fullName: storedData.fullName,
      email: storedData.email,
      password: storedData.password,
      role: storedData.role,
      avatar: storedData.avatar,
      location: storedData.location,
      occupation: storedData.occupation,
      website: storedData.website,
      phone: storedData.phone,
      bio: storedData.bio,
    });

    delete otpStore[email];

    res.status(201).json({
      success: true,
      message: "Registration successful! Please log in.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("VERIFICATION ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed. Please try again.",
    });
  }
};

// ============================
// User login
// ============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      token,
      userId: user.id,
      user: {
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      message: "Logged in successfully!",
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

// ============================
// Get user profile
// ============================
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.userData.userId;

    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "fullName",
        "email",
        "avatar",
        "role",
        "location",
        "occupation",
        "website",
        "phone",
        "bio",
        "createdAt",
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        ...user.dataValues,
        joinDate: user.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

// ============================
// Update user profile
// ============================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.password;
    delete updates.email;
    delete updates.role;

    const [updated] = await User.update(updates, {
      where: { id: userId },
      returning: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: [
        "id",
        "fullName",
        "email",
        "avatar",
        "role",
        "location",
        "occupation",
        "website",
        "phone",
        "bio",
      ],
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

// ============================
// Get all users (for admin)
// ============================
exports.getAllUsers = async (req, res) => {
  try {
    if (req.userData.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const users = await User.findAll({
      attributes: [
        "id",
        "fullName",
        "email",
        "avatar",
        "role",
        "location",
        "occupation",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

module.exports = {
  register: exports.register,
  verifyOtpAndRegister: exports.verifyOtpAndRegister,
  login: exports.login,
  getProfile: exports.getProfile,
  updateProfile: exports.updateProfile,
  getAllUsers: exports.getAllUsers,
};
