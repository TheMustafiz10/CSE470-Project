/ routes/announcementRoutes.js
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, text } = req.body;
    
    // Mock creation - replace with actual database save
    const announcement = {
      _id: Date.now().toString(),
      title,
      text,
      createdAt: new Date(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };
    
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;