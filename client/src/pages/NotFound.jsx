import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

/**
 * Simple 404 page for unknown routes
 */
const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-xl mx-auto text-center px-4 py-16">
        <p className="text-sm font-semibold text-primary-600 mb-2">404</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Page not found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you’re looking for doesn’t exist or has been moved. Check the URL
          or go back to the dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="md">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound


