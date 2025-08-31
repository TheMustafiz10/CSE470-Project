// routes/adminRoutes.js
import express from 'express';
import {
  getDashboardData,
  approveVolunteer,
  rejectVolunteer,
  deleteVolunteer,
  createAnnouncement,
  getAnnouncements,
  approveUpdateRequest,
  rejectUpdateRequest,
  getSubscriptions,
  getUsers,
  getUpdateRequests
} from '../controllers/adminController.js';

const router = express.Router();

// Dashboard data
router.get('/dashboard', getDashboardData);

// Volunteer management
router.put('/volunteers/:id/approve', approveVolunteer);
router.put('/volunteers/:id/reject', rejectVolunteer);
router.delete('/volunteers/:id', deleteVolunteer);

// Announcements
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);

// Update requests
router.get('/update-requests', getUpdateRequests);
router.put('/update-requests/:id/approve', approveUpdateRequest);
router.put('/update-requests/:id/reject', rejectUpdateRequest);

// Subscriptions and Users
router.get('/subscriptions', getSubscriptions);
router.get('/users', getUsers);

export default router;