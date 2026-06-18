const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class PlayRequest extends Model {}

PlayRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    game_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    proposed_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    proposed_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PlayRequest',
    tableName: 'play_requests',
  }
);

module.exports = PlayRequest;
