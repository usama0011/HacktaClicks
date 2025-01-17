import mongoose from "mongoose";
//db
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://za5232208:za5232208@cluster0.ya4tk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
