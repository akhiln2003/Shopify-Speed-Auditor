import Content from '../models/Content.js'

// Default seed data
const DEFAULT_FEATURES = [
  {
    icon: '⚡',
    title: 'Speed Score (0-100)',
    description: 'Get a comprehensive speed score that reflects your store\'s overall performance and user experience.'
  },
  {
    icon: '📱',
    title: 'Heavy Apps Detection',
    description: 'Identify apps that are slowing down your store and impacting page load times.'
  },
  {
    icon: '🖼️',
    title: 'Image Optimization Check',
    description: 'Discover unoptimized images that are affecting your store\'s performance and loading speed.'
  },
  {
    icon: '📊',
    title: 'Mobile Performance Insights',
    description: 'Understand how your store performs on mobile devices, where most customers shop.'
  },
  {
    icon: '🔧',
    title: 'Simple Fix Suggestions',
    description: 'Receive actionable recommendations that you can implement to improve your store\'s speed.'
  },
  {
    icon: '📈',
    title: 'Conversion Impact Analysis',
    description: 'Learn how performance improvements can directly impact your conversion rates and sales.'
  }
]

const DEFAULT_PRICING = [
  {
    name: 'Free Plan',
    price: 0,
    features: [
      '1 speed audit per month',
      'Basic speed score',
      'Top 5 issues detected',
      'Email support'
    ],
    popular: false
  },
  {
    name: 'Pro Plan',
    price: 29,
    features: [
      'Unlimited speed audits',
      'Comprehensive speed analysis',
      'All issues detected',
      'Priority support',
      'Historical tracking'
    ],
    popular: true
  }
]

/**
 * Get content
 * GET /api/content
 */
export const getContent = async (req, res, next) => {
  try {
    let content = await Content.findOne()
    
    // If no content exists and both features and pricing are empty, seed with defaults
    if (!content) {
      content = await Content.create({
        features: DEFAULT_FEATURES,
        pricing: DEFAULT_PRICING
      })
    } else if ((!content.features || content.features.length === 0) && 
               (!content.pricing || content.pricing.length === 0)) {
      // If content exists but is empty, add default data
      content.features = DEFAULT_FEATURES
      content.pricing = DEFAULT_PRICING
      await content.save()
    }
    
    res.status(200).json({
      success: true,
      data: content
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update content
 * PUT /api/content
 */
export const updateContent = async (req, res, next) => {
  try {
    const { heroTitle, heroSubtitle, features, pricing } = req.body
    
    let content = await Content.findOne()
    
    if (!content) {
      content = new Content({
        heroTitle,
        heroSubtitle,
        features,
        pricing
      })
    } else {
      if (heroTitle !== undefined) content.heroTitle = heroTitle
      if (heroSubtitle !== undefined) content.heroSubtitle = heroSubtitle
      if (features !== undefined) content.features = features
      if (pricing !== undefined) content.pricing = pricing
    }
    
    await content.save()
    
    res.status(200).json({
      success: true,
      data: content
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Add a feature to content
 * POST /api/content/feature
 */
export const addFeature = async (req, res, next) => {
  try {
    const { icon, title, description } = req.body

    // Validation
    if (!icon || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Icon, title, and description are required'
      })
    }

    let content = await Content.findOne()
    
    if (!content) {
      content = new Content({
        features: [{ icon, title, description }]
      })
    } else {
      content.features.push({ icon, title, description })
    }
    
    await content.save()
    
    res.status(201).json({
      success: true,
      data: content
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Add a pricing plan to content
 * POST /api/content/pricing
 */
export const addPricingPlan = async (req, res, next) => {
  try {
    const { name, price, features, popular } = req.body

    // Validation
    if (!name || price === undefined || !features || !Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and features are required'
      })
    }

    if (features.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one feature is required'
      })
    }

    let content = await Content.findOne()
    
    if (!content) {
      content = new Content({
        pricing: [{ name, price, features, popular: popular || false }]
      })
    } else {
      content.pricing.push({ name, price, features, popular: popular || false })
    }
    
    await content.save()
    
    res.status(201).json({
      success: true,
      data: content
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update a feature by index
 * PUT /api/content/feature/:index
 */
export const updateFeature = async (req, res, next) => {
  try {
    const { index } = req.params
    const { icon, title, description } = req.body
    const idx = parseInt(index, 10)

    if (isNaN(idx)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feature index'
      })
    }

    // Validation
    if (!icon || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Icon, title, and description are required'
      })
    }

    let content = await Content.findOne()
    
    if (!content || !content.features || content.features.length <= idx) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      })
    }

    content.features[idx] = { icon, title, description }
    await content.save()

    res.status(200).json({
      success: true,
      data: content
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a feature by index
 * DELETE /api/content/feature/:index
 */
export const deleteFeature = async (req, res, next) => {
  try {
    const { index } = req.params
    const idx = parseInt(index, 10)

    if (isNaN(idx)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feature index'
      })
    }

    let content = await Content.findOne()
    
    if (!content || !content.features || content.features.length <= idx) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      })
    }

    content.features.splice(idx, 1)
    await content.save()

    res.status(200).json({
      success: true,
      data: content
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update a pricing plan by index
 * PUT /api/content/pricing/:index
 */
export const updatePricingPlan = async (req, res, next) => {
  try {
    const { index } = req.params
    const { name, price, features, popular } = req.body
    const idx = parseInt(index, 10)

    if (isNaN(idx)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pricing index'
      })
    }

    // Validation
    if (!name || price === undefined || !features || !Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and features are required'
      })
    }

    if (features.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one feature is required'
      })
    }

    let content = await Content.findOne()
    
    if (!content || !content.pricing || content.pricing.length <= idx) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      })
    }

    content.pricing[idx] = { name, price, features, popular: popular || false }
    await content.save()

    res.status(200).json({
      success: true,
      data: content
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a pricing plan by index
 * DELETE /api/content/pricing/:index
 */
export const deletePricingPlan = async (req, res, next) => {
  try {
    const { index } = req.params
    const idx = parseInt(index, 10)

    if (isNaN(idx)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pricing index'
      })
    }

    let content = await Content.findOne()
    
    if (!content || !content.pricing || content.pricing.length <= idx) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      })
    }

    content.pricing.splice(idx, 1)
    await content.save()

    res.status(200).json({
      success: true,
      data: content
    })
  } catch (error) {
    next(error)
  }
}

