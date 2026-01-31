import React, { useState, useCallback, useEffect, useMemo } from 'react'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import AuditForm from '../components/audit/AuditForm'
import SpeedReport from '../components/audit/SpeedReport'
import { fetchContent } from '../services/api'

/**
 * Home page component with all sections
 * Fetches features and pricing from database
 */
const Home = () => {
  const [auditReport, setAuditReport] = useState(null)
  const [features, setFeatures] = useState([])
  const [pricing, setPricing] = useState([])
  const [loadingContent, setLoadingContent] = useState(true)
  
  // Load content from database on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await fetchContent()
        setFeatures(Array.isArray(data.features) ? data.features : [])
        setPricing(Array.isArray(data.pricing) ? data.pricing : [])
      } catch (err) {
        console.error('Failed to load content:', err)
      } finally {
        setLoadingContent(false)
      }
    }

    loadContent()
  }, [])
  
  const handleAuditComplete = useCallback((report) => {
    setAuditReport(report)
    // Scroll to report section
    setTimeout(() => {
      const reportElement = document.getElementById('report')
      if (reportElement) {
        reportElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }, [])
  
  const handleNewAudit = useCallback(() => {
    setAuditReport(null)
    // Scroll to audit form
    setTimeout(() => {
      const auditElement = document.getElementById('audit')
      if (auditElement) {
        const offset = 80 // Account for sticky navbar
        const elementPosition = auditElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      }
    }, 100)
  }, [])
  
  // Handle smooth scroll to sections
  const handleScrollToSection = useCallback((e, sectionId) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Account for sticky navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }, [])
  
  
  // Memoize static data to prevent recreation on each render
  const howItWorksSteps = useMemo(() => [
    {
      step: '01',
      title: 'Enter Store URL',
      description: 'Simply provide your Shopify store URL. We support all Shopify stores, including custom domains.'
    },
    {
      step: '02',
      title: 'Performance Scan',
      description: 'Our system analyzes your store\'s performance metrics, including page speed, app usage, and image optimization.'
    },
    {
      step: '03',
      title: 'Get Report & Recommendations',
      description: 'Receive a detailed report with your speed score, detected issues, and actionable improvement suggestions.'
    }
  ], [])
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-24 md:py-36 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 text-balance leading-tight">
              Speed Up Your Shopify Store. Sell More.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 text-balance max-w-3xl mx-auto leading-relaxed">
              Boost your store's performance and increase conversions with our comprehensive speed audit. 
              Get actionable insights to improve page load times and customer experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#audit" 
                onClick={(e) => handleScrollToSection(e, 'audit')}
                className="inline-block"
              >
                <Button size="lg" className="w-full sm:w-auto">
                  Analyze My Store
                </Button>
              </a>
              <a 
                href="#report" 
                onClick={(e) => handleScrollToSection(e, 'report')}
                className="inline-block"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Sample Report
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Get your store analyzed in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {howItWorksSteps.map((item, index) => (
              <Card key={index} className="p-8 md:p-10 text-center" hover>
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:scale-110">
                  <span className="text-3xl font-bold text-primary-700">{item.step}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Powerful Features
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to optimize your store's performance
            </p>
          </div>
          
          {loadingContent ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading features…</p>
            </div>
          ) : features.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No features available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 md:p-8 lg:p-10" hover>
                  <div className="text-5xl mb-5 transform transition-transform duration-300 hover:scale-110 inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Audit Form Section */}
      <section id="audit" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuditForm onAuditComplete={handleAuditComplete} />
        </div>
      </section>
      
      {/* Report Section */}
      {auditReport && (
        <section id="report" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SpeedReport report={auditReport} onNewAudit={handleNewAudit} />
          </div>
        </section>
      )}
      
      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your needs
            </p>
          </div>
          
          {loadingContent ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading pricing plans…</p>
            </div>
          ) : pricing.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No pricing plans available</p>
            </div>
          ) : (
            <div className={`grid gap-8 ${pricing.length === 1 ? 'max-w-md' : 'md:grid-cols-2'} max-w-4xl mx-auto`} style={{ gridTemplateColumns: pricing.length === 1 ? '1fr' : undefined }}>
              {pricing.map((plan, index) => (
                <Card 
                  key={index}
                  className={`p-8 md:p-10 transition-all duration-300 ${
                    plan.popular 
                      ? 'border-2 border-primary-500 relative hover:border-primary-600 hover:shadow-xl' 
                      : 'border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-2 rounded-bl-lg text-sm font-semibold shadow-md">
                      Popular
                    </div>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                    <div className="text-5xl font-extrabold text-gray-900 mb-2">${plan.price}</div>
                    <p className="text-gray-600 text-lg">per month</p>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {(plan.features || []).map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 text-xl mr-3 mt-0.5">✓</span>
                        <span className="text-gray-600 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.popular ? 'primary' : 'outline'} 
                    className="w-full" 
                    size="lg"
                  >
                    {plan.price === 0 ? 'Get Started' : 'Upgrade to ' + plan.name}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

