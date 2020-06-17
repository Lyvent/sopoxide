import mongoose, { ConnectionOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

// Connect in-memory db.
const connect = async () => {
  const uri = await mongod.getConnectionString();

  const mongooseOpts: ConnectionOptions = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  }

  await mongoose.connect(uri, mongooseOpts);
}

// Close DB connection.
const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

// Clear data for DB connections.
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];

    // @ts-ignore
    await collection.deleteMany();
  }
}

export { connect, closeDB, clearDatabase };