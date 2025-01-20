import express from "express";
import db from "../config/db.js"; // MySQL connection
import { check, validationResult } from "express-validator";
import moment from "moment";

const router = express.Router();

/**
 * Create a new schedule
 */
router.post(
  "/schedules",
  [
    check("doctor_id")
      .isNumeric()
      .withMessage("Doctor ID must be a number.")
      .notEmpty()
      .withMessage("Doctor ID is required."),
    check("schedule_date")
      .custom((value) => {
        if (!moment(value, "YYYY-MM-DD", true).isValid()) {
          throw new Error(
            "Invalid schedule date format. Please use YYYY-MM-DD."
          );
        }
        return true;
      })
      .notEmpty()
      .withMessage("Schedule date is required."),
    check("am_max_patients")
      .isInt({ min: 0 })
      .withMessage("AM max patients must be a non-negative integer."),
    check("pm_max_patients")
      .isInt({ min: 0 })
      .withMessage("PM max patients must be a non-negative integer."),
  ],
  async (req, res) => {
    console.log(req.body); // Log incoming request body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctor_id, schedule_date, am_max_patients, pm_max_patients } =
      req.body;

    try {
      // Check for duplicate schedule
      const duplicateQuery = `
        SELECT COUNT(*) AS count
        FROM schedules
        WHERE doctor_id = ? AND schedule_date = ? AND deleted_at IS NULL
      `;
      const [existingSchedule] = await db.execute(duplicateQuery, [
        doctor_id,
        schedule_date,
      ]);

      if (existingSchedule[0].count > 0) {
        return res.status(400).json({
          error: "A schedule already exists for this doctor and date.",
        });
      }

      // Insert the new schedule
      const insertQuery = `
        INSERT INTO schedules (doctor_id, schedule_date, am_max_patients, pm_max_patients, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `;
      const [result] = await db.execute(insertQuery, [
        doctor_id,
        schedule_date,
        am_max_patients,
        pm_max_patients,
      ]);

      res.status(201).json({
        message: "Schedule created successfully.",
        schedule: {
          id: result.insertId,
          doctor_id,
          schedule_date,
          am_max_patients,
          pm_max_patients,
        },
      });
    } catch (error) {
      console.error("Error creating schedule:", error);
      res.status(500).json({
        error: "An internal server error occurred while creating the schedule.",
      });
    }
  }
);

/**
 * Get all schedules
 */
router.get("/schedules", async (req, res) => {
  try {
    const query = `
      SELECT
        schedules.id AS schedule_id,
        schedules.schedule_date,
        schedules.am_max_patients,
        schedules.pm_max_patients,
        schedules.updated_at,
        doctors.name AS doctor_name,
        doctors.email AS doctor_email,
        doctors.specialization_id,
        doctor_specialties.specialty_name AS doctor_specialization
      FROM schedules
      JOIN doctors ON schedules.doctor_id = doctors.id
      JOIN doctor_specialties ON doctors.specialization_id = doctor_specialties.id
      WHERE schedules.deleted_at IS NULL
    `;
    const [schedules] = await db.execute(query);
    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving schedules." });
  }
});

/**
 * Retrieve schedules by doctor
 */
router.get("/schedules/doctor/:doctorId", async (req, res) => {
  const { doctorId } = req.params;

  try {
    const query = `
      SELECT
        schedules.id AS schedule_id,
        schedules.schedule_date,
        schedules.am_max_patients,
        schedules.pm_max_patients,
        schedules.updated_at,
        doctors.name AS doctor_name,
        doctors.email AS doctor_email,
        doctors.specialization_id,
        doctor_specialties.specialty_name AS doctor_specialization
      FROM schedules
      JOIN doctors ON schedules.doctor_id = doctors.id
      JOIN doctor_specialties ON doctors.specialization_id = doctor_specialties.id
      WHERE schedules.doctor_id = ? AND schedules.deleted_at IS NULL
    `;
    const [schedules] = await db.execute(query, [doctorId]);

    if (schedules.length === 0) {
      return res
        .status(404)
        .json({ error: "No schedules found for this doctor." });
    }

    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the schedules." });
  }
});

/**
 * Get available slots for a specific doctor
 */
router.get("/available-slots", async (req, res) => {
  const { doctorId } = req.query;

  if (!doctorId) {
    return res.status(400).json({ error: "Doctor ID is required." });
  }

  try {
    const query = `
      SELECT
        s.schedule_date,
        s.am_max_patients - IFNULL(SUM(CASE WHEN a.slot = 'AM' THEN 1 ELSE 0 END), 0) AS remaining_am_slots,
        s.pm_max_patients - IFNULL(SUM(CASE WHEN a.slot = 'PM' THEN 1 ELSE 0 END), 0) AS remaining_pm_slots
      FROM schedules s
      LEFT JOIN appointments a ON s.id = a.schedule_id
      WHERE s.doctor_id = ? AND s.deleted_at IS NULL
      GROUP BY s.id, s.schedule_date, s.am_max_patients, s.pm_max_patients
      ORDER BY s.schedule_date
    `;

    const [slots] = await db.execute(query, [doctorId]);

    const transformedData = slots.map((slot) => ({
      schedule_date: slot.schedule_date,
      am: {
        remaining_slots: slot.remaining_am_slots,
      },
      pm: {
        remaining_slots: slot.remaining_pm_slots,
      },
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching available slots." });
  }
});

// Retrieve schedules by doctor and check if a schedule exists for a specific date
router.get("/schedules/doctor/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query; // The date query parameter (e.g., 'YYYY-MM-DD')

  if (!date) {
    return res.status(400).json({ error: "Date query parameter is required." });
  }

  try {
    // Query to check if a schedule exists for the doctor and date
    const checkQuery = `
      SELECT COUNT(*) AS count
      FROM schedules
      WHERE doctor_id = ? AND schedule_date = ? AND deleted_at IS NULL
    `;
    const [existingSchedule] = await db.execute(checkQuery, [
      doctorId,
      date,
    ]);

    if (existingSchedule[0].count > 0) {
      return res.status(200).json({ message: "Schedule already exists for this date." });
    }

    // If no schedule exists for this date, return an empty response or the available slots.
    const query = `
      SELECT
        schedules.id AS schedule_id,
        schedules.schedule_date,
        schedules.am_max_patients,
        schedules.pm_max_patients,
        schedules.updated_at,
        doctors.name AS doctor_name,
        doctors.email AS doctor_email,
        doctors.specialization_id,
        doctor_specialties.specialty_name AS doctor_specialization
      FROM schedules
      JOIN doctors ON schedules.doctor_id = doctors.id
      JOIN doctor_specialties ON doctors.specialization_id = doctor_specialties.id
      WHERE schedules.doctor_id = ? AND schedules.deleted_at IS NULL
    `;
    const [schedules] = await db.execute(query, [doctorId]);

    if (schedules.length === 0) {
      return res
        .status(404)
        .json({ error: "No schedules found for this doctor." });
    }

    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the schedules." });
  }
});


export default router;
