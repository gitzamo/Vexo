const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class UserGamePreference extends Model {}

UserGamePreference.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    game_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    skill_level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
      defaultValue: 'beginner',
    },
  },
  {
    sequelize,
    modelName: 'UserGamePreference',
    tableName: 'user_game_preferences',
    indexes: [{ unique: true, fields: ['user_id', 'game_id'] }],
  }
);

module.exports = UserGamePreference;
