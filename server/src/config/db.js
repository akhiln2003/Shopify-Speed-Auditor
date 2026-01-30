import mongoose from 'mongoose'

/**
 * Database connection configuration
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI , {
      // Remove deprecated options for newer mongoose versions
    })
    
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('Database connection error:', error.message)
    process.exit(1)
  }
}

export default connectDB

