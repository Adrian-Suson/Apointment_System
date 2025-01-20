import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import upload from '../config/upload.js';
import { check, validationResult } from "express-validator";

const router = express.Router();

// Admin login route
router.post(
  "/admin/login",
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
      const [admin] = await db.query("SELECT * FROM admins WHERE email = ?", [
        email,
      ]);

      if (admin.length === 0) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, admin[0].password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Prepare admin data (avoid sending sensitive data like password)
      const adminData = {
        id: admin[0].id,
        email: admin[0].email,
        name: admin[0].name,
        avatar: admin[0].avatar || null,
      };

      // Generate JWT token with the admin's essential details
      const payload = {
        admin: {
          id: adminData.id,
          email: adminData.email,
          name: adminData.name,
          avatar: adminData.avatar,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
        (err, token) => {
          if (err) {
            console.error(err.message);
            return res.status(500).send("Server error");
          }

          // Send both the token and the admin info (without password)
          res.json({
            token,
            admin: adminData,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Admin profile route
router.get("/admin/profile/:adminId", async (req, res) => {
  const { adminId } = req.params;

  try {
    const [admin] = await db.query("SELECT * FROM admins WHERE id = ?", [
      adminId,
    ]);

    if (admin.length === 0) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    res.json(admin[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Admin profile update route (including avatar)
router.put("/admin/profile/:adminId", upload, async (req, res) => {
  const { adminId } = req.params;
  const { name, email, password } = req.body;

  try {
    const updateFields = {};

    // Handle fields update
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Handle avatar upload (only save filename)
    if (req.file) {
      updateFields.avatar = req.file.filename;
    }

    const [result] = await db.query("UPDATE admins SET ? WHERE id = ?", [
      updateFields,
      adminId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    res.json({ msg: "Profile updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
