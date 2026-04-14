const express = require('express');
const Group = require('./Group');
const router = express.Router();

// Get all groups
router.get('/api/groups', async (req, res) => {
  try {
    const connection = await req.pool.getConnection();
    
    const query = `
      SELECT id, name 
      FROM klc_groups 
      ORDER BY name ASC
    `;
    
    const [rows] = await connection.query(query);
    connection.release();

    const groups = rows.map(row => Group.fromRow(row));

    res.json({
      count: groups.length,
      data: groups
    });

  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get group by ID
router.get('/api/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }

    const connection = await req.pool.getConnection();
    
    const query = `
      SELECT id, name 
      FROM klc_groups 
      WHERE id = ?
    `;
    
    const [rows] = await connection.query(query, [id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const group = Group.fromRow(rows[0]);
    res.json(group);

  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create group
router.post('/api/groups', express.json(), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'name must be a non-empty string' });
    }

    const connection = await req.pool.getConnection();
    
    // Check if group with same name already exists
    const [existingGroups] = await connection.query(
      'SELECT id FROM klc_groups WHERE name = ?',
      [name]
    );

    if (existingGroups.length > 0) {
      connection.release();
      return res.status(409).json({ error: 'Group already exists' });
    }

    // Insert new group
    const query = `
      INSERT INTO klc_groups (name) 
      VALUES (?)
    `;
    
    const [result] = await connection.query(query, [name]);
    const groupId = result.insertId;
    
    // Get the created group
    const [insertedRows] = await connection.query(
      'SELECT id, name FROM klc_groups WHERE id = ?',
      [groupId]
    );
    connection.release();

    const group = Group.fromRow(insertedRows[0]);
    res.status(201).json({
      message: 'Group created successfully',
      group: group
    });

  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
