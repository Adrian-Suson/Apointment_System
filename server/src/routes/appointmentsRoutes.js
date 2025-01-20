import express from "express";
import db from "../config/db.js"; // Assumes db.js exports a configured MySQL connection

const router = express.Router();

// Get an appointment by ID
router.get("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(
      "SELECT * FROM appointments WHERE id = ? AND deleted_at IS NULL",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Error fetching appointment" });
  }
});

// Create a new appointment
router.post("/appointments", async (req, res) => {
  const { userId, doctorId, selectedDate, formData, purpose, slotPeriod } =
    req.body;

  try {
    let immunizationId = null;
    let prenatalId = null;
    let patientId = null;

    // Step 1: Insert data into the appropriate table based on the purpose
    if (purpose === "Prenatal") {
      const prenatalQuery = `
        INSERT INTO prenatal_info (user_id, name, age, address, occupation, husband_name, husband_age)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [prenatalResult] = await db.query(prenatalQuery, [
        userId,
        formData.name,
        formData.age,
        formData.address,
        formData.occupation,
        formData.husband_name,
        formData.husband_age,
      ]);

      prenatalId = prenatalResult.insertId; // Get the inserted ID for prenatal info
      console.log("Prenatal ID:", prenatalId); // Debugging log

      // Insert into patients table
      const patientQuery = `
        INSERT INTO patients (prenatal_id)
        VALUES (?)
      `;

      const [patientResult] = await db.query(patientQuery, [prenatalId]);

      patientId = patientResult.insertId; // Get the inserted ID for patient
      console.log("Patient ID:", patientId); // Debugging log
    } else if (purpose === "Immunization") {
      const immunizationQuery = `
        INSERT INTO immunization_info (user_id, child_name, birthdate, birthplace, address, mother_name, father_name, birth_height, birth_weight, sex, health_center, barangay, family_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [immunizationResult] = await db.query(immunizationQuery, [
        userId,
        formData.child_name,
        formData.birthdate,
        formData.birthplace,
        formData.address,
        formData.mother_name,
        formData.father_name,
        formData.birth_height,
        formData.birth_weight,
        formData.sex,
        formData.health_center,
        formData.barangay,
        formData.family_number,
      ]);

      immunizationId = immunizationResult.insertId; // Get the inserted ID for immunization info
      console.log("Immunization ID:", immunizationId); // Debugging log

      // Insert into patients table
      const patientQuery = `
        INSERT INTO patients (immunization_id)
        VALUES (?)
      `;

      const [patientResult] = await db.query(patientQuery, [immunizationId]);

      patientId = patientResult.insertId; // Get the inserted ID for patient
      console.log("Patient ID:", patientId); // Debugging log
    } else {
      return res.status(400).send("Invalid purpose specified");
    }

    // Step 2: Find the schedule_id based on doctorId and selectedDate
    const scheduleQuery = `
      SELECT id 
      FROM schedules 
      WHERE doctor_id = ? AND schedule_date = ? AND deleted_at IS NULL
    `;
    const [schedules] = await db.query(scheduleQuery, [doctorId, selectedDate]);

    if (schedules.length === 0) {
      return res
        .status(404)
        .send("No available schedule found for the selected doctor and date");
    }

    const scheduleId = schedules[0].id;
    console.log("Schedule ID:", scheduleId); // Debugging log

    // Step 3: Insert the appointment data, using the patient_id
    const appointmentQuery = `
      INSERT INTO appointments (user_id, doctor_id, schedule_id, immunization_id, prenatal_id, patient_id, status, purpose_of_appointment, appointment_date, slot)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
    `;

    // Insert the appointment with the corresponding ID based on the purpose
    await db.query(appointmentQuery, [
      userId,
      doctorId,
      scheduleId,
      immunizationId, // Will be null if purpose is not immunization
      prenatalId, // Will be null if purpose is not prenatal
      patientId, // Patient ID
      purpose,
      selectedDate,
      slotPeriod,
    ]);

    res.status(200).send("Appointment created successfully");
  } catch (err) {
    console.error("Error in creating appointment:", err);
    res.status(500).send("Failed to create appointment");
  }
});

// Update an appointment
router.put("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      doctor_id,
      schedule_id,
      purpose_of_appointment,
      appointment_date,
      status,
    } = req.body;
    const [result] = await db.execute(
      `UPDATE appointments 
       SET user_id = ?, doctor_id = ?, schedule_id = ?, purpose_of_appointment = ?,  appointment_date = ?, status = ? 
       WHERE id = ? AND deleted_at IS NULL`,
      [
        user_id,
        doctor_id,
        schedule_id,
        purpose_of_appointment,

        appointment_date,
        status,
        id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ message: "Appointment updated" });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Error updating appointment" });
  }
});

// Delete an appointment (soft delete)
router.delete("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      `UPDATE appointments
       SET deleted_at = NOW()
       WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Error deleting appointment" });
  }
});

// Get appointments by doctor ID with AM/PM classification
router.get("/appointments/doctor/:doctor_id", async (req, res) => {
  try {
    const { doctor_id } = req.params;

    const [rows] = await db.execute(
      `
      SELECT
        appointments.id AS appointment_id,
        users.name AS user_name,
        users.email AS user_email,
        users.avatar,
        users.id AS user_id,
        users.address,
        users.phone_number,
        appointments.purpose_of_appointment,
        appointments.appointment_date,
        appointments.status,
        appointments.slot,
        CASE
          WHEN HOUR(appointments.appointment_date) < 12 THEN 'AM'
          ELSE 'PM'
        END AS time_slot
      FROM appointments
      INNER JOIN users ON appointments.user_id = users.id
      WHERE appointments.doctor_id = ?
        AND appointments.deleted_at IS NULL
      `,
      [doctor_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No appointments found for this doctor" });
    }

    // Organize appointments into AM and PM tabs
    const appointmentsByTimeSlot = {
      AM: [],
      PM: [],
    };

    rows.forEach((appointment) => {
      if (appointment.slot === "AM") {
        appointmentsByTimeSlot.AM.push(appointment);
      } else {
        appointmentsByTimeSlot.PM.push(appointment);
      }
    });

    res.json(appointmentsByTimeSlot);
  } catch (error) {
    console.error("Error fetching appointments by doctor ID:", error);
    res.status(500).json({ error: "Error fetching appointments by doctor ID" });
  }
});

// Get all appointments with AM/PM classification
router.get("/appointments", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT
        appointments.id AS appointment_id,
        users.name AS user_name,
        users.email AS user_email,
        users.avatar,
        users.id AS user_id,
        users.address,
        users.phone_number,
        appointments.purpose_of_appointment,
        appointments.appointment_date,
        appointments.status,
        appointments.slot,
        CASE 
          WHEN HOUR(appointments.appointment_date) < 12 THEN 'AM'
          ELSE 'PM'
        END AS time_slot
      FROM appointments
      INNER JOIN users ON appointments.user_id = users.id
      WHERE appointments.deleted_at IS NULL
      `
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No appointments found" });
    }

    // Organize appointments into AM and PM tabs
    const appointmentsByTimeSlot = {
      AM: [],
      PM: [],
    };

    rows.forEach((appointment) => {
      if (appointment.slot === "AM") {
        appointmentsByTimeSlot.AM.push(appointment);
      } else {
        appointmentsByTimeSlot.PM.push(appointment);
      }
    });

    res.json(appointmentsByTimeSlot);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Error fetching appointments" });
  }
});

// Route to get clinic stats
router.get("/allstats", async (req, res) => {
  try {
    // Update the totalAppointments query to count only pending appointments
    const [totalAppointments] = await db.query(
      "SELECT COUNT(*) AS total_appointments FROM appointments"
    );
    const [activeDoctors] = await db.query(
      'SELECT COUNT(*) AS active_doctors FROM doctors WHERE status = "active"'
    );
    const [totalPatients] = await db.query(
      "SELECT COUNT(DISTINCT user_id) AS total_patients FROM appointments"
    );
    const [pendingAppointments] = await db.query(
      'SELECT COUNT(*) AS pending_appointments FROM appointments WHERE status = "pending"'
    );

    const stats = {
      totalAppointments: totalAppointments[0].total_appointments, // Pending appointments only
      activeDoctors: activeDoctors[0].active_doctors,
      totalPatients: totalPatients[0].total_patients,
      pendingAppointments: pendingAppointments[0].pending_appointments,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get clinic stats by doctor ID
router.get("/stats/doctor", async (req, res) => {
  const doctorId = req.query.doctorId; // Get the doctor ID from the query parameters

  if (!doctorId) {
    return res.status(400).json({ message: "Doctor ID is required" });
  }

  try {
    // Get the number of pending appointments for the specific doctor
    const [totalAppointments] = await db.query(
      "SELECT COUNT(*) AS total_appointments FROM appointments WHERE doctor_id = ?",
      [doctorId]
    );

    // Get the count of active doctors (this can be adjusted to only consider doctors associated with the doctor ID)
    const [activeDoctors] = await db.query(
      'SELECT COUNT(*) AS active_doctors FROM doctors WHERE status = "active" AND id = ?',
      [doctorId]
    );

    // Get the total number of patients (unique users) associated with the doctor's appointments
    const [totalPatients] = await db.query(
      "SELECT COUNT(DISTINCT user_id) AS total_patients FROM appointments WHERE doctor_id = ?",
      [doctorId]
    );

    // Get the count of pending appointments for the specific doctor
    const [pendingAppointments] = await db.query(
      'SELECT COUNT(*) AS pending_appointments FROM appointments WHERE status = "pending" AND doctor_id = ?',
      [doctorId]
    );

    const stats = {
      totalAppointments: totalAppointments[0].total_appointments, // Pending appointments only for this doctor
      activeDoctors: activeDoctors[0].active_doctors,
      totalPatients: totalPatients[0].total_patients,
      pendingAppointments: pendingAppointments[0].pending_appointments,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/weekly", async (req, res) => {
  try {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const [results] = await db.query(`
      SELECT 
        DAYNAME(appointment_date) AS day, 
        COUNT(*) AS count
      FROM appointments
      WHERE
        WEEK(appointment_date, 1) = WEEK(CURDATE(), 1) AND
        status = 'pending'
      GROUP BY day
      ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
    `);

    const data = daysOfWeek.map((day) => ({
      x: day,
      y: results.find((row) => row.day === day)?.count || 0,
    }));

    res.json({
      success: true,
      data: {
        id: "Appointments",
        color: "hsl(217, 70%, 50%)",
        data,
      },
    });
  } catch (error) {
    console.error("Error fetching weekly appointments:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Get remaining slots for a given schedule
router.get("/appointments/remaining/:schedule_id", async (req, res) => {
  try {
    const { schedule_id } = req.params;

    // Step 1: Get the max_patients for the given schedule
    const [schedule] = await db.execute(
      `SELECT max_patients FROM schedules WHERE id = ?`,
      [schedule_id]
    );

    if (!schedule || schedule.length === 0) {
      return res.status(400).json({ error: "Schedule not found" });
    }

    const maxPatients = schedule[0].max_patients;

    // Step 2: Get the total appointments from the schedule_appointments_count table
    const [scheduleCount] = await db.execute(
      `SELECT total_appointments FROM schedule_appointments_count WHERE schedule_id = ?`,
      [schedule_id]
    );

    if (!scheduleCount || scheduleCount.length === 0) {
      return res
        .status(400)
        .json({ error: "Appointment count not found for the schedule" });
    }

    const totalAppointments = scheduleCount[0].total_appointments;

    // Step 3: Get the total number of people in the queue for this schedule
    const [queueCount] = await db.execute(
      `SELECT COUNT(*) AS total_in_queue FROM queue WHERE appointment_id IN (SELECT id FROM appointments WHERE schedule_id = ? AND deleted_at IS NULL) AND status = 'waiting'`,
      [schedule_id]
    );

    const totalInQueue = queueCount[0].total_in_queue;

    // Step 4: Calculate the remaining slots
    const remainingSlots = maxPatients - totalAppointments - totalInQueue;

    // Step 5: Return the remaining slots
    res.json({
      schedule_id,
      remaining_slots: remainingSlots,
    });
  } catch (error) {
    console.error("Error fetching remaining slots:", error);
    res.status(500).json({ error: "Error fetching remaining slots" });
  }
});

// Get all appointments with details
router.get("/appointments", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        appointments.id AS appointment_id,
        appointments.status,
        appointments.purpose_of_appointment,
        appointments.appointment_date,
        users.id AS user_id,
        users.name AS user_name,
        users.email AS user_email,
        users.avatar AS user_avatar,
        users.address AS user_address,
        users.phone_number AS user_phone_number,
        doctors.id AS doctor_id,
        doctors.name AS doctor_name,
        doctors.specialization_id AS doctor_specialty_id,
        schedules.id AS schedule_id,
        schedules.schedule_date AS schedule_date
      FROM appointments
      INNER JOIN users ON appointments.user_id = users.id
      INNER JOIN doctors ON appointments.doctor_id = doctors.id
      INNER JOIN schedules ON appointments.schedule_id = schedules.id
      WHERE appointments.deleted_at IS NULL
    `);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No appointments found" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({ error: "Error fetching all appointments" });
  }
});

// Get appointments by user ID
router.get("/appointments/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const [rows] = await db.execute(
      `
      SELECT
        appointments.id AS appointment_id,
        appointments.status,
        appointments.purpose_of_appointment,
        appointments.appointment_date,
        doctors.id AS doctor_id,
        doctors.name AS doctor_name,
        doctors.specialization_id AS doctor_specialty_id,
        schedules.id AS schedule_id,
        schedules.schedule_date AS schedule_date
      FROM appointments
      INNER JOIN doctors ON appointments.doctor_id = doctors.id
      INNER JOIN schedules ON appointments.schedule_id = schedules.id
      WHERE appointments.user_id = ?
    `,
      [user_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No appointments found for this user" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error fetching appointments by user ID:", error);
    res.status(500).json({ error: "Error fetching appointments by user ID" });
  }
});

// Update remarks for an appointment and add vital signs and diagnosis
router.put("/appointments/:id/remarks", async (req, res) => {
  try {
    const { id } = req.params; // Appointment ID
    const { remarks, vitalSigns, diagnosis } = req.body;

    if (!remarks) {
      return res.status(400).json({ error: "Remarks field is required" });
    }

    // Update remarks in the appointments table
    const [result] = await db.execute(
      `UPDATE appointments 
       SET remarks = ? 
       WHERE id = ? AND deleted_at IS NULL`,
      [remarks, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Fetch the patient_id associated with the appointment
    const [appointment] = await db.execute(
      `SELECT patient_id FROM appointments WHERE id = ?`,
      [id]
    );

    if (appointment.length === 0) {
      return res
        .status(404)
        .json({ error: "Patient not found for this appointment" });
    }

    const patientId = appointment[0].patient_id;

    // Insert vital signs if provided
    if (vitalSigns) {
      const { height, weight, bp, blood_type, prescription } = vitalSigns;
      await db.execute(
        `INSERT INTO patient_vital_signs (patient_id, height, weight, bp, blood_type, prescription)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [patientId, height, weight, bp, blood_type, prescription]
      );
    }

    // Insert diagnosis if provided
    if (diagnosis) {
      const { diagnosisText, doctor_id } = diagnosis;
      await db.execute(
        `INSERT INTO patient_diagnosed (patient_id, diagnosis, doctor_id)
         VALUES (?, ?, ?)`,
        [patientId, diagnosisText, doctor_id]
      );
    }

    res.json({
      message: "Remarks, vital signs, and diagnosis updated successfully",
    });
  } catch (error) {
    console.error("Error updating remarks, vital signs, and diagnosis:", error);
    res
      .status(500)
      .json({ error: "Error updating remarks, vital signs, and diagnosis" });
  }
});

// Reject an appointment (Soft delete)
router.put("/appointments/:id/reject", async (req, res) => {
  try {
    const { id } = req.params; // Appointment ID

    // Update the appointment status to 'Rejected' and set 'deleted_at' to the current timestamp
    const [result] = await db.execute(
      `UPDATE appointments 
       SET status = 'Rejected', deleted_at = NOW()
       WHERE id = ? AND deleted_at IS NULL`, // Only update if it hasn't already been soft deleted
      [id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Appointment not found or already deleted" });
    }

    res.json({ message: "Appointment rejected and soft deleted successfully" });
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    res.status(500).json({ error: "Error rejecting appointment" });
  }
});

router.get("/appointments/:id/patient-details", async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        a.remarks,
        pvs.height,
        pvs.weight,
        pvs.bp,
        pvs.blood_type,
        pvs.prescription,
        pd.diagnosis,
        pd.created_at as diagnosis_date
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN patient_vital_signs pvs ON p.id = pvs.patient_id
      LEFT JOIN patient_diagnosed pd ON p.id = pd.patient_id
      WHERE a.id = ?
      ORDER BY pd.created_at DESC
      LIMIT 1
    `;

    const [results] = await db.execute(query, [id]);
    res.json(results[0] || {});
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({ error: "Failed to fetch patient details" });
  }
});

export default router;
