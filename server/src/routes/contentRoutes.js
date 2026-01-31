import express from 'express'
import { getContent, updateContent, addFeature, addPricingPlan, deleteFeature, deletePricingPlan, updateFeature, updatePricingPlan } from '../controllers/contentController.js'

const router = express.Router()

/**
 * Content routes
 */
router.route('/')
  .get(getContent)
  .put(updateContent)

/**
 * Feature routes
 */
router.route('/feature')
  .post(addFeature)

router.route('/feature/:index')
  .put(updateFeature)
  .delete(deleteFeature)

/**
 * Pricing routes
 */
router.route('/pricing')
  .post(addPricingPlan)

router.route('/pricing/:index')
  .put(updatePricingPlan)
  .delete(deletePricingPlan)

export default router

