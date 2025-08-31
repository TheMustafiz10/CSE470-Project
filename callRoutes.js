// routes/callRoutes.js
import express from 'express';

const router = express.Router();

// Mock data for now - replace with actual database calls
router.get('/', async (req, res) => {
  try {
    // Return mock data structure that your frontend expects
    res.json({
      success: true,
      accepted: [],
      rejected: []
    });
  } catch (error) {
    console.error('Error fetching calls:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;