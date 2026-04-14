require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const cors = require('cors')

const productSalesRoutes = require('./productSalesRoutes');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');
const groupRoutes = require('./groupRoutes');
const leaderboardRoutes = require('./leaderboardRoutes');
const schemaRoutes = require('./schemaRoutes');
const scheduler = require('./sync');

const app = express();

app.use(cors())

const port = process.env.PORT || 3000;

// Create a pool connection for the new database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Make pools available to routes
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Register routes
app.use(productSalesRoutes);
app.use(productRoutes);
app.use(userRoutes);
app.use(groupRoutes);
app.use(leaderboardRoutes);
app.use(schemaRoutes);

scheduler()

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Endpoints:`);
  console.log(`  GET /api/product-sales?since=YYYY-MM-DDTHH:MM:SS`);
  console.log(`  GET /api/products`);
  console.log(`  GET /api/products/:id`);
  console.log(`  PUT /api/products/:id/multiplier`);
  console.log(`  GET /api/users`);
  console.log(`  GET /api/users/:lid_naam`);
  console.log(`  POST /api/users`);
  console.log(`  PUT /api/users/:lid_naam/group`);
  console.log(`  GET /api/groups`);
  console.log(`  GET /api/groups/:id`);
  console.log(`  POST /api/groups`);
  console.log(`  GET /api/leaderboard/users?since=YYYY-MM-DDTHH:MM:SS&limit=100`);
  console.log(`  GET /api/leaderboard/groups?since=YYYY-MM-DDTHH:MM:SS&limit=100`);
  console.log(`  GET /api/schema`);
});
