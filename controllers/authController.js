const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'cambiame_por_un_secreto_mas_fuerte';
const jwtExpiry = '2h';

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword
  });

  await newUser.save();

  const token = jwt.sign({ userId: newUser._id.toString(), email: newUser.email }, JWT_SECRET, { expiresIn: jwtExpiry });

  res.status(201).json({ user: { id: newUser._id, name: newUser.name, email: newUser.email }, token });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: jwtExpiry });

  res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
}

module.exports = {
  register,
  login
};
