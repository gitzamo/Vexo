const { PlayRequest, User, Game } = require('../models');

const sendRequest = async (req, res) => {
  try {
    const { receiver_id, game_id, proposed_location, proposed_time, message } = req.body;

    if (!receiver_id || !game_id) {
      return res.status(400).json({ message: 'receiver_id and game_id are required.' });
    }
    if (receiver_id === req.user.id) {
      return res.status(400).json({ message: 'You cannot send a play request to yourself.' });
    }

    const receiver = await User.findByPk(receiver_id);
    if (!receiver) return res.status(404).json({ message: 'Receiver not found.' });

    const game = await Game.findByPk(game_id);
    if (!game) return res.status(404).json({ message: 'Game not found.' });

    const request = await PlayRequest.create({
      sender_id: req.user.id,
      receiver_id,
      game_id,
      proposed_location,
      proposed_time,
      message,
      status: 'pending',
    });

    return res.status(201).json({ request });
  } catch (err) {
    console.error('Send request error:', err);
    return res.status(500).json({ message: 'Failed to send play request.' });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' | 'declined' | 'cancelled' | 'completed'
    const allowed = ['accepted', 'declined', 'cancelled', 'completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    const request = await PlayRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: 'Play request not found.' });

    const isReceiver = request.receiver_id === req.user.id;
    const isSender = request.sender_id === req.user.id;

    if (!isReceiver && !isSender) {
      return res.status(403).json({ message: 'You are not part of this play request.' });
    }
    // Only the receiver can accept/decline; either party can cancel a pending request.
    if ((status === 'accepted' || status === 'declined') && !isReceiver) {
      return res.status(403).json({ message: 'Only the receiver can accept or decline a request.' });
    }
    if (status === 'cancelled' && request.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled.' });
    }

    request.status = status;
    await request.save();

    return res.json({ request });
  } catch (err) {
    console.error('Respond to request error:', err);
    return res.status(500).json({ message: 'Failed to update play request.' });
  }
};

const listMyRequests = async (req, res) => {
  try {
    const { type } = req.query; // 'sent' | 'received' | undefined (both)
    const where = {};
    if (type === 'sent') where.sender_id = req.user.id;
    else if (type === 'received') where.receiver_id = req.user.id;

    const requests = await PlayRequest.findAll({
      where,
      include: [
        { model: Game, as: 'game' },
        { model: User, as: 'sender', attributes: ['id', 'name', 'location_text'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'location_text'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const filtered = type
      ? requests
      : requests.filter(
          (r) => r.sender_id === req.user.id || r.receiver_id === req.user.id
        );

    return res.json({ requests: filtered });
  } catch (err) {
    console.error('List requests error:', err);
    return res.status(500).json({ message: 'Failed to fetch play requests.' });
  }
};

module.exports = { sendRequest, respondToRequest, listMyRequests };
