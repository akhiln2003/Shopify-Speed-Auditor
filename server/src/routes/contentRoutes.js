import express from 'express'
import { getContent, updateContent } from '../controllers/contentController.js'

const router = express.Router()

/**
 * Content routes
 */
router.route('/')
  .get(getContent)
  .put(updateContent)

export default router

