import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler, notFound } from './middlewares/errorHandler.js'
import contentRoutes from './routes/contentRoutes.js'
import auditRoutes from './routes/auditRoutes.js'

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  })
})

// API Routes
app.use('/api/content', contentRoutes)
app.use('/api/audit', auditRoutes)

// Error handling middleware (must be last)
app.use(notFound)
app.use(errorHandler)

export default app

