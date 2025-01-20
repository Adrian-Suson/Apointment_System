import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// --------------------------------------------------------
// Endpoint to get purposes based on specialty ID
router.get('/purposes/:specialtyId', async (req, res) => {
  const specialtyId = req.params.specialtyId;

  try {
    const [results] = await db.execute(`
      SELECT purposes.id, purposes.purpose_name, doctor_specialties.specialty_name
      FROM purposes
      JOIN doctor_specialties ON purposes.specialty_id = doctor_specialties.id
      WHERE purposes.specialty_id = ?
    `, [specialtyId]);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --------------------------------------------------------
// Endpoint to add a new purpose
router.post('/purposes', async (req, res) => {
  const { specialty_id, purpose_name } = req.body;

  if (!specialty_id || !purpose_name) {
    return res.status(400).json({ message: 'specialty_id and purpose_name are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO purposes (specialty_id, purpose_name) VALUES (?, ?)',
      [specialty_id, purpose_name]
    );
    res.status(201).json({ id: result.insertId, specialty_id, purpose_name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --------------------------------------------------------
// Endpoint to update an existing purpose
router.put('/purposes/:id', async (req, res) => {
  const { id } = req.params;
  const { purpose_name } = req.body;

  if (!purpose_name) {
    return res.status(400).json({ message: 'purpose_name is required' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE purposes SET purpose_name = ? WHERE id = ?',
      [purpose_name, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Purpose not found' });
    }

    res.json({ message: 'Purpose updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --------------------------------------------------------
// Endpoint to delete a purpose
router.delete('/purposes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM purposes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Purpose not found' });
    }

    res.json({ message: 'Purpose deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --------------------------------------------------------
// Endpoint to get all purposes
router.get('/purposes', async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT p.id, p.purpose_name 
      FROM purposes p
      JOIN doctor_specialties ds ON p.specialty_id = ds.id
      JOIN doctors d ON ds.id = d.specialization_id
      WHERE d.status = 'active'; -- Optional: Only include active doctors
    `;

    const [results] = await db.execute(query);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching purposes:', error);
    res.status(500).json({ error: 'An error occurred while fetching purposes' });
  }
});


export default router;
