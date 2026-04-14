const express = require('express');
const ProductSalesSimplified = require('./ProductSalesSimplified');
const router = express.Router();

// Helper function to upsert product
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

// Get all product sales since a specific date and time
router.get('/api/product-sales', async (req, res) => {
  try {
    const { since } = req.query;

    // Validate that 'since' parameter is provided
    if (!since) {
      return res.status(400).json({ error: 'Missing required parameter: since (datetime)' });
    }

    // Validate datetime format (ISO 8601)
    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      return res.status(400).json({ error: 'Invalid datetime format. Use ISO 8601 format (YYYY-MM-DDTHH:MM:SS or YYYY-MM-DD HH:MM:SS)' });
    }

    const connection = await req.pool.getConnection();
    
    // Query all rows where transaction_timestamp is >= since datetime
    const query = `
      SELECT product_name, product_id, product_amount, lid_naam 
      FROM sales 
      WHERE transaction_timestamp >= ? 
      ORDER BY transaction_timestamp DESC
    `;
    
    const [rows] = await connection.query(query, [sinceDate]);
    connection.release();

    // Convert rows to ProductSalesSimplified objects
    const products = rows.map(row => ProductSalesSimplified.fromRow(row));

    // Upsert products to the new database
    for (const product of products) {
      await upsertProduct(req.pool, product.product_id, product.product_name);
      await upsertUser(req.pool, product.lid_naam)
    }

    res.json({
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('Error fetching product sales:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
