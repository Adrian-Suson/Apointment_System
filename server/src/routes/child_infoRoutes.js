import express from "express";
import db from "../config/db.js"; // Assumes db.js exports a configured MySQL connection

const router = express.Router();

// Endpoint to get child info by user_id
router.get("/immunization-info/:user_id", async (req, res) => {
  const userId = req.params.user_id;

  try {
    // Query to get the child info based on user_id
    const [rows] = await db.execute(
      "SELECT * FROM immunization_info WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Child info not found for this user" });
    }

    // Send back the child info as response
    return res.status(200).json(rows[0]); // Return the first child info
  } catch (err) {
    console.error("Error fetching child info:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get all immunization data
router.get("/immunizations", async (req, res) => {
  try {
    // Query to get all immunization data
    const [rows] = await db.execute("SELECT * FROM immunization_info");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No immunization data found" });
    }

    // Send back the immunization data as response
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching immunization data:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
