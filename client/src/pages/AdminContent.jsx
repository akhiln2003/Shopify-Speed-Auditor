import React, { useEffect, useState, useCallback } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { fetchContent, updateContent } from '../services/api'

/**
 * Simple admin page to view and edit landing page content.
 * No auth – treat this as an internal-only tool.
 */
const AdminContent = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    features: [],
    pricing: [],
  })

  // Load existing content
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchContent()
        setForm({
          heroTitle: data.heroTitle || '',
          heroSubtitle: data.heroSubtitle || '',
          features: Array.isArray(data.features) ? data.features : [],
          pricing: Array.isArray(data.pricing) ? data.pricing : [],
        })
      } catch (err) {
        setError(err.message || 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }, [])

  // Feature handlers
  const handleFeatureChange = useCallback((index, field, value) => {
    setForm((prev) => {
      const next = [...prev.features]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, features: next }
    })
  }, [])

  const addFeature = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, { icon: '✨', title: '', description: '' }],
    }))
  }, [])

  const removeFeature = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }, [])

  // Pricing handlers
  const handlePricingChange = useCallback((index, field, value) => {
    setForm((prev) => {
      const next = [...prev.pricing]
      if (field === 'price') {
        const num = Number(value)
        next[index] = { ...next[index], [field]: Number.isNaN(num) ? 0 : num }
      } else if (field === 'featuresText') {
        // featuresText is a UI-only helper, split by lines
        const features = value
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
        next[index] = { ...next[index], features }
      } else if (field === 'popular') {
        next[index] = { ...next[index], popular: value }
      } else {
        next[index] = { ...next[index], [field]: value }
      }
      return { ...prev, pricing: next }
    })
  }, [])

  const addPricingTier = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      pricing: [
        ...prev.pricing,
        { name: '', price: 0, features: [], popular: false },
      ],
    }))
  }, [])

  const removePricingTier = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index),
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setError('')
      setSuccess('')
      setSaving(true)

      try {
        await updateContent(form)
        setSuccess('Content updated successfully')
      } catch (err) {
        setError(err.message || 'Failed to update content')
      } finally {
        setSaving(false)
      }
    },
    [form],
  )

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
          Landing Page Content Admin
        </h1>
        <p className="text-gray-600 mb-8">
          Update the hero, features, and pricing content used on the public
          landing page.
        </p>

        <Card className="p-6 md:p-8 space-y-8">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hero content */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Hero Section
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    name="heroTitle"
                    value={form.heroTitle}
                    onChange={handleChange}
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
                    value={form.heroSubtitle}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Short description that appears under the main headline."
                  />
                </div>
              </div>
            </section>

            {/* Features */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Features
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
                  Add Feature
                </Button>
              </div>

              {form.features.length === 0 && (
                <p className="text-sm text-gray-500 mb-2">
                  No features yet. Click &quot;Add Feature&quot; to create one.
                </p>
              )}

              <div className="space-y-4">
                {form.features.map((feature, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">
                        Feature #{index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Icon (emoji or text)
                        </label>
                        <input
                          type="text"
                          value={feature.icon || ''}
                          onChange={(e) =>
                            handleFeatureChange(index, 'icon', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="⚡"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={feature.title || ''}
                          onChange={(e) =>
                            handleFeatureChange(index, 'title', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Speed Score (0–100)"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={feature.description || ''}
                        onChange={(e) =>
                          handleFeatureChange(
                            index,
                            'description',
                            e.target.value,
                          )
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Short description of this feature."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Pricing Plans
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPricingTier}
                >
                  Add Plan
                </Button>
              </div>

              {form.pricing.length === 0 && (
                <p className="text-sm text-gray-500 mb-2">
                  No pricing plans yet. Click &quot;Add Plan&quot; to create
                  one.
                </p>
              )}

              <div className="space-y-4">
                {form.pricing.map((tier, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">
                        Plan #{index + 1}
                      </h3>
                      <div className="flex items-center gap-4">
                        <label className="inline-flex items-center text-xs text-gray-700">
                          <input
                            type="checkbox"
                            className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            checked={!!tier.popular}
                            onChange={(e) =>
                              handlePricingChange(
                                index,
                                'popular',
                                e.target.checked,
                              )
                            }
                          />
                          Popular
                        </label>
                        <button
                          type="button"
                          onClick={() => removePricingTier(index)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={tier.name || ''}
                          onChange={(e) =>
                            handlePricingChange(index, 'name', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Pro"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Price (per month)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={tier.price ?? 0}
                          onChange={(e) =>
                            handlePricingChange(index, 'price', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="29"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Features (one per line)
                        </label>
                        <textarea
                          value={(tier.features || []).join('\n')}
                          onChange={(e) =>
                            handlePricingChange(
                              index,
                              'featuresText',
                              e.target.value,
                            )
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={'Unlimited audits\nPriority support'}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-4">
              <Button type="submit" size="md" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default AdminContent


