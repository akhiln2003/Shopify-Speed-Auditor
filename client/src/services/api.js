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

