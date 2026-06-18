const { sequelize } = require('../config/db');
const User = require('./User');
const Game = require('./Game');
const UserGamePreference = require('./UserGamePreference');
const Availability = require('./Availability');
const PlayRequest = require('./PlayRequest');
const Community = require('./Community');
const CommunityMember = require('./CommunityMember');

// --- User <-> Game (many-to-many via UserGamePreference) ---
User.belongsToMany(Game, {
  through: UserGamePreference,
  foreignKey: 'user_id',
  otherKey: 'game_id',
  as: 'preferredGames',
});
Game.belongsToMany(User, {
  through: UserGamePreference,
  foreignKey: 'game_id',
  otherKey: 'user_id',
  as: 'players',
});
UserGamePreference.belongsTo(User, { foreignKey: 'user_id' });
UserGamePreference.belongsTo(Game, { foreignKey: 'game_id' });

// --- User -> Availability (one-to-many) ---
User.hasMany(Availability, { foreignKey: 'user_id', as: 'availability' });
Availability.belongsTo(User, { foreignKey: 'user_id' });

// --- PlayRequest relations ---
User.hasMany(PlayRequest, { foreignKey: 'sender_id', as: 'sentRequests' });
User.hasMany(PlayRequest, { foreignKey: 'receiver_id', as: 'receivedRequests' });
PlayRequest.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
PlayRequest.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });
PlayRequest.belongsTo(Game, { foreignKey: 'game_id', as: 'game' });
Game.hasMany(PlayRequest, { foreignKey: 'game_id' });

// --- Community relations ---
Community.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Community, { foreignKey: 'created_by', as: 'createdCommunities' });

Community.belongsToMany(User, {
  through: CommunityMember,
  foreignKey: 'community_id',
  otherKey: 'user_id',
  as: 'members',
});
User.belongsToMany(Community, {
  through: CommunityMember,
  foreignKey: 'user_id',
  otherKey: 'community_id',
  as: 'communities',
});
CommunityMember.belongsTo(User, { foreignKey: 'user_id' });
CommunityMember.belongsTo(Community, { foreignKey: 'community_id' });

module.exports = {
  sequelize,
  User,
  Game,
  UserGamePreference,
  Availability,
  PlayRequest,
  Community,
  CommunityMember,
};
