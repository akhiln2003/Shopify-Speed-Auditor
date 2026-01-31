import express from 'express'
import { createAudit, getAudit, listAudits, updateAudit, deleteAudit } from '../controllers/auditController.js'

const router = express.Router()

/**
 * Audit routes
 */
router.route('/')
  .get(listAudits)
  .post(createAudit)

router.route('/:id')
  .get(getAudit)
  .put(updateAudit)
  .delete(deleteAudit)

export default router

