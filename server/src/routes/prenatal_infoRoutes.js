import express from "express";
import db from "../config/db.js"; // Assumes db.js exports a configured MySQL connection

const router = express.Router();

// Endpoint to get prenatal info by ID
router.get("/prenatal-info/:id", async (req, res) => {
  const prenatalId = req.params.id;

  try {
    // Query to fetch the prenatal info by ID
    const [rows] = await db.execute(
      "SELECT * FROM prenatal_info WHERE id = ?",
      [prenatalId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Prenatal info not found" });
    }

    // Return the fetched record
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching prenatal info:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to add new prenatal info
router.post("/prenatal-info", async (req, res) => {
  const { name, age, address, occupation, husband_name, husband_age } =
    req.body;

  try {
    // Insert new prenatal info into the table
    const [result] = await db.execute(
      "INSERT INTO prenatal_info (name, age, address, occupation, husband_name, husband_age) VALUES (?, ?, ?, ?, ?, ?)",
      [name, age, address, occupation, husband_name, husband_age]
    );

    // Return the newly created record ID
    return res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("Error adding prenatal info:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to update existing prenatal info by ID
router.put("/prenatal-info/:id", async (req, res) => {
  const prenatalId = req.params.id;
  const { name, age, address, occupation, husband_name, husband_age } =
    req.body;

  try {
    // Update the prenatal info record
    const [result] = await db.execute(
      "UPDATE prenatal_info SET name = ?, age = ?, address = ?, occupation = ?, husband_name = ?, husband_age = ? WHERE id = ?",
      [name, age, address, occupation, husband_name, husband_age, prenatalId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prenatal info not found" });
    }

    // Return a success message
    return res
      .status(200)
      .json({ message: "Prenatal info updated successfully" });
  } catch (err) {
    console.error("Error updating prenatal info:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to delete prenatal info by ID
router.delete("/prenatal-info/:id", async (req, res) => {
  const prenatalId = req.params.id;

  try {
    // Delete the prenatal info record
    const [result] = await db.execute(
      "DELETE FROM prenatal_info WHERE id = ?",
      [prenatalId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prenatal info not found" });
    }

    // Return a success message
    return res
      .status(200)
      .json({ message: "Prenatal info deleted successfully" });
  } catch (err) {
    console.error("Error deleting prenatal info:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
