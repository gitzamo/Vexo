const { User, PlayRequest, Game } = require('../models');

const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password_hash'] } });
    return res.json({ users });
  } catch (err) {
    console.error('Admin list users error:', err);
    return res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

const setUserActiveStatus = async (req, res) => {
  try {
    const { is_active } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.is_active = !!is_active;
    await user.save();
    return res.json({ user });
  } catch (err) {
    console.error('Admin set user status error:', err);
    return res.status(500).json({ message: 'Failed to update user status.' });
  }
};

const platformStats = async (req, res) => {
  try {
    const [userCount, activeUserCount, gameCount, requestCount, acceptedCount] =
      await Promise.all([
        User.count(),
        User.count({ where: { is_active: true } }),
        Game.count({ where: { is_active: true } }),
        PlayRequest.count(),
        PlayRequest.count({ where: { status: 'accepted' } }),
      ]);

    return res.json({
      registered_users: userCount,
      active_users: activeUserCount,
      active_games: gameCount,
      total_play_requests: requestCount,
      accepted_requests: acceptedCount,
      success_rate:
        requestCount > 0 ? Number((acceptedCount / requestCount).toFixed(2)) : 0,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ message: 'Failed to compute platform stats.' });
  }
};

const setUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be user, organizer, or admin.' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.role = role;
    await user.save();
    return res.json({ user });
  } catch (err) {
    console.error('Admin set user role error:', err);
    return res.status(500).json({ message: 'Failed to update user role.' });
  }
};

module.exports = { listUsers, setUserActiveStatus, platformStats, setUserRole };
