import mongoose, { ConnectionOptions, Connection } from 'mongoose';

const URI: string = process.env.DB_URI || 'mongodb://localhost/lyventdb';
const DBOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async (): Promise<Connection> => {
  mongoose.connect(URI, DBOptions);

  const db = mongoose.connection;

  // Handle connection events.
  db.on('error', console.error.bind(console, 'Connection Error: '));
  db.once('open', () => {
    console.log('Connected to DB.');
  });

  return db;
};

export default connectDB;
