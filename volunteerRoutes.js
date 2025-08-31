import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  registerVolunteer,
  loginVolunteer,
  getVolunteers,
  getVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadProfileImage,
  getVolunteerCalls,
  getVolunteerCallHistory,
  getIncomingCalls,
  acceptCall,
  rejectCall,
  endCall,
  submitUpdateRequest,
  getVolunteerUpdateRequests,
  getPendingVolunteers,
  getUpdateRequests,
  approveUpdateRequest,
  rejectUpdateRequest,
  deleteUpdateRequest,
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getStatistics,
  searchVolunteers,
  approveVolunteer,
  rejectVolunteer,
} from '../controllers/volunteerController.js';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = 'Uploads/profiles/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created upload directory:', uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
    }
  },
});

// Multer error handling middleware
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File size too large. Maximum 5MB allowed.' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  } else if (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
  next();
};

// Request logging middleware for debugging
const logRequest = (req, res, next) => {
  console.log(`📝 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body keys:', Object.keys(req.body));
  }
  next();
};

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (id && !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  next();
};

export default (io) => {
  // Public routes (no authentication required)
  router.post('/register', logRequest, asyncHandler((req, res) => {
    console.log('POST /api/volunteers/register called');
    console.log('IO instance available:', !!io);
    return registerVolunteer(req, res, io);
  }));

  router.post('/login', logRequest, asyncHandler(loginVolunteer));

  // Statistics and search routes (typically for admin)
  router.get('/statistics', logRequest, asyncHandler(getStatistics));
  router.get('/search', logRequest, asyncHandler(searchVolunteers));
  router.get('/pending', logRequest, asyncHandler(getPendingVolunteers));

  // Update request management (admin routes)
  router.get('/update/requests', logRequest, asyncHandler(getUpdateRequests));
  router.put('/update/approve/:requestId', logRequest, asyncHandler((req, res) => {
    return approveUpdateRequest(req, res, io);
  }));
  router.put('/update/reject/:requestId', logRequest, asyncHandler((req, res) => {
    return rejectUpdateRequest(req, res, io);
  }));

  // Profile image upload
  router.post('/profile/image', 
    logRequest,
    upload.single('profileImage'), 
    uploadErrorHandler, 
    asyncHandler(uploadProfileImage)
  );

  // Call-related routes
  router.get('/calls/incoming', logRequest, asyncHandler(getIncomingCalls));
  router.post('/calls/accept', logRequest, asyncHandler((req, res) => {
    return acceptCall(req, res, io);
  }));
  router.post('/calls/reject', logRequest, asyncHandler((req, res) => {
    return rejectCall(req, res, io);
  }));
  router.post('/calls/end', logRequest, asyncHandler((req, res) => {
    return endCall(req, res, io);
  }));

  // Volunteer-specific routes (require volunteer ID)
  router.get('/profile/:id', logRequest, validateObjectId, asyncHandler(getProfile));
  router.put('/profile/:id', logRequest, validateObjectId, asyncHandler(updateProfile));
  router.delete('/profile/:id', logRequest, validateObjectId, asyncHandler(deleteProfile));

  // Update requests for specific volunteer
  router.post('/:id/update-request', logRequest, validateObjectId, asyncHandler((req, res) => {
    return submitUpdateRequest(req, res, io);
  }));
  router.get('/:id/update-requests', logRequest, validateObjectId, asyncHandler(getVolunteerUpdateRequests));
  router.delete('/:id/update-request/:requestId', logRequest, validateObjectId, asyncHandler((req, res) => {
    return deleteUpdateRequest(req, res, io);
  }));

  // Call history for specific volunteer
  router.get('/:id/calls', logRequest, validateObjectId, asyncHandler(getVolunteerCalls));
  router.get('/:id/call-history', logRequest, validateObjectId, asyncHandler(getVolunteerCallHistory));

  // Activity management for specific volunteer
  router.get('/:id/activities', logRequest, validateObjectId, asyncHandler(getActivities));
  router.post('/:id/activities', logRequest, validateObjectId, asyncHandler((req, res) => {
    return createActivity(req, res, io);
  }));
  router.put('/:id/activities/:activityId', logRequest, validateObjectId, asyncHandler((req, res) => {
    return updateActivity(req, res, io);
  }));
  router.delete('/:id/activities/:activityId', logRequest, validateObjectId, asyncHandler((req, res) => {
    return deleteActivity(req, res, io);
  }));

  // Admin actions on specific volunteers
  router.put('/:id/approve', logRequest, validateObjectId, asyncHandler((req, res) => {
    console.log('Approving volunteer via route:', req.params.id);
    return approveVolunteer(req, res, io);
  }));
  router.put('/:id/reject', logRequest, validateObjectId, asyncHandler((req, res) => {
    console.log('Rejecting volunteer via route:', req.params.id);
    return rejectVolunteer(req, res, io);
  }));

  // General volunteer CRUD operations
  router.get('/', logRequest, asyncHandler(getVolunteers));
  router.get('/:id', logRequest, validateObjectId, asyncHandler(getVolunteer));
  router.put('/:id', logRequest, validateObjectId, asyncHandler((req, res) => {
    return updateVolunteer(req, res, io);
  }));
  router.delete('/:id', logRequest, validateObjectId, asyncHandler((req, res) => {
    return deleteVolunteer(req, res, io);
  }));

  // Error handling middleware for this router
  router.use((err, req, res, next) => {
    console.error('Volunteer route error:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry. Email may already exist.'
      });
    }

    // Default error response
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  return router;
};