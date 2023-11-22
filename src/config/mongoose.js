import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://adminuser:1z61K4f0YDHvdduU@cluster0.3yv1h.mongodb.net/nfc-solutions?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
