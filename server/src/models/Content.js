import mongoose from 'mongoose'

/**
 * Content model for storing landing page content
 */
const contentSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    default: 'Speed Up Your Shopify Store. Sell More.'
  },
  heroSubtitle: {
    type: String,
    default: 'Boost your store\'s performance and increase conversions with our comprehensive speed audit.'
  },
  features: [{
    icon: String,
    title: String,
    description: String
  }],
  pricing: [{
    name: String,
    price: Number,
    features: [String],
    popular: Boolean
  }]
}, {
  timestamps: true
})

// Ensure only one content document exists
contentSchema.statics.getContent = async function() {
  let content = await this.findOne()
  if (!content) {
    content = await this.create({})
  }
  return content
}

const Content = mongoose.model('Content', contentSchema)

export default Content

