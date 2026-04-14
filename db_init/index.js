const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
const init = (async () => {
  try {
    console.log("Starting db initialization")
    const connection = await pool.getConnection();

    // SQL statements for creating tables
    const initStatements = [
      // Create products table
      `CREATE TABLE IF NOT EXISTS products (
        product_id INT PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        multiplier DECIMAL(3,0) DEFAULT 1 NOT NULL CHECK (multiplier >= 0 AND multiplier <= 127)
      )`,
      // Create groups table
      `CREATE TABLE IF NOT EXISTS klc_groups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      )`,
      // Create users table
      `CREATE TABLE IF NOT EXISTS users (
        lid_naam VARCHAR(255) PRIMARY KEY,
        group_id INT,
        FOREIGN KEY (group_id) REFERENCES klc_groups(id) ON DELETE SET NULL
      )`,
      `CREATE TABLE IF NOT EXISTS sales (
        id VARCHAR(255) PRIMARY KEY,
        product_name VARCHAR(100), 
        product_id INT,
        product_amount INT,
        lid_naam VARCHAR(255),
        transaction_timestamp DATETIME 
      )`
    ];

    const results = [];

    for (const statement of initStatements) {
      try {
        await connection.query(statement);
        results.push({
          status: 'success',
          statement: statement.substring(0, 50) + '...'
        });
      } catch (error) {
        results.push({
          status: 'error',
          statement: statement.substring(0, 50) + '...',
          error: error.message
        });
      }
    }

    connection.release();
    console.log("Finished db initialization")


  } catch (error) {
    console.error('Error during initialization:', error);
  } finally {
    await pool.end()
  }
})

init()