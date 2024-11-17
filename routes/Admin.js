const express = require("express");
const {
  getassignments,
  acceptAssignment,
  rejectAssignment,
  register,
  login,
} = require("../controller/Admin");

// middleware
const { authMiddleware } = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/assignments", authMiddleware(["admin"]), getassignments);

router.post(
  "/assignments/:id/accept",
  authMiddleware(["admin"]),
  acceptAssignment
);

router.post(
  "/assignments/:id/reject",
  authMiddleware(["admin"]),
  rejectAssignment
);

module.exports = router;
