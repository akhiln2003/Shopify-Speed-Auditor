import express from 'express'
import { getContent, updateContent, addFeature, addPricingPlan, deleteFeature, deletePricingPlan } from '../controllers/contentController.js'

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
  .delete(deleteFeature)

/**
 * Pricing routes
 */
router.route('/pricing')
  .post(addPricingPlan)

router.route('/pricing/:index')
  .delete(deletePricingPlan)

export default router

