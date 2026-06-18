const { Game } = require('../models');

const listGames = async (req, res) => {
  try {
    const games = await Game.findAll({ where: { is_active: true }, order: [['name', 'ASC']] });
    return res.json({ games });
  } catch (err) {
    console.error('List games error:', err);
    return res.status(500).json({ message: 'Failed to fetch games.' });
  }
};

const createGame = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    if (!name || !category) {
      return res.status(400).json({ message: 'name and category are required.' });
    }
    const game = await Game.create({ name, category, description });
    return res.status(201).json({ game });
  } catch (err) {
    console.error('Create game error:', err);
    return res.status(500).json({ message: 'Failed to create game.' });
  }
};

const updateGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found.' });

    const { name, category, description, is_active } = req.body;
    if (name !== undefined) game.name = name;
    if (category !== undefined) game.category = category;
    if (description !== undefined) game.description = description;
    if (is_active !== undefined) game.is_active = is_active;

    await game.save();
    return res.json({ game });
  } catch (err) {
    console.error('Update game error:', err);
    return res.status(500).json({ message: 'Failed to update game.' });
  }
};

module.exports = { listGames, createGame, updateGame };
