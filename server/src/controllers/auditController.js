import Audit from '../models/Audit.js'

/**
 * Generate mock audit data based on store URL
 * @param {string} storeUrl - Store URL
 * @returns {Object} Mock audit report
 */
const generateMockAudit = (storeUrl) => {
  // Generate realistic speed score between 50-90
  const speedScore = Math.floor(Math.random() * 40) + 50
  
  // Common issues based on score
  const allIssues = [
    {
      title: 'Large Image Files',
      description: 'Multiple images exceed 500KB, slowing down page load times.',
      impact: 'High - Can reduce page load speed by 2-3 seconds'
    },
    {
      title: 'Too Many Third-Party Apps',
      description: 'Detected 8+ installed apps that may be impacting performance.',
      impact: 'Medium - Each app adds additional JavaScript and network requests'
    },
    {
      title: 'Unoptimized JavaScript',
      description: 'JavaScript files are not minified or compressed.',
      impact: 'Medium - Increases parse and execution time'
    },
    {
      title: 'Missing Image Lazy Loading',
      description: 'Images below the fold are not using lazy loading.',
      impact: 'Low - Can improve initial page load time'
    },
    {
      title: 'No CDN Usage',
      description: 'Static assets are not served through a CDN.',
      impact: 'Medium - Slower delivery for international customers'
    },
    {
      title: 'Large CSS Files',
      description: 'CSS files contain unused styles and are not minified.',
      impact: 'Low - Minor impact on load time'
    },
    {
      title: 'Render-Blocking Resources',
      description: 'Multiple CSS and JavaScript files block page rendering.',
      impact: 'High - Delays First Contentful Paint'
    },
    {
      title: 'No Browser Caching',
      description: 'Missing cache headers for static assets.',
      impact: 'Medium - Increases load time for returning visitors'
    }
  ]
  
  // Select issues based on score (lower score = more issues)
  const issueCount = speedScore < 60 ? 6 : speedScore < 75 ? 4 : 2
  const issues = allIssues.slice(0, issueCount)
  
  // Generate suggestions
  const allSuggestions = [
    {
      title: 'Optimize Images',
      description: 'Compress and resize images to WebP format. Use Shopify\'s built-in image optimization.',
      potentialGain: '+15-20 points'
    },
    {
      title: 'Remove Unused Apps',
      description: 'Audit your installed apps and remove any that are not actively used.',
      potentialGain: '+10-15 points'
    },
    {
      title: 'Enable Lazy Loading',
      description: 'Implement lazy loading for images below the fold to improve initial load time.',
      potentialGain: '+5-10 points'
    },
    {
      title: 'Minify CSS and JavaScript',
      description: 'Use Shopify\'s asset optimization or a theme app to minify code.',
      potentialGain: '+5-8 points'
    },
    {
      title: 'Implement CDN',
      description: 'Use Shopify\'s CDN or a third-party service to serve static assets faster.',
      potentialGain: '+8-12 points'
    },
    {
      title: 'Reduce Render-Blocking Resources',
      description: 'Defer non-critical CSS and JavaScript to improve First Contentful Paint.',
      potentialGain: '+10-15 points'
    },
    {
      title: 'Enable Browser Caching',
      description: 'Configure proper cache headers for static assets.',
      potentialGain: '+3-5 points'
    },
    {
      title: 'Optimize Font Loading',
      description: 'Use font-display: swap and preload critical fonts.',
      potentialGain: '+2-4 points'
    }
  ]
  
  // Select suggestions based on issues
  const suggestionCount = Math.min(issueCount + 2, allSuggestions.length)
  const suggestions = allSuggestions.slice(0, suggestionCount)
  
  return {
    storeUrl,
    speedScore,
    issues,
    suggestions
  }
}

/**
 * Create audit report
 * POST /api/audit
 */
export const createAudit = async (req, res, next) => {
  try {
    const { storeUrl } = req.body
    
    // Validate store URL
    if (!storeUrl || typeof storeUrl !== 'string' || storeUrl.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Store URL is required'
      })
    }
    
    // Generate mock audit data
    const auditData = generateMockAudit(storeUrl.trim())
    
    // Save to database
    const audit = await Audit.create(auditData)
    
    res.status(201).json({
      success: true,
      data: audit
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get audit report by ID
 * GET /api/audit/:id
 */
export const getAudit = async (req, res, next) => {
  try {
    const { id } = req.params
    
    const audit = await Audit.findById(id)
    
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Audit report not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: audit
    })
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid audit ID format'
      })
    }
    next(error)
  }
}

