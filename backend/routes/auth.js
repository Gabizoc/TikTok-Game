const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../utils/connectDB");
const jwt = require("jsonwebtoken");
const authenticate = require("../utils/authenticate");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/register", async (req, res) => {
  const { firstname, surname, tiktok_username, email, password } = req.body;

  if (!firstname || !surname || !tiktok_username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ? OR tiktok_username = ?",
      [email, tiktok_username]
    );    

    if (existing.length > 0) {
      return res.status(400).json({ error: "Credentials already used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users 
      (firstname, surname, tiktok_username, email, password, notification_security_email, notification_information_email) 
      VALUES (?, ?, ?, ?, ?, 1, 1)`,
      [firstname, surname, tiktok_username, email, hashedPassword]
    );

    const user = {
      id: result.insertId,
      firstname,
      surname,
      tiktok_username,
      email,
      notification_security_email: true,
      notification_information_email: true,
    };

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: "Registered user", user });
  } catch (err) {
    console.error("POST /register:", err);
    res.status(500).json({ error: "Error server" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user)
      return res.status(401).json({ error: "Invalid logins" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid logins" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const {
      password: _,
      notification_security_email,
      notification_information_email,
      ...safeUser
    } = user;

    // Cast int to bool
    safeUser.notification_security_email = !!notification_security_email;
    safeUser.notification_information_email = !!notification_information_email;

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Successful connection", user: safeUser });
  } catch (err) {
    console.error("POST /login:", err);
    res.status(500).json({ error: "Error server" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Successful disconnection." });
});

module.exports = router;
