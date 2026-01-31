import React, { useState, useCallback } from 'react'
import Button from './Button'

/**
 * Modal for adding or editing features with validation
 */
const AddFeatureModal = ({ isOpen, onSave, onCancel, initialFeature = null }) => {
  const [formData, setFormData] = useState(
    initialFeature || { icon: '', title: '', description: '' }
  )
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const validateForm = useCallback(() => {
    const newErrors = {}
    
    if (!formData.icon || formData.icon.trim() === '') {
      newErrors.icon = 'Icon is required'
    }
    
    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    } else if (formData.title.trim().length > 50) {
      newErrors.title = 'Title must not exceed 50 characters'
    }
    
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'Description must not exceed 200 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return
    
    setIsSaving(true)
    try {
      await onSave(formData)
      setFormData({ icon: '', title: '', description: '' })
      setErrors({})
    } finally {
      setIsSaving(false)
    }
  }, [formData, onSave, validateForm])

  const handleCancel = useCallback(() => {
    setFormData({ icon: '', title: '', description: '' })
    setErrors({})
    onCancel()
  }, [onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {initialFeature ? 'Edit Feature' : 'Add Feature'}
        </h2>

        <div className="space-y-4">
          {/* Icon Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="e.g., ⚡ 📱 🖼️"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.icon
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
            />
            {errors.icon && (
              <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
            )}
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Feature title"
              maxLength="50"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
            />
            <div className="mt-1 flex justify-between">
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.title.length}/50
              </p>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Feature description"
              maxLength="200"
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
            />
            <div className="mt-1 flex justify-between">
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.description.length}/200
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : 'Save Feature'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddFeatureModal
