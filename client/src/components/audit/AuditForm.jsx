import React, { useState, useCallback, memo } from 'react'
import Button from '../common/Button'
import Card from '../common/Card'
import { auditStore } from '../../services/api'

/**
 * Audit form component with URL validation
 * Optimized with React.memo to prevent unnecessary re-renders
 */
const AuditForm = memo(({ onAuditComplete }) => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Validate Shopify store URL
  const validateUrl = useCallback((inputUrl) => {
    if (!inputUrl.trim()) {
      return 'Please enter a store URL'
    }
    
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.(myshopify\.com|shopify\.com)(\/.*)?$/i
    const simplePattern = /^([\da-z\.-]+)\.(myshopify\.com|shopify\.com)(\/.*)?$/i
    
    if (!urlPattern.test(inputUrl) && !simplePattern.test(inputUrl)) {
      return 'Please enter a valid Shopify store URL (e.g., mystore.myshopify.com)'
    }
    
    return ''
  }, [])
  
  // Handle input change
  const handleChange = useCallback((e) => {
    const value = e.target.value
    setUrl(value)
    if (error) {
      setError(validateUrl(value))
    }
  }, [error, validateUrl])
  
  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    const validationError = validateUrl(url)
    if (validationError) {
      setError(validationError)
      return
    }
    
    setError('')
    setLoading(true)
    
    try {
      // Normalize URL (add https:// if missing)
      let normalizedUrl = url.trim()
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = `https://${normalizedUrl}`
      }
      
      const report = await auditStore(normalizedUrl)
      onAuditComplete(report)
    } catch (err) {
      setError(err.message || 'Failed to analyze store. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [url, validateUrl, onAuditComplete])
  
  return (
    <Card className="p-8 md:p-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Analyze Your Store Speed
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Enter your Shopify store URL to get a comprehensive performance analysis and actionable recommendations.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={url}
              onChange={handleChange}
              placeholder="yourstore.myshopify.com"
              className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 text-base ${
                error 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-primary-500'
              } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
              aria-label="Shopify store URL"
              aria-invalid={!!error}
              aria-describedby={error ? 'url-error' : undefined}
            />
            {error && (
              <p id="url-error" className="mt-3 text-sm text-red-600 font-medium animate-fade-in" role="alert">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="whitespace-nowrap"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Store'
            )}
          </Button>
        </div>
        
        <p className="mt-6 text-sm text-gray-500 text-center leading-relaxed">
          We'll analyze your store's performance and provide detailed recommendations.
        </p>
      </form>
    </Card>
  )
})

AuditForm.displayName = 'AuditForm'

export default AuditForm

