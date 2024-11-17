const express = require("express");
const { register, login, upload, getadmins } = require("../controller/User");
const { authMiddleware } = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/upload", authMiddleware(["user"]), upload);

router.get("/admins", getadmins);

module.exports = router;
