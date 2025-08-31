// const Call = require('../models/Call');

// exports.getAllCalls = async (req, res) => {
//   try {
//     const calls = await Call.find()
//       .populate('userId')
//       .populate('volunteerId');
//     const accepted = calls.filter(c => c.status === 'accepted');
//     const rejected = calls.filter(c => c.status === 'rejected');
//     const pending = calls.filter(c => c.status === 'pending');
//     res.json({ accepted, rejected, pending });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.acceptCall = async (req, res) => {
//   try {
//     const call = await Call.findById(req.params.id);
//     call.status = 'accepted';
//     call.startTime = new Date().toLocaleTimeString();
//     await call.save();
//     res.json(call);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.rejectCall = async (req, res) => {
//   try {
//     const call = await Call.findById(req.params.id);
//     call.status = 'rejected';
//     call.endTime = new Date().toLocaleTimeString();
//     await call.save();
//     res.json(call);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.endCall = async (req, res) => {
//   try {
//     const { duration } = req.body;
//     const call = await Call.findById(req.params.id);
//     call.endTime = new Date().toLocaleTimeString();
//     call.duration = duration;
//     await call.save();
//     res.json(call);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };










import Call from "../models/Call.js";
import Volunteer from "../models/Volunteer.js";

// @desc    Get all calls (Admin only)
// @route   GET /api/calls
// @access  Private/Admin
export const getAllCalls = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const calls = await Call.find({})
      .populate('volunteerId', 'fullName email phone')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Call.countDocuments();

    res.status(200).json({
      success: true,
      count: calls.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      calls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new call (Public - for users to request help)
// @route   POST /api/calls
// @access  Public
export const createCall = async (req, res) => {
  try {
    const { userName, userPhone, notes } = req.body;

    // Validation
    if (!userName || !userPhone) {
      return res.status(400).json({
        success: false,
        message: 'User name and phone number are required'
      });
    }

    // Create new call
    const call = await Call.create({
      userName: userName.trim(),
      userPhone: userPhone.trim(),
      notes: notes ? notes.trim() : '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Call request created successfully',
      call
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single call by ID
// @route   GET /api/calls/:id
// @access  Private/Admin
export const getCallById = async (req, res) => {
  try {
    const call = await Call.findById(req.params.id)
      .populate('volunteerId', 'fullName email phone');

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    res.status(200).json({
      success: true,
      call
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update call
// @route   PUT /api/calls/:id
// @access  Private/Admin
export const updateCall = async (req, res) => {
  try {
    const call = await Call.findById(req.params.id);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    const updatedCall = await Call.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('volunteerId', 'fullName email phone');

    res.status(200).json({
      success: true,
      message: 'Call updated successfully',
      call: updatedCall
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete call
// @route   DELETE /api/calls/:id
// @access  Private/Admin
export const deleteCall = async (req, res) => {
  try {
    const call = await Call.findById(req.params.id);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    await Call.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Call deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get calls by status
// @route   GET /api/calls/status/:status
// @access  Private/Admin
export const getCallsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Validate status
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'ongoing'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
      });
    }

    const calls = await Call.find({ status })
      .populate('volunteerId', 'fullName email phone')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Call.countDocuments({ status });

    res.status(200).json({
      success: true,
      count: calls.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      status,
      calls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get calls statistics
// @route   GET /api/calls/stats/overview
// @access  Private/Admin
export const getCallsStatistics = async (req, res) => {
  try {
    const totalCalls = await Call.countDocuments();
    const pendingCalls = await Call.countDocuments({ status: 'pending' });
    const acceptedCalls = await Call.countDocuments({ status: { $in: ['accepted', 'completed'] } });
    const rejectedCalls = await Call.countDocuments({ status: 'rejected' });
    const ongoingCalls = await Call.countDocuments({ status: 'ongoing' });

    // Get calls from last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCalls = await Call.countDocuments({
      timestamp: { $gte: last24Hours }
    });

    // Get midnight calls (12 AM - 8 AM)
    const midnightCalls = await Call.aggregate([
      {
        $match: {
          status: { $in: ['accepted', 'completed'] },
          startTime: { $exists: true }
        }
      },
      {
        $addFields: {
          hour: { $hour: "$startTime" }
        }
      },
      {
        $match: {
          $or: [
            { hour: { $gte: 0, $lt: 8 } }, // 12 AM to 8 AM
          ]
        }
      },
      {
        $count: "midnightCount"
      }
    ]);

    const midnightCount = midnightCalls.length > 0 ? midnightCalls[0].midnightCount : 0;

    res.status(200).json({
      success: true,
      statistics: {
        totalCalls,
        pendingCalls,
        acceptedCalls,
        rejectedCalls,
        ongoingCalls,
        recentCalls,
        midnightCalls: midnightCount,
        acceptanceRate: totalCalls > 0 ? ((acceptedCalls / totalCalls) * 100).toFixed(1) : 0,
        rejectionRate: totalCalls > 0 ? ((rejectedCalls / totalCalls) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Assign call to available volunteer
// @route   POST /api/calls/:id/assign
// @access  Private/Admin
export const assignCallToVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const callId = req.params.id;

    // Check if call exists and is pending
    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    if (call.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Call is not available for assignment'
      });
    }

    // Check if volunteer exists and is available
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    if (volunteer.isCurrentlyInCall) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer is currently busy'
      });
    }

    // Assign call to volunteer
    call.volunteerId = volunteerId;
    call.status = 'assigned';
    await call.save();

    res.status(200).json({
      success: true,
      message: 'Call assigned to volunteer successfully',
      call
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};