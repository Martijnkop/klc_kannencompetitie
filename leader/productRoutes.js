const express = require('express');
const Product = require('./Product');
const router = express.Router();

// Get all products
router.get('/api/products', async (req, res) => {
  try {
    const connection = await req.pool.getConnection();
    
    const query = `
      SELECT product_id, product_name, multiplier 
      FROM products 
      ORDER BY product_name ASC
    `;
    
    const [rows] = await connection.query(query);
    connection.release();

    const products = rows.map(row => Product.fromRow(row));

    res.json({
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
router.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const connection = await req.pool.getConnection();
    
    const query = `
      SELECT product_id, product_name, multiplier 
      FROM products 
      WHERE product_id = ?
    `;
    
    const [rows] = await connection.query(query, [id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = Product.fromRow(rows[0]);
    res.json(product);

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit product multiplier
router.put('/api/products/:id/multiplier', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const { multiplier } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    if (multiplier === undefined || multiplier === null) {
      return res.status(400).json({ error: 'Missing required field: multiplier' });
    }

    if (isNaN(multiplier) || multiplier < 0 || multiplier > 127) {
      return res.status(400).json({ error: 'Multiplier must be a number between 0 and 127' });
    }

    const connection = await req.pool.getConnection();
    
    // Check if product exists
    const [checkRows] = await connection.query('SELECT product_id FROM products WHERE product_id = ?', [id]);
    
    if (checkRows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update multiplier
    const query = `
      UPDATE products 
      SET multiplier = ? 
      WHERE product_id = ?
    `;
    
    await connection.query(query, [multiplier, id]);
    
    // Get the updated product
    const [updatedRows] = await connection.query(
      'SELECT product_id, product_name, multiplier FROM products WHERE product_id = ?',
      [id]
    );
    connection.release();

    const product = Product.fromRow(updatedRows[0]);
    res.json({
      message: 'Multiplier updated successfully',
      product: product
    });

  } catch (error) {
    console.error('Error updating multiplier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
