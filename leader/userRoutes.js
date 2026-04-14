const express = require('express');
const User = require('./User');
const router = express.Router();

// Get all users
router.get('/api/users', async (req, res) => {
  try {
    const connection = await req.pool.getConnection();
    
    const query = `
      SELECT lid_naam, group_id 
      FROM users 
      ORDER BY lid_naam ASC
    `;
    
    const [rows] = await connection.query(query);
    connection.release();

    const users = rows.map(row => User.fromRow(row));

    res.json({
      count: users.length,
      data: users
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by lid_naam
router.get('/api/users/:lid_naam', async (req, res) => {
  try {
    const { lid_naam } = req.params;

    if (!lid_naam) {
      return res.status(400).json({ error: 'Invalid user identifier' });
    }

    const connection = await req.pool.getConnection();
    
    const query = `
      SELECT lid_naam, group_id 
      FROM users 
      WHERE lid_naam = ?
    `;
    
    const [rows] = await connection.query(query, [lid_naam]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = User.fromRow(rows[0]);
    res.json(user);

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user
router.post('/api/users', express.json(), async (req, res) => {
  try {
    const { lid_naam, group_id } = req.body;

    if (!lid_naam) {
      return res.status(400).json({ error: 'Missing required field: lid_naam' });
    }

    if (typeof lid_naam !== 'string' || lid_naam.trim() === '') {
      return res.status(400).json({ error: 'lid_naam must be a non-empty string' });
    }

    const connection = await req.pool.getConnection();
    
    // Check if user already exists
    const [existingUsers] = await connection.query(
      'SELECT lid_naam FROM users WHERE lid_naam = ?',
      [lid_naam]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return res.status(409).json({ error: 'User already exists' });
    }

    // Insert new user
    const query = `
      INSERT INTO users (lid_naam, group_id) 
      VALUES (?, ?)
    `;
    
    await connection.query(query, [lid_naam, group_id || null]);
    
    // Get the created user
    const [insertedRows] = await connection.query(
      'SELECT lid_naam, group_id FROM users WHERE lid_naam = ?',
      [lid_naam]
    );
    connection.release();

    const user = User.fromRow(insertedRows[0]);
    res.status(201).json({
      message: 'User created successfully',
      user: user
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Assign user to group
router.put('/api/users/:lid_naam/group', express.json(), async (req, res) => {
  try {
    const { lid_naam } = req.params;
    const { group_id } = req.body;

    if (!lid_naam) {
      return res.status(400).json({ error: 'Invalid user identifier' });
    }

    if (group_id === undefined || group_id === null) {
      return res.status(400).json({ error: 'Missing required field: group_id' });
    }

    const connection = await req.pool.getConnection();
    
    // Check if user exists
    const [userRows] = await connection.query(
      'SELECT lid_naam FROM users WHERE lid_naam = ?',
      [lid_naam]
    );
    
    if (userRows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if group exists
    const [groupRows] = await connection.query(
      'SELECT id FROM groups WHERE id = ?',
      [group_id]
    );

    if (groupRows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Group not found' });
    }

    // Update user's group
    const query = `
      UPDATE users 
      SET group_id = ? 
      WHERE lid_naam = ?
    `;
    
    await connection.query(query, [group_id, lid_naam]);
    
    // Get the updated user
    const [updatedRows] = await connection.query(
      'SELECT lid_naam, group_id FROM users WHERE lid_naam = ?',
      [lid_naam]
    );
    connection.release();

    const user = User.fromRow(updatedRows[0]);
    res.json({
      message: 'User assigned to group successfully',
      user: user
    });

  } catch (error) {
    console.error('Error assigning user to group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
