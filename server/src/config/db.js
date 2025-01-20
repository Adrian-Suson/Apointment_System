import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const db = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    console.log(`Connected to: ${dbConfig.database} at ${dbConfig.host}`);
    await connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed');
    console.error('Error details:', error.message);
    console.error('Config used:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });
    return false;
  }
};

// Test connection on initialization
testConnection();

export { testConnection };
export default db;