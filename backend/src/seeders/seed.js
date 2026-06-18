require('dotenv').config();
const { sequelize, Game, User } = require('../models');

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

const seed = async () => {
  try {
    await sequelize.sync();

    for (const g of games) {
      await Game.findOrCreate({ where: { name: g.name }, defaults: g });
    }
    console.log(`Seeded ${games.length} games.`);

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
      console.log('Updated admin user role to admin.');
    } else {
      console.log(created ? 'Created admin user.' : 'Admin user already exists.');
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();