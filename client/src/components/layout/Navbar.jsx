import React, { memo, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'

/**
 * Navigation bar component
 * Optimized with React.memo to prevent unnecessary re-renders
 */
const Navbar = memo(() => {
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
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900">Speed Auditor</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 transition-colors duration-300 font-semibold text-base relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a 
              href="/#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-300 font-semibold text-base relative group cursor-pointer"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="/#pricing"
              onClick={(e) => handleNavClick(e, 'pricing')}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-300 font-semibold text-base relative group cursor-pointer"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
          
          {/* CTA Button */}
          <a 
            href="/#audit"
            onClick={(e) => handleNavClick(e, 'audit')}
            className="hidden md:block"
          >
            <button className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5">
              Analyze Store
            </button>
          </a>
        </div>
      </div>
    </nav>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar

