// routes/userRoutes.js  
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;