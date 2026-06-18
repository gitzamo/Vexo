const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

class User extends Model {
  async comparePassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password_hash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Simple text-based location for Phase 1 (city / locality / society name)
    location_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location_type: {
      type: DataTypes.ENUM('home', 'society_clubhouse', 'local_ground'),
      allowNull: true,
    },
    skill_level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: true,
      defaultValue: 'beginner',
    },
    role: {
      type: DataTypes.ENUM('user', 'organizer', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
      },
    },
  }
);

module.exports = User;
