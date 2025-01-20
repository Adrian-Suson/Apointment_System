import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import upload from "../config/upload.js";
import { check, validationResult } from "express-validator";

const router = express.Router();

// Doctor login route
router.post(
  "/doctor/login",
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
      const [doctor] = await db.query("SELECT * FROM doctors WHERE email = ?", [
        email,
      ]);

      if (doctor.length === 0) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, doctor[0].password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        doctor: {
          id: doctor[0].id,
          name: doctor[0].name,
          email: doctor[0].email,
          avatar: doctor[0].avatar, // Added avatar
          birthdate: doctor[0].birthdate, // Added birthdate
          address: doctor[0].address, // Added address
          specialization_id: doctor[0].specialization_id, // Added specialization_id
          phone_number: doctor[0].phone_number, // Added phone_number
          status: doctor[0].status, // Added status
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
        (err, token) => {
          if (err) throw err;

          // Send both the token and the doctor info in the response
          res.json({
            token,
            doctor: {
              id: doctor[0].id,
              name: doctor[0].name,
              email: doctor[0].email,
              avatar: doctor[0].avatar, // Added avatar in the response
              birthdate: doctor[0].birthdate, // Added birthdate in the response
              address: doctor[0].address, // Added address in the response
              specialization_id: doctor[0].specialization_id, // Added specialization_id in the response
              phone_number: doctor[0].phone_number, // Added phone_number in the response
              status: doctor[0].status, // Added status in the response
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

// Doctor profile route
router.get("/doctor/profile/:doctorId", async (req, res) => {
  const { doctorId } = req.params;

  try {
    const [doctor] = await db.query(
      `SELECT d.*, ds.specialty_name, ds.description
       FROM doctors d
       LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.id
       WHERE d.id = ?`,
      [doctorId]
    );

    if (doctor.length === 0) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json(doctor[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Doctor profile update route
router.put("/doctor/profile/:doctorId", upload, async (req, res) => {
  const { doctorId } = req.params;
  const {
    name,
    email,
    password,
    birthdate,
    address,
    phone_number,
    status,
    specialization_id,
  } = req.body;

  try {
    const updateFields = {};

    // Check if each field is provided in the request and add it to the update object
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (birthdate) updateFields.birthdate = birthdate;
    if (address) updateFields.address = address;
    if (phone_number) updateFields.phone_number = phone_number;
    if (status) updateFields.status = status;
    if (specialization_id) updateFields.specialization_id = specialization_id;

    // Handle avatar file upload if it exists
    if (req.file) {
      const avatarFilename = req.file.filename; // Store only the filename (e.g., '1234567890.jpg')
      updateFields.avatar = avatarFilename; // Save only the filename in the database
    }

    // Password update logic
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Include the current timestamp for updated_at
    updateFields.updated_at = new Date();

    // Update the doctor profile in the database
    const [result] = await db.query("UPDATE doctors SET ? WHERE id = ?", [
      updateFields,
      doctorId,
    ]);

    // Check if the doctor was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json({ msg: "Profile updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Doctor registration route
router.post(
  "/doctor/register",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("birthdate", "Birthdate is required").notEmpty(),
    check("address", "Address is required").notEmpty(),
    check("specialization_id", "Specialization ID is required").notEmpty(),
    check("phone_number", "Phone number is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      birthdate,
      address,
      specialization_id,
      phone_number,
    } = req.body;

    try {
      // Check if the email already exists
      const [existingDoctor] = await db.query(
        "SELECT * FROM doctors WHERE email = ?",
        [email]
      );
      if (existingDoctor.length > 0) {
        return res.status(400).json({ msg: "Doctor already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert the doctor into the database
      const [result] = await db.query(
        "INSERT INTO doctors (name, email, password, birthdate, address, specialization_id, phone_number, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          email,
          hashedPassword,
          birthdate,
          address,
          specialization_id,
          phone_number,
          "active",
        ]
      );

      // Return the created doctor ID
      res.status(201).json({
        msg: "Doctor registered successfully",
        doctorId: result.insertId,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Get all doctors
router.get("/doctors", async (req, res) => {
  try {
    // Query to join doctors with their specialization name and specialization_id, and include active schedules
    const [doctors] = await db.query(`
      SELECT
        d.id,
        d.name,
        d.email,
        d.avatar,
        d.address,
        d.phone_number,
        d.birthdate,
        d.specialization_id AS specializationId,
        ds.specialty_name AS specialization,
        d.status,
        COUNT(s.id) AS active_schedule_count
      FROM doctors d
      LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.id
      LEFT JOIN schedules s ON d.id = s.doctor_id AND s.deleted_at IS NULL
      GROUP BY d.id, ds.specialty_name
    `);

    if (doctors.length === 0) {
      return res.status(404).json({ msg: "No doctors found" });
    }

    // Iterate over doctors and update their status based on active schedules
    for (let doctor of doctors) {
      if (doctor.active_schedule_count > 0 && doctor.status !== "active") {
        // If the doctor has active schedules but is not marked as active, update to 'active'
        await db.query(
          `
          UPDATE doctors
          SET status = 'active'
          WHERE id = ?
        `,
          [doctor.id]
        );

        // Update the local doctor object to reflect the status change
        doctor.status = "active";
      } else if (
        doctor.active_schedule_count === 0 &&
        doctor.status !== "inactive"
      ) {
        // If no active schedules and the doctor is not marked as inactive, update to 'inactive'
        await db.query(
          `
          UPDATE doctors
          SET status = 'inactive'
          WHERE id = ?
        `,
          [doctor.id]
        );

        // Update the local doctor object to reflect the status change
        doctor.status = "inactive";
      }
    }

    res.json(doctors); // Return the list of doctors with their specialization names and ids, including updated statuses
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get doctors by purpose
router.get("/doctors/purpose/:purposeId", async (req, res) => {
  const { purposeId } = req.params;

  try {
    // Query to find doctors by the purpose ID
    const query = `
      SELECT 
        doctors.id AS doctor_id,
        doctors.name AS doctor_name,
        doctors.email AS doctor_email,
        doctors.avatar AS doctor_avatar,
        doctors.phone_number,
        doctors.address,
        doctor_specialties.specialty_name
      FROM 
        doctors
      JOIN 
        doctor_specialties 
      ON 
        doctors.specialization_id = doctor_specialties.id
      JOIN 
        purposes 
      ON 
        purposes.specialty_id = doctor_specialties.id
      WHERE 
        purposes.id = ?;
    `;

    const [results] = await db.execute(query, [purposeId]);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No doctors found for the selected purpose" });
    }

    res.status(200).json({ doctors: results });
  } catch (error) {
    console.error("Error fetching doctors by purpose:", error);
    res.status(500).json({ error: "An error occurred while fetching doctors" });
  }
});

export default router;
