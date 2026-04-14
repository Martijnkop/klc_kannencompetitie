const cron = require("node-cron")
const mysql = require('mysql2/promise');


// Create a pool connection for the readonly barboek database
const barboekPool = mysql.createPool({
  host: process.env.BARBOEK_HOST,
  user: process.env.BARBOEK_USER,
  password: process.env.BARBOEK_PASSWORD,
  database: process.env.BARBOEK_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create a pool connection for the new database
const destPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function upsertProduct(pool, productId, productName) {
  try {
    const connection = await pool.getConnection();
    
    // Check if product exists
    const [existingProduct] = await connection.query(
      'SELECT product_id FROM products WHERE product_id = ?',
      [productId]
    );
    
    // If product doesn't exist, insert it with default multiplier of 1
    if (existingProduct.length === 0) {
      await connection.query(
        'INSERT INTO products (product_id, product_name, multiplier) VALUES (?, ?, ?)',
        [productId, productName, 1]
      );
    }
    
    connection.release();
  } catch (error) {
    console.error('Error upserting product:', error);
  }
}

async function upsertUser(pool, username) {
  try {
    console.log(username)
    const connection = await pool.getConnection();
    
    // Check if product exists
    const [existingUser] = await connection.query(
      'SELECT lid_naam FROM users WHERE lid_naam = ?',
      [username]
    );
    
    // If product doesn't exist, insert it with default multiplier of 1
    if (existingUser.length === 0) {
      await connection.query(
        'INSERT INTO users (lid_naam, group_id) VALUES (?, ?)',
        [username, null]
      );
    }
    
    connection.release();
  } catch (error) {
    console.error('Error upserting user:', error);
  }
}

async function syncData() {
console.log(`[${new Date().toISOString()}] Starting sync...`);

  try {
    // 1. Fetch from source
    const [rows] = await barboekPool.query(
        `SELECT *
        FROM product_sales_simplified
        WHERE transaction_timestamp >= ?
        `, [Date.parse(process.env.START_DATE)]);

    if (rows.length === 0) {
      console.log("No data to sync.");
      return;
    }

    // 2. Upsert into destination
    // INSERT ... ON DUPLICATE KEY UPDATE handles re-runs safely
    const values = rows.map((r) => [`${r.lid_naam}${r.transaction_timestamp}`,r.product_name, r.product_id, r.product_amount, r.lid_naam, r.transaction_timestamp]);

    for (const value of values) {
        const connection = await destPool.getConnection()
        await connection.query(
        `INSERT INTO sales (id, product_name, product_id, product_amount, lid_naam, transaction_timestamp)
        VALUES ?
        ON DUPLICATE KEY UPDATE
            id = VALUES(id),
            product_name = VALUES(product_name),
            product_id = VALUES(product_id),
            lid_naam = VALUES(lid_naam),
            transaction_timestamp = VALUES(transaction_timestamp)`,
            
        [values]
        );
        connection.release();

        await upsertProduct(destPool, value[2], value[1]);
        await upsertUser(destPool, value[4])
    }

    console.log(`Synced ${rows.length} rows.`);
  } catch (err) {
    console.error("Sync failed:", err.message);
  }
}

function schedule() {
    cron.schedule("* * * * *", syncData)
    syncData()
}

module.exports = schedule