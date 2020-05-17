import mongoose, { ConnectionOptions } from 'mongoose';

const URI: string = process.env.DB_URI || 'mongodb://localhost/lyventdb';
const DBOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(URI, DBOptions);

const db = mongoose.connection;

// Handle connection events
db.on('error', console.error.bind(console, 'Connection Error: '));
db.once('open', () => {
  console.log('Connected to DB.');
});

export default db;
