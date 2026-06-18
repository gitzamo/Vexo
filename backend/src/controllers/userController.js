const { Op } = require('sequelize');
const { User, Game, UserGamePreference, Availability, PlayRequest } = require('../models');

// Update own profile (basic fields)
const updateProfile = async (req, res) => {
  try {
    const { name, location_text, location_type, skill_level } = req.body;
    const user = req.user;

    if (name !== undefined) user.name = name;
    if (location_text !== undefined) user.location_text = location_text;
    if (location_type !== undefined) user.location_type = location_type;
    if (skill_level !== undefined) user.skill_level = skill_level;

    await user.save();
    return res.json({ user });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
};

// Set/replace preferred games for the logged-in user
const setPreferredGames = async (req, res) => {
  try {
    const { games } = req.body; // [{ game_id, skill_level }]
    if (!Array.isArray(games)) {
      return res.status(400).json({ message: 'games must be an array.' });
    }

    await UserGamePreference.destroy({ where: { user_id: req.user.id } });

    const created = await Promise.all(
      games.map((g) =>
        UserGamePreference.create({
          user_id: req.user.id,
          game_id: g.game_id,
          skill_level: g.skill_level || 'beginner',
        })
      )
    );

    return res.status(200).json({ preferences: created });
  } catch (err) {
    console.error('Set preferred games error:', err);
    return res.status(500).json({ message: 'Failed to set preferred games.' });
  }
};

// Set/replace availability slots for the logged-in user
const setAvailability = async (req, res) => {
  try {
    const { slots } = req.body; // [{ day_of_week, start_time, end_time }]
    if (!Array.isArray(slots)) {
      return res.status(400).json({ message: 'slots must be an array.' });
    }

    await Availability.destroy({ where: { user_id: req.user.id } });

    const created = await Promise.all(
      slots.map((s) =>
        Availability.create({
          user_id: req.user.id,
          day_of_week: s.day_of_week,
          start_time: s.start_time,
          end_time: s.end_time,
        })
      )
    );

    return res.status(200).json({ availability: created });
  } catch (err) {
    console.error('Set availability error:', err);
    return res.status(500).json({ message: 'Failed to set availability.' });
  }
};

// Get a single user's full public profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Game, as: 'preferredGames', through: { attributes: ['skill_level'] } },
        { model: Availability, as: 'availability' },
      ],
    });

    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user });
  } catch (err) {
    console.error('Get user profile error:', err);
    return res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
};

// Search nearby players by game type, location text, and skill level
const searchPlayers = async (req, res) => {
  try {
    const { game_id, location, skill_level } = req.query;

    const userWhere = { id: { [Op.ne]: req.user.id }, is_active: true };
    if (location) {
      userWhere.location_text = { [Op.iLike]: `%${location}%` };
    }
    if (skill_level) {
      userWhere.skill_level = skill_level;
    }

    const gameInclude = {
      model: Game,
      as: 'preferredGames',
      through: { attributes: ['skill_level'] },
    };
    if (game_id) {
      gameInclude.where = { id: game_id };
    }

    const players = await User.findAll({
      where: userWhere,
      attributes: { exclude: ['password_hash'] },
      include: [gameInclude, { model: Availability, as: 'availability' }],
    });

    return res.json({ count: players.length, players });
  } catch (err) {
    console.error('Search players error:', err);
    return res.status(500).json({ message: 'Failed to search players.' });
  }
};

// View own match/play history (all requests sent or received, accepted/completed)
const getMatchHistory = async (req, res) => {
  try {
    const requests = await PlayRequest.findAll({
      where: {
        [Op.or]: [{ sender_id: req.user.id }, { receiver_id: req.user.id }],
      },
      include: [
        { model: Game, as: 'game' },
        { model: User, as: 'sender', attributes: ['id', 'name', 'location_text'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'location_text'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json({ requests });
  } catch (err) {
    console.error('Get match history error:', err);
    return res.status(500).json({ message: 'Failed to fetch match history.' });
  }
};

module.exports = {
  updateProfile,
  setPreferredGames,
  setAvailability,
  getUserProfile,
  searchPlayers,
  getMatchHistory,
};
