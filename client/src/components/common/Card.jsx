import React, { memo } from 'react'

/**
 * Reusable Card component for consistent card styling
 * Optimized with React.memo to prevent unnecessary re-renders
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @param {boolean} props.hover - Enable hover effect
 */
const Card = memo(({ children, className = '', hover = false, ...props }) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ease-in-out'
  const hoverStyles = hover ? 'hover:shadow-xl hover:border-primary-200 hover:-translate-y-1 cursor-pointer' : ''
  
  const classes = `${baseStyles} ${hoverStyles} ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card

