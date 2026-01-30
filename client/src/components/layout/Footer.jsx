import React, { memo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Footer component
 * Optimized with React.memo to prevent unnecessary re-renders
 */
const Footer = memo(() => {
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  
  // Handle smooth scroll to section
  const handleScrollTo = useCallback((sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Account for sticky navbar height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, [])
  
  // Handle navigation - if on home page, scroll; otherwise navigate
  const handleNavClick = useCallback((e, sectionId) => {
    if (location.pathname === '/') {
      e.preventDefault()
      handleScrollTo(sectionId)
    }
  }, [location.pathname, handleScrollTo])
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-white">Speed Auditor</span>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed text-base">
              Optimize your Shopify store's performance and boost conversions with our comprehensive speed audit tool.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/#features" 
                  onClick={(e) => handleNavClick(e, 'features')}
                  className="hover:text-primary-400 transition-colors duration-300 inline-block hover:translate-x-1 transform cursor-pointer"
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="/#pricing" 
                  onClick={(e) => handleNavClick(e, 'pricing')}
                  className="hover:text-primary-400 transition-colors duration-300 inline-block hover:translate-x-1 transform cursor-pointer"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a 
                  href="/#how-it-works" 
                  onClick={(e) => handleNavClick(e, 'how-it-works')}
                  className="hover:text-primary-400 transition-colors duration-300 inline-block hover:translate-x-1 transform cursor-pointer"
                >
                  How It Works
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@speedauditor.com" className="hover:text-primary-400 transition-colors duration-300 inline-block break-all">
                  support@speedauditor.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Shopify Store Speed Auditor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer

