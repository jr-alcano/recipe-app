// auth.js - handles user login and registration

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "secret";
const SALT_ROUNDS = 12;

// register a new user and return a JWT token and user id
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);

    return res.status(201).json({ token, id: user.id });
  } catch (err) {
    return next(err);
  }
});

// login an existing user and return a JWT token and user id
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const result = await db.query(
      `SELECT id, username, password FROM users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);

    return res.json({ token, id: user.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
