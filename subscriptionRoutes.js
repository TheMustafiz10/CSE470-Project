/ routes/subscriptionRoutes.js
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;