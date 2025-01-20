import bcrypt from 'bcrypt';
import db from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const createDefaultAdmin = async () => {
  try {
    const [admins] = await db.query('SELECT * FROM admins');

    if (admins.length === 0) {
      const defaultAdmin = {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123', // Change this to a more secure password
      };

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultAdmin.password, salt);

      await db.query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', [
        defaultAdmin.name,
        defaultAdmin.email,
        hashedPassword,
      ]);

      console.log('Default admin created successfully');
    } else {
      console.log('Admin already exists');
    }
  } catch (err) {
    console.error('Error creating default admin:', err.message);
  }
};

createDefaultAdmin();