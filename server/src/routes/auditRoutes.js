import express from 'express'
import { createAudit, getAudit } from '../controllers/auditController.js'

const router = express.Router()

/**
 * Audit routes
 */
router.route('/')
  .post(createAudit)

router.route('/:id')
  .get(getAudit)

export default router

