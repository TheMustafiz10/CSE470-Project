// controllers/adminController.js


import Volunteer from '../models/Volunteer.js';
import Call from '../models/Call.js';
import Announcement from '../models/Announcement.js';
import Subscription from '../models/Subscription.js';
import UpdateRequest from '../models/UpdateRequest.js';
import User from '../models/User.js';

// Get all dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const [volunteers, calls, subscriptions, users, announcements, updateRequests] = await Promise.all([
      Volunteer.find({}).select('-password'),
      Call.find({}).populate('volunteerId', 'fullName email'),
      Subscription.find({}),
      User.find({}),
      Announcement.find({}).sort({ createdAt: -1 }),
      UpdateRequest.find({}).populate('volunteerId', 'fullName email')
    ]);

    // Separate accepted and rejected calls
    const acceptedCalls = calls.filter(call => ['accepted', 'completed'].includes(call.status));
    const rejectedCalls = calls.filter(call => call.status === 'rejected');

    res.status(200).json({
      success: true,
      data: {
        volunteers,
        calls: {
          accepted: acceptedCalls,
          rejected: rejectedCalls
        },
        subscriptions,
        users,
        announcements,
        updateRequests
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Approve volunteer
export const approveVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        isApproved: true
      },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer approved successfully',
      volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve volunteer',
      error: error.message
    });
  }
};

// Reject volunteer
export const rejectVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        isApproved: false
      },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer rejected successfully',
      volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject volunteer',
      error: error.message
    });
  }
};

// Delete volunteer
export const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete volunteer',
      error: error.message
    });
  }
};

// Create announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, text } = req.body;
    
    if (!title || !text) {
      return res.status(400).json({
        success: false,
        message: 'Title and text are required'
      });
    }

    const announcement = await Announcement.create({
      title,
      text,
      createdBy: req.user?.id || '000000000000000000000000' // Default admin ID
    });

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message
    });
  }
};

// Get all announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message
    });
  }
};

// Approve update request
export const approveUpdateRequest = async (req, res) => {
  try {
    const updateRequest = await UpdateRequest.findById(req.params.id);
    
    if (!updateRequest) {
      return res.status(404).json({
        success: false,
        message: 'Update request not found'
      });
    }

    // Update the volunteer with new data
    await Volunteer.findByIdAndUpdate(
      updateRequest.volunteerId,
      updateRequest.updatedData,
      { new: true }
    );

    // Mark request as approved
    updateRequest.status = 'approved';
    updateRequest.processedAt = new Date();
    updateRequest.processedBy = req.user?.id;
    await updateRequest.save();

    res.status(200).json({
      success: true,
      message: 'Update request approved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve update request',
      error: error.message
    });
  }
};

// Reject update request
export const rejectUpdateRequest = async (req, res) => {
  try {
    const updateRequest = await UpdateRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        processedAt: new Date(),
        processedBy: req.user?.id
      },
      { new: true }
    );

    if (!updateRequest) {
      return res.status(404).json({
        success: false,
        message: 'Update request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Update request rejected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject update request',
      error: error.message
    });
  }
};

// Get all subscriptions
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions',
      error: error.message
    });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get all update requests
export const getUpdateRequests = async (req, res) => {
  try {
    const updateRequests = await UpdateRequest.find({})
      .populate('volunteerId', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      updateRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch update requests',
      error: error.message
    });
  }
};