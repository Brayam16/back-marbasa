const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

function connectDb() {
  if (!mongoUri) {
    throw new Error('MONGO_URI no está definido en el entorno');
  }

  return mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

module.exports = connectDb;
