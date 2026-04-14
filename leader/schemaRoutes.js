const express = require('express');
const router = express.Router();

// Get database schema for product_sales_simplified table
router.get('/api/schema', async (req, res) => {
  try {
    const connection = await req.pool.getConnection();
    
    // Query the INFORMATION_SCHEMA to get table structure
    const query = `
      SELECT 
        COLUMN_NAME as name,
        COLUMN_TYPE as type,
        IS_NULLABLE as nullable,
        COLUMN_KEY as \`key\`,
        EXTRA as \`extra\`
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'product_sales_simplified' 
        AND TABLE_SCHEMA = DATABASE()
      ORDER BY ORDINAL_POSITION
    `;
    
    const [columns] = await connection.query(query);
    connection.release();

    // Transform nullable values to boolean
    const schema = columns.map(col => ({
      name: col.name,
      type: col.type,
      nullable: col.nullable === 'YES',
      key: col.key || null,
      extra: col.extra || null
    }));

    res.json({
      table: 'product_sales_simplified',
      columns: schema
    });

  } catch (error) {
    console.error('Error fetching schema:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
