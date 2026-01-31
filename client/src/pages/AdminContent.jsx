import React, { useEffect, useState, useCallback } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Toast from '../components/common/Toast'
import ConfirmModal from '../components/common/ConfirmModal'
import AddFeatureModal from '../components/common/AddFeatureModal'
import AddPricingModal from '../components/common/AddPricingModal'
import { fetchContent, updateContent, fetchAudits, addFeature, addPricingPlan, deleteFeatureByIndex, deletePricingByIndex, updateFeatureByIndex, updatePricingByIndex } from '../services/api'

/**
 * Admin page to manage landing page content: hero, features, pricing, and view audits.
 * Features and pricing are shown as read-only lists with Edit/Delete buttons.
 */
const AdminContent = () => {
  // Hero content state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: '', visible: false })
  const [heroForm, setHeroForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
  })

  // Features list state
  const [features, setFeatures] = useState([])
  const [showAddFeatureModal, setShowAddFeatureModal] = useState(false)
  const [editingFeatureIndex, setEditingFeatureIndex] = useState(null)

  // Pricing list state
  const [pricing, setPricing] = useState([])
  const [showAddPricingModal, setShowAddPricingModal] = useState(false)
  const [editingPricingIndex, setEditingPricingIndex] = useState(null)

  // Audits list state
  const [audits, setAudits] = useState([])
  const [loadingAudits, setLoadingAudits] = useState(true)

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'feature' or 'pricing'
    itemId: null
  })

  // Helper to show toast messages
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, visible: true })
  }, [])

  const closeToast = useCallback(() => {
    setToast({ ...toast, visible: false })
  }, [toast])

  // Load existing content on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchContent()
        setHeroForm({
          heroTitle: data.heroTitle || '',
          heroSubtitle: data.heroSubtitle || '',
        })
        setFeatures(Array.isArray(data.features) ? data.features : [])
        setPricing(Array.isArray(data.pricing) ? data.pricing : [])
      } catch (err) {
        showToast(err.message || 'Failed to load content', 'error')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [showToast])

  // Load audits for admin list
  useEffect(() => {
    let mounted = true
    const loadAudits = async () => {
      try {
        setLoadingAudits(true)
        const list = await fetchAudits()
        if (mounted) setAudits(Array.isArray(list) ? list : [])
      } catch (err) {
        console.error('Failed to load audits:', err)
      } finally {
        if (mounted) setLoadingAudits(false)
      }
    }

    loadAudits()

    return () => {
      mounted = false
    }
  }, [])

  const handleHeroChange = useCallback((e) => {
    const { name, value } = e.target
    setHeroForm((prev) => ({ ...prev, [name]: value }))
  }, [])

  const saveHero = useCallback(async () => {
    setSaving(true)

    try {
      await updateContent({
        heroTitle: heroForm.heroTitle,
        heroSubtitle: heroForm.heroSubtitle,
        features: features,
        pricing: pricing,
      })
      showToast('Hero content updated successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to update hero content', 'error')
    } finally {
      setSaving(false)
    }
  }, [heroForm, features, pricing, showToast])

  // Feature handlers
  const handleAddFeature = useCallback(async (featureData) => {
    try {
      if (editingFeatureIndex !== null) {
        // Update existing feature
        await updateFeatureByIndex(editingFeatureIndex, featureData)
        const data = await fetchContent()
        setFeatures(Array.isArray(data.features) ? data.features : [])
        showToast('Feature updated successfully', 'success')
        setEditingFeatureIndex(null)
      } else {
        // Add new feature
        await addFeature(featureData)
        const data = await fetchContent()
        setFeatures(Array.isArray(data.features) ? data.features : [])
        showToast('Feature added successfully', 'success')
      }
      setShowAddFeatureModal(false)
    } catch (err) {
      showToast(err.message || 'Failed to save feature', 'error')
    }
  }, [editingFeatureIndex, showToast])

  const deleteFeature = useCallback(async (id) => {
    setConfirmModal({ isOpen: true, type: 'feature', itemId: id })
  }, [])

  const editFeature = useCallback((index) => {
    setEditingFeatureIndex(index)
    setShowAddFeatureModal(true)
  }, [])

  // Pricing handlers
  const handleAddPricingPlan = useCallback(async (planData) => {
    try {
      if (editingPricingIndex !== null) {
        // Update existing pricing plan
        await updatePricingByIndex(editingPricingIndex, planData)
        const data = await fetchContent()
        setPricing(Array.isArray(data.pricing) ? data.pricing : [])
        showToast('Pricing plan updated successfully', 'success')
        setEditingPricingIndex(null)
      } else {
        // Add new pricing plan
        await addPricingPlan(planData)
        const data = await fetchContent()
        setPricing(Array.isArray(data.pricing) ? data.pricing : [])
        showToast('Pricing plan added successfully', 'success')
      }
      setShowAddPricingModal(false)
    } catch (err) {
      showToast(err.message || 'Failed to save pricing plan', 'error')
    }
  }, [editingPricingIndex, showToast])

  const deletePricing = useCallback(async (id) => {
    setConfirmModal({ isOpen: true, type: 'pricing', itemId: id })
  }, [])

  const editPricingPlan = useCallback((index) => {
    setEditingPricingIndex(index)
    setShowAddPricingModal(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    const { type, itemId } = confirmModal
    
    try {
      if (type === 'feature') {
        await deleteFeatureByIndex(itemId)
        const updated = features.filter((_, idx) => idx !== itemId)
        setFeatures(updated)
        showToast('Feature deleted successfully', 'success')
      } else if (type === 'pricing') {
        await deletePricingByIndex(itemId)
        const updated = pricing.filter((_, idx) => idx !== itemId)
        setPricing(updated)
        showToast('Pricing plan deleted successfully', 'success')
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete item', 'error')
    } finally {
      setConfirmModal({ isOpen: false, type: null, itemId: null })
    }
  }, [confirmModal, features, pricing, showToast])

  const handleCancelDelete = useCallback(() => {
    setConfirmModal({ isOpen: false, type: null, itemId: null })
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Loading content…</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage hero content, features, pricing, and view audit reports.
          </p>
        </div>

        {/* Hero Section */}
        <Card className="p-6 md:p-8 space-y-6 mb-8 border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
            <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">Content</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Title
              </label>
              <input
                type="text"
                name="heroTitle"
                value={heroForm.heroTitle}
                onChange={handleHeroChange}
                className="w-full max-w-2xl px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="Speed Up Your Shopify Store. Sell More."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Subtitle
              </label>
              <textarea
                name="heroSubtitle"
                value={heroForm.heroSubtitle}
                onChange={handleHeroChange}
                rows={3}
                className="w-full max-w-2xl px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="Short description."
              />
            </div>
          </div>
          <div className="pt-2">
            <Button type="button" size="md" disabled={saving} onClick={saveHero}>
              {saving ? 'Saving…' : 'Save Hero Content'}
            </Button>
          </div>
        </Card>

        {/* Features List */}
        <Card className="p-6 md:p-8 space-y-6 mb-8 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">Features</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{features.length} Total</span>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowAddFeatureModal(true)} className="mb-2">
            + Add Feature
          </Button>

          {features.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">No features added yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Feature" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-5 bg-white hover:border-primary-300 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-3xl">{feature.icon}</div>
                        <div>
                          <div className="font-semibold text-gray-900">{feature.title}</div>
                          <div className="text-xs text-gray-400 mt-1">Feature {index + 1}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 ml-12 mt-2">{feature.description}</div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" onClick={() => editFeature(index)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteFeature(index)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pricing List */}
        <Card className="p-6 md:p-8 space-y-6 mb-8 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">Pricing Plans</h2>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">{pricing.length} Total</span>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowAddPricingModal(true)} className="mb-2">
            + Add Plan
          </Button>

          {pricing.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">No pricing plans added yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Plan" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pricing.map((plan, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-5 bg-white hover:border-green-300 hover:shadow-sm transition-all relative">
                  {plan.popular && (
                    <div className="absolute top-0 right-4 transform -translate-y-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">Popular</span>
                    </div>
                  )}
                  <div className={plan.popular ? 'pt-6' : ''}>
                    <div className="text-3xl font-bold text-gray-900 mb-1">${plan.price}</div>
                    <div className="text-lg font-semibold text-gray-800 mb-4">{plan.name}</div>
                    <ul className="space-y-2 mb-6">
                      {(plan.features || []).length > 0 ? (
                        (plan.features || []).map((f, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>{f}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-400 italic">No features listed</li>
                      )}
                    </ul>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editPricingPlan(index)} className="flex-1">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deletePricing(index)} className="flex-1">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Audits List */}
        <Card className="p-6 md:p-8 space-y-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">Audit Reports</h2>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">{audits.length} Reports</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
              setLoadingAudits(true)
              try {
                const list = await fetchAudits()
                setAudits(Array.isArray(list) ? list : [])
                showToast('Audits refreshed successfully', 'success')
              } catch (err) {
                console.error(err)
                showToast('Failed to refresh audits', 'error')
              } finally {
                setLoadingAudits(false)
              }
            }}
            className="mb-2"
            disabled={loadingAudits}
          >
            {loadingAudits ? 'Refreshing…' : 'Refresh Reports'}
          </Button>

          {loadingAudits ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading audits…</p>
            </div>
          ) : audits.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">No audits found</p>
              <p className="text-sm text-gray-400 mt-1">Audit reports will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Store URL</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Speed Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {audits.map((audit) => (
                    <tr key={audit._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{audit.storeUrl}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          audit.speedScore >= 80 ? 'bg-green-100 text-green-800' :
                          audit.speedScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {audit.speedScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(audit.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'feature' ? 'Delete Feature' : 'Delete Pricing Plan'}
        message={confirmModal.type === 'feature' 
          ? 'Are you sure you want to delete this feature? This action cannot be undone.' 
          : 'Are you sure you want to delete this pricing plan? This action cannot be undone.'}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <AddFeatureModal
        isOpen={showAddFeatureModal}
        initialFeature={editingFeatureIndex !== null ? features[editingFeatureIndex] : null}
        onSave={handleAddFeature}
        onCancel={() => {
          setShowAddFeatureModal(false)
          setEditingFeatureIndex(null)
        }}
      />

      <AddPricingModal
        isOpen={showAddPricingModal}
        initialPricing={editingPricingIndex !== null ? pricing[editingPricingIndex] : null}
        onSave={handleAddPricingPlan}
        onCancel={() => {
          setShowAddPricingModal(false)
          setEditingPricingIndex(null)
        }}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={closeToast}
      />
    </div>
  )
}

export default AdminContent


