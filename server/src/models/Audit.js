import mongoose from 'mongoose'

/**
 * Audit Report model
 */
const auditSchema = new mongoose.Schema({
  storeUrl: {
    type: String,
    required: [true, 'Store URL is required'],
    trim: true
  },
  speedScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  issues: [{
    title: String,
    description: String,
    impact: String
  }],
  suggestions: [{
    title: String,
    description: String,
    potentialGain: String
  }]
}, {
  timestamps: true
})

// Index for faster queries
auditSchema.index({ storeUrl: 1, createdAt: -1 })

const Audit = mongoose.model('Audit', auditSchema)

export default Audit

