import Content from '../models/Content.js'

/**
 * Get content
 * GET /api/content
 */
export const getContent = async (req, res, next) => {
  try {
    const content = await Content.getContent()
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

