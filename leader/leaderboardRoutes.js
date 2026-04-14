const express = require('express');
const router = express.Router();

// Get user leaderboard since a specific date
router.get('/api/leaderboard/users', async (req, res) => {
  try {
    const { since, limit = 100 } = req.query;

    // Validate that 'since' parameter is provided
    if (!since) {
      return res.status(400).json({ error: 'Missing required parameter: since (datetime)' });
    }

    // Validate datetime format (ISO 8601)
    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      return res.status(400).json({ error: 'Invalid datetime format. Use ISO 8601 format (YYYY-MM-DDTHH:MM:SS or YYYY-MM-DD HH:MM:SS)' });
    }

    // Validate limit
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({ error: 'Limit must be a positive number' });
    }

    const connection = await req.pool.getConnection();
    
    // Query to calculate user scores
    const query = `
      SELECT 
        pss.lid_naam,
        SUM(pss.product_amount * COALESCE(p.multiplier, 1)) as score,
        COUNT(DISTINCT pss.product_id) as product_variety,
        SUM(pss.product_amount) as total_items
      FROM sales pss
      LEFT JOIN ${process.env.DB_NAME}.products p ON pss.product_id = p.product_id
      WHERE pss.transaction_timestamp >= ? AND pss.lid_naam IS NOT NULL AND pss.lid_naam != ''
      GROUP BY pss.lid_naam
      ORDER BY score DESC
      LIMIT ?
    `;
    
    const [rows] = await connection.query(query, [sinceDate, parsedLimit]);
    connection.release();

    const leaderboard = rows.map((row, index) => ({
      rank: index + 1,
      lid_naam: row.lid_naam,
      score: parseFloat(row.score),
      product_variety: row.product_variety,
      total_items: parseFloat(row.total_items)
    }));

    res.json({
      type: 'user',
      since: sinceDate.toISOString(),
      count: leaderboard.length,
      data: leaderboard
    });

  } catch (error) {
    console.error('Error fetching user leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get group leaderboard since a specific date
router.get('/api/leaderboard/groups', async (req, res) => {
  try {
    const { since, limit = 100 } = req.query;

    // Validate that 'since' parameter is provided
    if (!since) {
      return res.status(400).json({ error: 'Missing required parameter: since (datetime)' });
    }

    // Validate datetime format (ISO 8601)
    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      return res.status(400).json({ error: 'Invalid datetime format. Use ISO 8601 format (YYYY-MM-DDTHH:MM:SS or YYYY-MM-DD HH:MM:SS)' });
    }

    // Validate limit
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({ error: 'Limit must be a positive number' });
    }

    const connection = await req.pool.getConnection();
    
    // Query to calculate group scores
    const query = `
      SELECT 
        COALESCE(u.group_id, 0) as group_id,
        COALESCE(g.name, 'Unassigned') as group_name,
        SUM(pss.product_amount * COALESCE(p.multiplier, 1)) as score,
        COUNT(DISTINCT pss.product_id) as product_variety,
        SUM(pss.product_amount) as total_items,
        COUNT(DISTINCT pss.lid_naam) as member_count
      FROM sales pss
      LEFT JOIN ${process.env.DB_NAME}.users u ON pss.lid_naam = u.lid_naam
      LEFT JOIN ${process.env.DB_NAME}.klc_groups g ON u.group_id = g.id
      LEFT JOIN ${process.env.DB_NAME}.products p ON pss.product_id = p.product_id
      WHERE pss.transaction_timestamp >= ? AND pss.lid_naam IS NOT NULL AND pss.lid_naam != ''
      GROUP BY COALESCE(u.group_id, 0), COALESCE(g.name, 'Unassigned')
      ORDER BY score DESC
      LIMIT ?
    `;
    
    const [rows] = await connection.query(query, [sinceDate, parsedLimit]);
    connection.release();

    const leaderboard = rows.map((row, index) => ({
      rank: index + 1,
      group_id: row.group_id === 0 ? null : row.group_id,
      group_name: row.group_name,
      score: parseFloat(row.score),
      product_variety: row.product_variety,
      total_items: parseFloat(row.total_items),
      member_count: row.member_count
    }));

    res.json({
      type: 'group',
      since: sinceDate.toISOString(),
      count: leaderboard.length,
      data: leaderboard
    });

  } catch (error) {
    console.error('Error fetching group leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
