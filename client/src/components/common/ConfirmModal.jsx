import React from 'react'
import Button from './Button'

/**
 * Reusable confirmation modal component
 */
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading = false }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
