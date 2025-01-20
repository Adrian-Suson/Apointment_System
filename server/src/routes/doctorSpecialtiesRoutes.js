// routes/doctor_specialties.js

import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// --------------------------------------------------------
// Endpoint to get all doctor specialties
router.get('/doctor-specialties', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM doctor_specialties');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --------------------------------------------------------
// Endpoint to get a single doctor specialty by ID
router.get('/doctor-specialties/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.execute('SELECT * FROM doctor_specialties WHERE id = ?', [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Specialty not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --------------------------------------------------------
// Endpoint to add a new doctor specialty
router.post('/doctor-specialties', async (req, res) => {
  const { specialty_name, description } = req.body;

  if (!specialty_name) {
    return res.status(400).json({ message: 'specialty_name is required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO doctor_specialties (specialty_name, description) VALUES (?, ?)',
      [specialty_name, description || null]
    );
    res.status(201).json({ id: result.insertId, specialty_name, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --------------------------------------------------------
// Endpoint to update an existing doctor specialty
router.put('/doctor-specialties/:id', async (req, res) => {
  const { id } = req.params;
  const { specialty_name, description } = req.body;

  if (!specialty_name) {
    return res.status(400).json({ message: 'specialty_name is required' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE doctor_specialties SET specialty_name = ?, description = ? WHERE id = ?',
      [specialty_name, description || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Specialty not found' });
    }

    res.json({ message: 'Specialty updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --------------------------------------------------------
// Endpoint to delete a doctor specialty
router.delete('/doctor-specialties/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM doctor_specialties WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Specialty not found' });
    }

    res.json({ message: 'Specialty deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
