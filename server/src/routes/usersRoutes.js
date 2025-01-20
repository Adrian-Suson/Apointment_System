import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { check, validationResult } from "express-validator";
import upload from "../config/upload.js"; // Import the multer upload middleware

const router = express.Router();

// User registration route
router.post(
  "/register",
  upload,
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 8 characters").isLength({
      min: 8,
    }),
    check("fullName", "Full Name is required").notEmpty(),
    check("phone", "Phone number is required").notEmpty(),
    check("address", "Address is required").notEmpty(),
    check("birthday", "Birthday is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, address, phone, birthday, password } = req.body;
    const avatar = req.file ? req.file.filename : null;

    try {
      // Check if the user already exists
      const [existingUser] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new user into the database
      const [newUser] = await db.query(
        "INSERT INTO users (name, email, avatar, birthdate, address, phone_number, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
        [
          fullName,
          email,
          avatar || null,
          birthday,
          address,
          phone,
          hashedPassword,
        ]
      );

      // Generate JWT token
      const payload = {
        user: {
          id: newUser.insertId,
          email: email,
          name: fullName,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
        (err, token) => {
          if (err) throw err;

          // Send response with token and user data
          res.json({
            token,
            user: {
              id: newUser.insertId,
              email: email,
              name: fullName,
              avatar: avatar || null,
              address,
              phone,
              birthday,
            },
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// User login route
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user exists
      const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (user.length === 0) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Generate JWT token
      const payload = {
        user: {
          id: user[0].id,
          email: user[0].email,
          name: user[0].name,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
        (err, token) => {
          if (err) throw err;

          // Send response with token and user data
          res.json({
            token,
            user: {
              id: user[0].id,
              email: user[0].email,
              name: user[0].name,
              avatar: user[0].avatar || null,
              address: user[0].address,
              phone: user[0].phone_number,
              birthday: user[0].birthdate,
            },
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// User get by ID route
router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Query the database to find the user by their ID
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);

    if (user.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Send the user data in the response
    res.json({
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      avatar: user[0].avatar || null,
      address: user[0].address,
      phone: user[0].phone_number,
      birthday: user[0].birthdate,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// User get all route (new endpoint)
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.execute("SELECT * FROM users");

    if (users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }

    res.json(
      users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar || null,
        address: user.address,
        phone: user.phone_number,
        birthday: user.birthdate,
      }))
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// User edit route (PUT)
router.put(
  "/user/:id",
  upload, // middleware for handling avatar upload
  [
    check("email", "Please include a valid email").optional().isEmail(),
    check("phone", "Phone number is required").optional().notEmpty(),
    check("address", "Address is required").optional().notEmpty(),
    check("birthday", "Birthday is required").optional().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    const { name, email, address, phone, birthday } = req.body;

    // Check if an avatar is uploaded
    const avatar = req.file ? req.file.filename : null;

    try {
      // Check if the user exists
      const [user] = await db.query("SELECT * FROM users WHERE id = ?", [
        userId,
      ]);

      if (user.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Prepare fields for updating
      const updateFields = {
        name,
        email,
        address,
        phone_number: phone,
        birthdate: birthday,
        avatar: avatar || user[0].avatar, // Retain old avatar if no new avatar is uploaded
        updated_at: new Date(),
      };

      // Remove any fields that are undefined (optional fields)
      Object.keys(updateFields).forEach(
        (key) => updateFields[key] === undefined && delete updateFields[key]
      );

      // Update user in the database
      const [result] = await db.query(
        "UPDATE users SET name = ?, email = ?, avatar = ?, birthdate = ?, address = ?, phone_number = ?, updated_at = ? WHERE id = ?",
        [
          updateFields.name,
          updateFields.email,
          updateFields.avatar,
          updateFields.birthdate,
          updateFields.address,
          updateFields.phone_number,
          updateFields.updated_at,
          userId,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(400).json({ msg: "Failed to update user" });
      }

      // Send the updated user information as a response
      res.json({
        id: userId,
        email: updateFields.email,
        name: updateFields.name,
        avatar: updateFields.avatar,
        address: updateFields.address,
        phone: updateFields.phone_number,
        birthday: updateFields.birthdate,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router;
