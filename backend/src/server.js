require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  // Sync models (creates tables if they don't exist).
  // For production, prefer migrations over sync({ alter: true }).
  await sequelize.sync();
  console.log('Database synced.');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
