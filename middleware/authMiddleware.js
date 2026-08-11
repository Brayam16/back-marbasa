const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'cambiame_por_un_secreto_mas_fuerte';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    const user = findUserById(payload.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  });
}

module.exports = {
  authenticateToken
};
