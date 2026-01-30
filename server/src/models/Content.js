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
      // Default features when DB is empty
      default: () => [
        {
          icon: '⚡',
          title: 'Speed Score (0-100)',
          description:
            "Get a comprehensive speed score that reflects your store's overall performance and user experience.",
        },
        {
          icon: '📱',
          title: 'Heavy Apps Detection',
          description:
            'Identify apps that are slowing down your store and impacting page load times.',
        },
        {
          icon: '🖼️',
          title: 'Image Optimization Check',
          description:
            "Discover unoptimized images that are affecting your store's performance and loading speed.",
        },
        {
          icon: '📊',
          title: 'Mobile Performance Insights',
          description:
            'Understand how your store performs on mobile devices, where most customers shop.',
        },
        {
          icon: '🔧',
          title: 'Simple Fix Suggestions',
          description:
            "Receive actionable recommendations that you can implement to improve your store's speed.",
        },
        {
          icon: '📈',
          title: 'Conversion Impact Analysis',
          description:
            'Learn how performance improvements can directly impact your conversion rates and sales.',
        },
      ],
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
      // Default pricing plans when DB is empty
      default: () => [
        {
          name: 'Free Plan',
          price: 0,
          features: [
            '1 speed audit per month',
            'Basic speed score',
            'Top 5 issues detected',
            'Email support',
          ],
          popular: false,
        },
        {
          name: 'Pro Plan',
          price: 29,
          features: [
            'Unlimited speed audits',
            'Comprehensive speed analysis',
            'All issues detected',
            'Priority support',
            'Historical tracking',
          ],
          popular: true,
        },
      ],
    },
  },
  {
    timestamps: true,
  },
)

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

