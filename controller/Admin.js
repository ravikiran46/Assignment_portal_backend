const Assignment = require("../models/assignmentSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      role: "admin",
    });
    await newuser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

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

const getassignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ adminId: req.user.id })
      .populate("userId", "username")
      .sort("-createdAt");
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

const acceptAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user.id },
      { status: "accepted" },
      { new: true }
    );
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });
    res.status(200).json({ message: "Assignment accepted", assignment });
  } catch (error) {
    res.status(500).json({ error: "Failed to accept assignment" });
  }
};

const rejectAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user.id },
      { status: "rejected" },
      { new: true }
    );
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });
    res.status(200).json({ message: "Assignment rejected", assignment });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject assignment" });
  }
};

module.exports = {
  register,
  login,
  getassignments,
  acceptAssignment,
  rejectAssignment,
};
