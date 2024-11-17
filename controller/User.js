const User = require("../models/userSchema");
const Assignment = require("../models/assignmentSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// signup
const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password)
      return res.status(400).json({ error: "Provide all feilds" });
    const user = await User.findOne({ username });
    if (user) return res.status(409).json({ message: "User Already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new User({
      username,
      password: hashedPassword,
      role: "user",
    });
    await newuser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// login
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password)
      return res.status(400).json({ error: "Provide all feilds" });
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

const upload = async (req, res) => {
  const { task, admin } = req.body;
  try {
    if (!task || !admin)
      return res.status(400).json({ error: "Provide all feilds" });
    const newadmin = await User.findOne({ username: admin });
    if (!newadmin) return res.status(404).json({ error: "No admin found" });
    const assignment = new Assignment({
      userId: req.user.id,
      task,
      adminId: newadmin._id,
    });
    await assignment.save();
    res.status(201).json({ message: "Assignment uploaded" });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
};

const getadmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("_id username");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

module.exports = {
  register,
  login,
  upload,
  getadmins,
};
