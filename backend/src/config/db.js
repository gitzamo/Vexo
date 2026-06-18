const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // Production mode (Render uses DATABASE_URL)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      underscored: true,
      timestamps: true,
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' 
        ? { require: true, rejectUnauthorized: false } 
        : false,
    },
  });
} else {
  // Development mode (local with individual env vars)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      define: {
        underscored: true,
        timestamps: true,
      },
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Postgres connected successfully.');
  } catch (err) {
    console.error('Unable to connect to Postgres:', err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };