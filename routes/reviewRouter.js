import review from '../controllers/reviewCtrl.js'
import express from 'express'

const router = express.Router();
router.route('/')
    .get(review.getReview)
    .post(review.createReview)

export default router;