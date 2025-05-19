const express = require('express');
const cors = require('cors');
const db = require('./db');

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const { authenticateJWT } = require('./middleware/auth'); 

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(authenticateJWT); // sets req.user if token is sent

// root route to confirm API is up
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// get all users
app.get('/users', async (req, res, next) => {
  try {
    const results = await db.query('SELECT id, username, email, created_at FROM users');
    return res.json(results.rows);
  } catch (err) {
    return next(err);
  }
});

app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);

// DEBUG: Log all registered routes (for finding bad paths)
console.log("Registered routes:");
app._router.stack
  .filter(r => r.route)
  .forEach(r => {
    console.log(r.route.path);
  });

module.exports = app;
