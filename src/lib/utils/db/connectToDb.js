import mongoose from "mongoose"

export const connectToDb = async () => {
  if (mongoose.connection.readyState) {
    console.log("Using existing connection to", mongoose.connection.name)
    return
  }
  try {
    await mongoose.connect(process.env.MONGO)
    console.log("Connected to database:", mongoose.connection.name)
  } catch (error) {
    throw new Error("Failed to connect to the database")
  }
}
