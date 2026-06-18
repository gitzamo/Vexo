const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { name, email, password, location_text, location_type, skill_level } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password_hash: password, // hashed automatically by model hook
      location_text,
      location_type,
      skill_level,
    });

    const token = generateToken(user.id, user.role);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location_text: user.location_text,
        skill_level: user.skill_level,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Something went wrong during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user.id, user.role);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location_text: user.location_text,
        skill_level: user.skill_level,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Something went wrong during login.' });
  }
};

const getMe = async (req, res) => {
  return res.json({ user: req.user });
};

module.exports = { register, login, getMe };
