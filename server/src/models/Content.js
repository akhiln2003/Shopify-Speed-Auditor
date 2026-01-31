import mongoose from 'mongoose'

/**
 * Content model for storing landing page content
 */
const contentSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: 'Speed Up Your Shopify Store. Sell More.',
    },
    heroSubtitle: {
      type: String,
      default:
        "Boost your store's performance and increase conversions with our comprehensive speed audit.",
    },
    features: {
      type: [
        {
          icon: String,
          title: String,
          description: String,
        },
      ],
      default: [],
    },
    pricing: {
      type: [
        {
          name: String,
          price: Number,
          features: [String],
          popular: Boolean,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

// Remove _id from subdocuments in arrays
contentSchema.pre('save', function(next) {
  if (this.features) {
    this.features.forEach(feature => {
      if (feature._id) {
        delete feature._id
      }
    })
  }
  if (this.pricing) {
    this.pricing.forEach(plan => {
      if (plan._id) {
        delete plan._id
      }
    })
  }
  next()
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

