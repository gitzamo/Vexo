const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const playRequestRoutes = require('./routes/playRequestRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vexo API is running.' });
});

// Seed route BEFORE admin routes so it doesn't get caught by admin router
app.post('/api/seed', async (req, res) => {
  try {
    const { Game, User } = require('./models');
    
    const games = [
      { name: 'Chess', category: 'indoor' },
      { name: 'Carrom', category: 'indoor' },
      { name: 'Cards', category: 'indoor' },
      { name: 'Table Tennis', category: 'indoor' },
      { name: 'Badminton', category: 'indoor' },
      { name: 'Football', category: 'outdoor' },
      { name: 'Cricket', category: 'outdoor' },
      { name: 'Basketball', category: 'outdoor' },
    ];

    for (const g of games) {
      await Game.findOrCreate({ where: { name: g.name }, defaults: g });
    }

    const [admin, created] = await User.findOrCreate({
      where: { email: 'admin@sportspartner.app' },
      defaults: {
        name: 'Platform Admin',
        password_hash: 'ChangeMe123!',
        role: 'admin',
      },
    });

    if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
    }

    res.json({ success: true, message: 'Seeding complete' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/play-requests', playRequestRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error.' });
});

module.exports = app;