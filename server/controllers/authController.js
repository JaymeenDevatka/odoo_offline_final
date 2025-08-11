const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { fn, col, literal } = require("sequelize");

const createTestTransporter = require("../config/email");

// In-memory storage for OTPs. In a real production app, you'd use a database (like Redis).
const otpStore = {};

// 1. New Register function: Generates and sends OTP
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    // Store the user's data and OTP temporarily
    otpStore[email] = {
      fullName,
      email,
      password: hashedPassword,
      role,
      otp,
      expiry: Date.now() + 10 * 60 * 1000, 
      // OTP expires in 10 minutes
      avatar: req.body.avatar,
    };

    // Send the OTP email
    const transporter = await createTestTransporter();
    await transporter.sendMail({
      from: '"QuickCourt" <no-reply@quickcourt.com>',
      to: email,
      subject: "Your QuickCourt Verification Code",
      text: `Your OTP is: ${otp}`,
      html: `<b>Your OTP is: ${otp}</b><p>It will expire in 10 minutes.</p>`,
    });

    console.log(`OTP for ${email}: ${otp}`); // Log OTP for easy testing
    res
      .status(200)
      .json({
        message:
          "OTP sent to your email. Please verify to complete registration.",
      });
  } catch (error) {
    console.error("REGISTER/OTP ERROR:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// 2. New Verify OTP function: Verifies OTP and creates the user
exports.verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedData = otpStore[email];

    if (!storedData) {
      return res
        .status(400)
        .json({ message: "Invalid email or OTP has expired." });
    }
    if (storedData.expiry < Date.now()) {
      delete otpStore[email];
      return res
        .status(400)
        .json({ message: "OTP has expired. Please register again." });
    }
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // OTP is correct, create the user in the database
    const newUser = await User.create({
      fullName: storedData.fullName,
      email: storedData.email,
      password: storedData.password,
      role: storedData.role,
      avatar: storedData.avatar, // 👈 Add this line
    });
    // Clean up the temporary store
    delete otpStore[email];

    res
      .status(201)
      .json({ message: "User registered successfully! Please log in." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong during verification." });
  }
};

// This function handles user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials, user not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials, password does not match." });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ token, userId: user.id, message: "Logged in successfully!" });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Something went wrong during login." });
  }
};

// Get aggregated data formatted for charts
exports.getChartData = async (req, res) => {
  try {
    const ownerId = req.userData.userId;
    const facility = await Facility.findOne({ where: { ownerId } });
    if (!facility) {
      return res.status(404).json({ message: "Facility not found." });
    }

    // Query for daily booking trends
    const bookingTrends = await Booking.findAll({
      attributes: [
        [fn("DATE", col("bookingStartTime")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      include: [
        {
          model: Court,
          attributes: [],
          where: { facilityId: facility.id },
        },
      ],
      group: ["date"],
      order: [["date", "ASC"]],
    });

    // Query for peak booking hours
    const peakHours = await Booking.findAll({
      attributes: [
        [fn("HOUR", col("bookingStartTime")), "hour"],
        [fn("COUNT", col("id")), "count"],
      ],
      include: [
        {
          model: Court,
          attributes: [],
          where: { facilityId: facility.id },
        },
      ],
      group: ["hour"],
      order: [["hour", "ASC"]],
    });

    res.status(200).json({ bookingTrends, peakHours });
  } catch (error) {
    console.error("CHART DATA ERROR:", error);
    res.status(500).json({ message: "Failed to fetch chart data." });
  }
};
