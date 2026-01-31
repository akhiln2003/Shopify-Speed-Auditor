import React, { useState, useCallback, useEffect } from 'react'
import Button from './Button'

/**
 * Modal for adding or editing pricing plans with validation
 */
const AddPricingModal = ({ isOpen, onSave, onCancel, initialPricing = null }) => {
  const [formData, setFormData] = useState(
    initialPricing || { name: '', price: 0, features: [], popular: false }
  )
  const [featuresText, setFeaturesText] = useState(
    initialPricing ? initialPricing.features.join('\n') : ''
  )
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  // Update form data when initialPricing changes
  useEffect(() => {
    if (isOpen) {
      if (initialPricing) {
        setFormData(initialPricing)
        setFeaturesText(initialPricing.features.join('\n'))
      } else {
        setFormData({ name: '', price: 0, features: [], popular: false })
        setFeaturesText('')
      }
      setErrors({})
    }
  }, [isOpen, initialPricing])

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Plan name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Plan name must be at least 2 characters'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Plan name must not exceed 50 characters'
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative'
    } else if (formData.price > 10000) {
      newErrors.price = 'Price cannot exceed $10,000'
    }

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

    if (features.length === 0) {
      newErrors.features = 'At least one feature is required'
    } else if (features.some((f) => f.length > 100)) {
      newErrors.features = 'Each feature must be 100 characters or less'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, featuresText])

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target
      if (name === 'featuresText') {
        setFeaturesText(value)
      } else if (name === 'price') {
        setFormData((prev) => ({ ...prev, [name]: Number(value) }))
      } else if (name === 'popular') {
        setFormData((prev) => ({ ...prev, [name]: e.target.checked }))
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }))
      }
      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }))
      }
    },
    [errors]
  )

  const handleSubmit = useCallback(async () => {
    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

    const dataToSave = {
      ...formData,
      features,
    }

    if (!validateForm()) return

    setIsSaving(true)
    try {
      await onSave(dataToSave)
      setFormData({ name: '', price: 0, features: [], popular: false })
      setFeaturesText('')
      setErrors({})
    } finally {
      setIsSaving(false)
    }
  }, [formData, featuresText, validateForm, onSave])

  const handleCancel = useCallback(() => {
    setFormData({ name: '', price: 0, features: [], popular: false })
    setFeaturesText('')
    setErrors({})
    onCancel()
  }, [onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide p-6 md:p-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {initialPricing ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
        </h2>

        <div className="space-y-5">
          {/* Plan Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Pro Plan"
              maxLength="50"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
            />
            <div className="mt-1 flex justify-between">
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.name.length}/50
              </p>
            </div>
          </div>

          {/* Price Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (per month) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-600">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="29"
                min="0"
                max="10000"
                className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.price
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-primary-500'
                }`}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Features Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features (one per line) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="featuresText"
              value={featuresText}
              onChange={handleChange}
              placeholder="Unlimited audits&#10;Priority support&#10;Advanced analytics"
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.features
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
            />
            {errors.features && (
              <p className="mt-1 text-sm text-red-600">{errors.features}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {featuresText
                .split('\n')
                .filter((f) => f.trim())
                .length}{' '}
              feature(s)
            </p>
          </div>

          {/* Popular Checkbox */}
          <label className="inline-flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              name="popular"
              checked={formData.popular}
              onChange={handleChange}
              className="mr-2 rounded border-gray-300"
            />
            Mark as popular plan
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            size="md"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : 'Save Plan'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddPricingModal
