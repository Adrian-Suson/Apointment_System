import express from "express";
import db from "../config/db.js"; // Assumes db.js exports a configured MySQL connection

const router = express.Router();

// Get all items in the queue
router.get("/queue", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        q.id AS queue_id,
        q.appointment_id,
        q.status AS queue_status,
        q.processed_at,
        a.appointment_date,
        a.purpose_of_appointment,
        a.remarks,
        a.status AS appointment_status, 
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.avatar AS user_avatar,
        d.id AS doctor_id,
        d.name AS doctor_name,
        d.email AS doctor_email
      FROM queue q
      LEFT JOIN appointments a ON q.appointment_id = a.id
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN doctors d ON q.assigned_to = d.id
      ORDER BY q.processed_at DESC;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching queue:", error);
    res.status(500).json({ error: "Error fetching queue" });
  }
});

// Get the queue for a specific appointment
router.get("/queue/:appointment_id", async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const [rows] = await db.execute(
      "SELECT * FROM queue WHERE appointment_id = ?",
      [appointment_id]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Queue not found for this appointment" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching queue:", error);
    res.status(500).json({ error: "Error fetching queue" });
  }
});

// Add an appointment to the queue
router.post("/queue", async (req, res) => {
  try {
    const { appointment_id, assigned_to } = req.body;
    // Insert the appointment into the queue
    const [result] = await db.execute(
      `INSERT INTO queue (appointment_id, assigned_to, status)
         VALUES (?, ?, "Processing")`,
      [appointment_id, assigned_to]
    );
    // Update the status of the appointment to 'Approved'
    await db.execute(
      `UPDATE appointments SET status = 'Approved' WHERE id = ?`,
      [appointment_id]
    );
    res.status(201).json({
      message: "Appointment added to queue and status updated to 'Approved'",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error adding appointment to queue:", error);
    res.status(500).json({ error: "Error adding appointment to queue" });
  }
});

// Update the queue status (e.g., from 'waiting' to 'in_process' or 'completed')
router.put("/queue/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assigned_to } = req.body;
    const processed_at = status === "completed" ? new Date() : null;

    const [result] = await db.execute(
      `UPDATE queue SET status = ?, assigned_to = ?, processed_at = ? WHERE id = ?`,
      [status, assigned_to, processed_at, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Queue entry not found" });
    }
    res.json({ message: "Queue status updated" });
  } catch (error) {
    console.error("Error updating queue status:", error);
    res.status(500).json({ error: "Error updating queue status" });
  }
});

// Delete a queue entry (optional, soft delete or removal based on business logic)
router.delete("/queue/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(`DELETE FROM queue WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Queue entry not found" });
    }
    res.json({ message: "Queue entry deleted" });
  } catch (error) {
    console.error("Error deleting queue entry:", error);
    res.status(500).json({ error: "Error deleting queue entry" });
  }
});

// Get all items in the queue for a specific doctor by doctor ID (assigned_to)
router.get("/queue/doctor/:doctor_id", async (req, res) => {
  try {
    const { doctor_id } = req.params; // Fetch doctor_id from URL parameters

    // Validate doctor_id
    if (!doctor_id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    // Query to get all queue entries for the doctor (assigned_to) with doctor, user, and appointment details
    const [rows] = await db.execute(
      `
      SELECT
        q.id AS queue_id,
        q.appointment_id,
        q.status AS queue_status,
        q.processed_at,
        a.appointment_date,
        a.purpose_of_appointment,
        q.status AS appointment_status,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.avatar AS user_avatar,
        d.id AS doctor_id,
        d.name AS doctor_name,
        d.email AS doctor_email
      FROM queue q
      LEFT JOIN appointments a ON q.appointment_id = a.id
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN doctors d ON q.assigned_to = d.id
      WHERE q.assigned_to = ?
    `,
      [doctor_id]
    );

    // Check if the doctor has any queue entries
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No queue entries found for this doctor" });
    }

    // Return all queue entries with detailed information
    res.json(rows);
  } catch (error) {
    console.error("Error fetching queue for doctor:", error);
    res.status(500).json({ error: "Error fetching queue for doctor" });
  }
});

router.put("/queue/:queue_id/mark-done", async (req, res) => {
  try {
    const { queue_id } = req.params;

    // Check if the queue_id exists in the queue table first
    const [existingQueue] = await db.execute(
      `SELECT * FROM queue WHERE id = ?`, // Change to query by queue_id
      [queue_id]
    );

    if (existingQueue.length === 0) {
      return res.status(404).json({ error: "Queue entry not found" });
    }

    // Update the queue status to "Done"
    const [queueUpdateResult] = await db.execute(
      `UPDATE queue SET status = 'Done' WHERE id = ?`, // Change to update by queue_id
      [queue_id]
    );

    if (queueUpdateResult.affectedRows === 0) {
      return res.status(500).json({ error: "Failed to update queue status" });
    }

    // Get the associated appointment_id from the queue entry
    const [queueData] = await db.execute(
      `SELECT appointment_id FROM queue WHERE id = ?`,
      [queue_id]
    );

    const appointment_id = queueData[0]?.appointment_id;
    if (!appointment_id) {
      return res
        .status(404)
        .json({ error: "Appointment not found for this queue entry" });
    }

    // Update the appointment status to "Done"
    const [appointmentUpdateResult] = await db.execute(
      `UPDATE appointments SET status = 'Done' WHERE id = ?`,
      [appointment_id]
    );

    if (appointmentUpdateResult.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Queue and appointment status updated to 'Done'" });
  } catch (error) {
    console.error("Error updating queue and appointment status:", error);
    res
      .status(500)
      .json({ error: "Error updating queue and appointment status" });
  }
});

export default router;
