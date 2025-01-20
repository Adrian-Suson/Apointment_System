import express from "express";
import db from "../config/db.js"; // Assumes db.js exports a configured MySQL connection

const router = express.Router();

// CREATE: Add a new announcement
router.post("/announcements", async (req, res) => {
  const { title, description, created_by } = req.body;

  if (!title || !description || !created_by) {
    return res
      .status(400)
      .json({ error: "Title, description, and created_by are required" });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO announcements (title, description, created_by) VALUES (?, ?, ?)`,
      [title, description, created_by]
    );
    res.status(201).json({
      message: "Announcement created successfully",
      announcement: {
        id: result.insertId,
        title,
        description,
        created_by,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ error: "Error creating announcement" });
  }
});

// READ ALL: Get all announcements
router.get("/announcements", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT announcements.*, admins.name AS created_by_name 
       FROM announcements 
       INNER JOIN admins ON announcements.created_by = admins.id`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ error: "Error fetching announcements" });
  }
});

// READ ONE: Get a single announcement by ID
router.get("/announcements/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT announcements.*, admins.name AS created_by_name 
       FROM announcements 
       INNER JOIN admins ON announcements.created_by = admins.id
       WHERE announcements.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({ error: "Error fetching announcement" });
  }
});

// UPDATE: Update an announcement by ID
router.put("/announcements/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  try {
    const [result] = await db.execute(
      `UPDATE announcements SET title = ?, description = ? WHERE id = ?`,
      [title, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json({ message: "Announcement updated successfully" });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ error: "Error updating announcement" });
  }
});

// DELETE: Delete an announcement by ID
router.delete("/announcements/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      `DELETE FROM announcements WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ error: "Error deleting announcement" });
  }
});
export default router;
