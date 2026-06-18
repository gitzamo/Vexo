const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class CommunityMember extends Model {}

CommunityMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    community_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('member', 'organizer'),
      allowNull: false,
      defaultValue: 'member',
    },
  },
  {
    sequelize,
    modelName: 'CommunityMember',
    tableName: 'community_members',
    indexes: [{ unique: true, fields: ['community_id', 'user_id'] }],
  }
);

module.exports = CommunityMember;
