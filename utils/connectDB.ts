import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

const connectDB = async () => {
  // if we already have a connection to db, return since there is no need to create a new one
  if (connection.isConnected) {
    console.log('using existing db connection');
    return;
  }

  // create a new db connection -> returns reference to db
  const db = await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  connection.isConnected = db.connections[0].readyState;
  console.log('connected to db');
};

export default connectDB;
