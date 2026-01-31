/**
 * API service for communicating with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * Fetch content from the backend
 */
export const fetchContent = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/content`)
    if (!response.ok) {
      throw new Error('Failed to fetch content')
    }
    const result = await response.json()
    // Extract data from API response wrapper
    return result.data || result
  } catch (error) {
    console.error('Error fetching content:', error)
    throw error
  }
}

/**
 * Update landing page content
 * @param {Object} payload - Content fields to update
 */
export const updateContent = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to update content')
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Error updating content:', error)
    throw error
  }
}

/**
 * Submit store URL for audit
 * @param {string} storeUrl - Shopify store URL
 * @returns {Promise<Object>} Audit report
 */
export const auditStore = async (storeUrl) => {
  try {
    const response = await fetch(`${API_BASE_URL}/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ storeUrl }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to analyze store')
    }
    
    const result = await response.json()
    // Extract data from API response wrapper
    return result.data || result
  } catch (error) {
    console.error('Error auditing store:', error)
    throw error
  }
}

/**
 * Fetch audit report by ID
 * @param {string} auditId - Audit report ID
 * @returns {Promise<Object>} Audit report
 */
export const fetchAuditReport = async (auditId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/audit/${auditId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch audit report')
    }
    const result = await response.json()
    // Extract data from API response wrapper
    return result.data || result
  } catch (error) {
    console.error('Error fetching audit report:', error)
    throw error
  }
}

/**
 * Fetch recent audits
 */
export const fetchAudits = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/audit`)
    if (!response.ok) {
      throw new Error('Failed to fetch audits')
    }
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Error fetching audits:', error)
    throw error
  }
}

/**
 * Delete an audit by ID
 */
export const deleteAudit = async (auditId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/audit/${auditId}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const d = await response.json().catch(() => ({}))
      throw new Error(d.message || 'Failed to delete audit')
    }
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Error deleting audit:', error)
    throw error
  }
}

/**
 * Update an audit by ID
 */
export const updateAudit = async (auditId, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/audit/${auditId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      const d = await response.json().catch(() => ({}))
      throw new Error(d.message || 'Failed to update audit')
    }
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Error updating audit:', error)
    throw error
  }
}

/**
 * Add a feature to content
 * @param {Object} feature - Feature object with icon, title, description
 */
export const addFeature = async (feature) => {
  try {
    const response = await fetch(`${API_BASE_URL}/content/feature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feature),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to add feature')
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Error adding feature:', error)
    throw error
  }
}

/**
 * Add a pricing plan to content
 * @param {Object} plan - Pricing plan object with name, price, features, popular
 */
export const addPricingPlan = async (plan) => {
  try {
    const response = await fetch(`${API_BASE_URL}/content/pricing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plan),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to add pricing plan')
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Error adding pricing plan:', error)
    throw error
  }
}

/**
 * Update a feature by index
 * @param {number} index - Index of feature to update
 * @param {Object} feature - Updated feature object with icon, title, description
 */
export const updateFeatureByIndex = async (index, feature) => {
  try {
    const response = await fetch(`${API_BASE_URL}/content/feature/${index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feature),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to update feature')
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Error updating feature:', error)
    throw error
  }
}

/**
 * Delete a feature by index
 * @param {number} index - Index of feature to delete
 */
export const deleteFeatureByIndex = async (index) => {
  try {
    const response = await fetch(`${API_BASE_URL}/content/feature/${index}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to delete feature')
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Error deleting feature:', error)
    throw error
  }
}

/**
 * Update a pricing plan by index
 * @param {number} index - Index of pricing plan to update
 * @param {Object} plan - Updated pricing plan object with name, price, features, popular
 */
export const updatePricingByIndex = async (index, plan) => {
  try {
    const response = await fetch(`${API_BASE_URL}/content/pricing/${index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plan),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to update pricing plan')
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Error updating pricing plan:', error)
    throw error
  }
}

/**
 * Delete a pricing plan by index
 * @param {number} index - Index of pricing plan to delete
 */
export const deletePricingByIndex = async (index) => {
  try {
    const response = await fetch(`${API_BASE_URL}/content/pricing/${index}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to delete pricing plan')
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Error deleting pricing plan:', error)
    throw error
  }
}

