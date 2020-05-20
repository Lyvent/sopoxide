import mongoose, { ConnectionOptions, Connection } from 'mongoose';
import logger from '../middleware/logger';

const URI: string = process.env.DB_URI || 'mongodb://localhost/lyventdb';
const DBOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async (): Promise<Connection> => {
  mongoose.connect(URI, DBOptions);

  // Prevent (node:101668) DeprecationWarning.
  mongoose.set('useCreateIndex', true);

  const db = mongoose.connection;

  // Handle connection events.
  db.on('error', err => logger.log('error', `DB Connection Error: \n${err}`));
  db.once('open', () => logger.log('info', 'Connected to DB.'));

  return db;
};

export default connectDB;
