import React, { useMemo, memo } from 'react'
import Card from '../common/Card'
import Button from '../common/Button'

/**
 * Speed report component displaying audit results
 * Optimized with React.memo to prevent unnecessary re-renders
 * @param {Object} props
 * @param {Object} props.report - Audit report data
 * @param {Function} props.onNewAudit - Callback for new audit
 */
const SpeedReport = memo(({ report, onNewAudit }) => {
  // Calculate score color based on value - memoized functions
  const getScoreColor = useMemo(() => {
    return (score) => {
      if (score >= 80) return 'text-green-600'
      if (score >= 60) return 'text-yellow-600'
      return 'text-red-600'
    }
  }, [])
  
  const getScoreBgColor = useMemo(() => {
    return (score) => {
      if (score >= 80) return 'bg-green-100'
      if (score >= 60) return 'bg-yellow-100'
      return 'bg-red-100'
    }
  }, [])
  
  const getScoreBorderColor = useMemo(() => {
    return (score) => {
      if (score >= 80) return 'border-green-500'
      if (score >= 60) return 'border-yellow-500'
      return 'border-red-500'
    }
  }, [])
  
  if (!report) return null
  
  const { speedScore, issues = [], suggestions = [], storeUrl, createdAt } = report
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Speed Report
        </h2>
        <p className="text-lg md:text-xl text-gray-600">
          Analysis for <span className="font-semibold text-primary-600">{storeUrl}</span>
        </p>
        {createdAt && (
          <p className="text-sm text-gray-500 mt-3">
            Generated on {new Date(createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}
      </div>
      
      {/* Speed Score Card */}
      <Card className="p-8 md:p-10 text-center">
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">Overall Speed Score</h3>
          <div className="inline-flex items-center justify-center">
            <div className={`relative w-56 h-56 md:w-64 md:h-64 rounded-full ${getScoreBgColor(speedScore)} border-4 ${getScoreBorderColor(speedScore)} flex items-center justify-center transform transition-all duration-500 hover:scale-110 shadow-lg`}>
              <div className="text-center">
                <div className={`text-6xl md:text-7xl font-extrabold ${getScoreColor(speedScore)}`}>
                  {speedScore}
                </div>
                <div className="text-base text-gray-600 mt-2 font-medium">out of 100</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className={`h-full transition-all duration-1500 ease-out rounded-full ${
                speedScore >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                speedScore >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${speedScore}%` }}
            />
          </div>
        </div>
      </Card>
      
      {/* Issues Section */}
      {issues.length > 0 && (
        <Card className="p-6 md:p-8 lg:p-10" hover>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
            Detected Issues ({issues.length})
          </h3>
          <ul className="space-y-5">
            {issues.map((issue, index) => (
              <li
                key={index}
                className="flex items-start p-5 bg-red-50 rounded-xl border-2 border-red-100 transition-all duration-300 hover:bg-red-100 hover:border-red-200 hover:shadow-md"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-sm">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">{issue.title}</h4>
                  {issue.description && (
                    <p className="text-gray-600 text-base leading-relaxed mb-2">{issue.description}</p>
                  )}
                  {issue.impact && (
                    <p className="text-red-600 text-sm mt-2 font-semibold">
                      Impact: {issue.impact}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
      
      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <Card className="p-6 md:p-8 lg:p-10" hover>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            Improvement Suggestions ({suggestions.length})
          </h3>
          <ul className="space-y-5">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start p-5 bg-green-50 rounded-xl border-2 border-green-100 transition-all duration-300 hover:bg-green-100 hover:border-green-200 hover:shadow-md"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-sm">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">{suggestion.title}</h4>
                  {suggestion.description && (
                    <p className="text-gray-600 text-base leading-relaxed mb-2">{suggestion.description}</p>
                  )}
                  {suggestion.potentialGain && (
                    <p className="text-green-600 text-sm mt-2 font-semibold">
                      Potential Gain: {suggestion.potentialGain}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
      
      {/* Action Button */}
      <div className="text-center pt-4">
        <Button onClick={onNewAudit} variant="outline" size="lg">
          Analyze Another Store
        </Button>
      </div>
    </div>
  )
})

SpeedReport.displayName = 'SpeedReport'

export default SpeedReport

