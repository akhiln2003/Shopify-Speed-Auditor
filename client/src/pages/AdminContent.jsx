import React, { useEffect, useState, useCallback } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import ConfirmModal from '../components/common/ConfirmModal'
import AddFeatureModal from '../components/common/AddFeatureModal'
import AddPricingModal from '../components/common/AddPricingModal'
import { fetchContent, updateContent, fetchAudits, addFeature, addPricingPlan, deleteFeatureByIndex, deletePricingByIndex } from '../services/api'

/**
 * Admin page to manage landing page content: hero, features, pricing, and view audits.
 * Features and pricing are shown as read-only lists with Edit/Delete buttons.
 */
const AdminContent = () => {
  // Hero content state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [heroForm, setHeroForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
  })

  // Features list state
  const [features, setFeatures] = useState([])
  const [showAddFeatureModal, setShowAddFeatureModal] = useState(false)

  // Pricing list state
  const [pricing, setPricing] = useState([])
  const [showAddPricingModal, setShowAddPricingModal] = useState(false)

  // Audits list state
  const [audits, setAudits] = useState([])
  const [loadingAudits, setLoadingAudits] = useState(true)

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'feature' or 'pricing'
    itemId: null
  })

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
        setFeatures(Array.isArray(data.features) ? data.features.map((f, idx) => ({ ...f, _id: `f_${idx}` })) : [])
        setPricing(Array.isArray(data.pricing) ? data.pricing.map((p, idx) => ({ ...p, _id: `p_${idx}` })) : [])
      } catch (err) {
        setError(err.message || 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

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
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await updateContent({
        heroTitle: heroForm.heroTitle,
        heroSubtitle: heroForm.heroSubtitle,
        features: features,
        pricing: pricing,
      })
      setSuccess('Hero content updated successfully')
    } catch (err) {
      setError(err.message || 'Failed to update hero content')
    } finally {
      setSaving(false)
    }
  }, [heroForm, features, pricing])

  // Feature handlers
  const handleAddFeature = useCallback(async (featureData) => {
    try {
      setError('')
      setSuccess('')
      await addFeature(featureData)
      // Reload content to get the updated list
      const data = await fetchContent()
      setFeatures(Array.isArray(data.features) ? data.features : [])
      setSuccess('Feature added successfully')
      setShowAddFeatureModal(false)
    } catch (err) {
      setError(err.message || 'Failed to add feature')
    }
  }, [])

  const deleteFeature = useCallback(async (id) => {
    setConfirmModal({ isOpen: true, type: 'feature', itemId: id })
  }, [])

  // Pricing handlers
  const handleAddPricingPlan = useCallback(async (planData) => {
    try {
      setError('')
      setSuccess('')
      await addPricingPlan(planData)
      // Reload content to get the updated list
      const data = await fetchContent()
      setPricing(Array.isArray(data.pricing) ? data.pricing : [])
      setSuccess('Pricing plan added successfully')
      setShowAddPricingModal(false)
    } catch (err) {
      setError(err.message || 'Failed to add pricing plan')
    }
  }, [])

  const deletePricing = useCallback(async (id) => {
    setConfirmModal({ isOpen: true, type: 'pricing', itemId: id })
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    const { type, itemId } = confirmModal
    
    try {
      setError('')
      if (type === 'feature') {
        await deleteFeatureByIndex(itemId)
        const updated = features.filter((_, idx) => idx !== itemId)
        setFeatures(updated)
        setSuccess('Feature deleted successfully')
      } else if (type === 'pricing') {
        await deletePricingByIndex(itemId)
        const updated = pricing.filter((_, idx) => idx !== itemId)
        setPricing(updated)
        setSuccess('Pricing plan deleted successfully')
      }
    } catch (err) {
      setError(err.message || 'Failed to delete item')
    } finally {
      setConfirmModal({ isOpen: false, type: null, itemId: null })
    }
  }, [confirmModal, features, pricing])

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
    <div className="bg-gray-50 py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Admin Content Manager
        </h1>
        <p className="text-gray-600 mb-8">
          Manage hero content, features, pricing, and view audit reports.
        </p>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 mb-6">
            {success}
          </div>
        )}

        {/* Hero Section */}
        <Card className="p-6 md:p-8 space-y-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Title
              </label>
              <input
                type="text"
                name="heroTitle"
                value={heroForm.heroTitle}
                onChange={handleHeroChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Speed Up Your Shopify Store. Sell More."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Subtitle
              </label>
              <textarea
                name="heroSubtitle"
                value={heroForm.heroSubtitle}
                onChange={handleHeroChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Short description."
              />
            </div>
          </div>
          <div className="pt-4">
            <Button type="button" size="md" disabled={saving} onClick={saveHero}>
              {saving ? 'Saving…' : 'Save Hero'}
            </Button>
          </div>
        </Card>

        {/* Features List */}
        <Card className="p-6 md:p-8 space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Features</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddFeatureModal(true)}>
              Add Feature
            </Button>
          </div>

          {features.length === 0 ? (
            <p className="text-sm text-gray-500">No features yet.</p>
          ) : (
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <div className="font-medium text-gray-800">{feature.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{feature.description}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => deleteFeature(index)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pricing List */}
        <Card className="p-6 md:p-8 space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Pricing Plans</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddPricingModal(true)}>
              Add Plan
            </Button>
          </div>

          {pricing.length === 0 ? (
            <p className="text-sm text-gray-500">No pricing plans yet.</p>
          ) : (
            <div className="space-y-4">
              {pricing.map((plan, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-800">{plan.name}</div>
                        {plan.popular && (
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-bold text-gray-900 mt-1">${plan.price}/mo</div>
                      <ul className="mt-2 space-y-1">
                        {(plan.features || []).map((f, i) => (
                          <li key={i} className="text-sm text-gray-600">
                            ✓ {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => deletePricing(index)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Audits List */}
        <Card className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Audit Reports</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                setLoadingAudits(true)
                try {
                  const list = await fetchAudits()
                  setAudits(Array.isArray(list) ? list : [])
                } catch (err) {
                  console.error(err)
                  alert('Failed to refresh audits')
                } finally {
                  setLoadingAudits(false)
                }
              }}
            >
              Refresh
            </Button>
          </div>

          {loadingAudits ? (
            <p className="text-gray-600">Loading audits…</p>
          ) : audits.length === 0 ? (
            <p className="text-sm text-gray-500">No audits found.</p>
          ) : (
            <div className="space-y-4">
              {audits.map((audit) => (
                <div key={audit._id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="text-sm text-gray-500">{new Date(audit.createdAt).toLocaleString()}</div>
                  <div className="mt-2">
                    <div className="font-medium text-gray-800">{audit.storeUrl}</div>
                    <div className="text-sm text-gray-600">
                      Speed Score: <span className="font-semibold">{audit.speedScore}</span>
                    </div>
                  </div>
                </div>
              ))}
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
        onSave={handleAddFeature}
        onCancel={() => setShowAddFeatureModal(false)}
      />

      <AddPricingModal
        isOpen={showAddPricingModal}
        onSave={handleAddPricingPlan}
        onCancel={() => setShowAddPricingModal(false)}
      />
    </div>
  )
}

export default AdminContent


