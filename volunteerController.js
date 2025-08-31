

import Volunteer from '../models/Volunteer.js';
import UpdateRequest from '../models/UpdateRequest.js';
import Activity from '../models/Activity.js';
import Call from '../models/Call.js';
import Announcement from '../models/Announcement.js';

// Register volunteer
export const registerVolunteer = async (req, res, io) => {
  try {
    console.log('📝 Registration attempt:', req.body);
    
    const {
      fullName,
      email,
      phone,
      dob,
      address,
      volunteerType,
      volunteerRoles,
      availability,
      additionalInfo,
      consent,
      registrationDate,
      isAdmin
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !dob || !address || !volunteerType || !volunteerRoles || !availability || !consent) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if volunteer already exists
    const volunteerExists = await Volunteer.findOne({ email: email.toLowerCase() });
    if (volunteerExists) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer with this email already exists'
      });
    }

    // Create volunteer with proper data structure
    const volunteerData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      dob: new Date(dob),
      address: {
        street: address.street?.trim() || '',
        city: address.city?.trim() || '',
        state: address.state?.trim() || '',
        postalCode: address.postalCode?.trim() || '',
        country: address.country || 'Bangladesh'
      },
      volunteerType,
      volunteerRoles: Array.isArray(volunteerRoles) ? volunteerRoles : [volunteerRoles],
      availability: {
        days: Array.isArray(availability.days) ? availability.days : [availability.days],
        times: Array.isArray(availability.times) ? availability.times : [availability.times],
        timezone: availability.timezone || 'Asia/Dhaka'
      },
      additionalInfo: {
        whyVolunteer: additionalInfo?.whyVolunteer || '',
        skillsExperience: additionalInfo?.skillsExperience || '',
        experience: additionalInfo?.experience || '',
        motivation: additionalInfo?.motivation || '',
        skills: Array.isArray(additionalInfo?.skills) ? additionalInfo.skills : []
      },
      consent: {
        agreePolicy: consent.agreePolicy === true,
        consentContact: consent.consentContact === true,
        confirmInfo: consent.confirmInfo === true,
        cyberLawConsent: consent.cyberLawConsent === true
      },
      registrationDate: registrationDate ? new Date(registrationDate) : new Date(),
      isAdmin: isAdmin || false,
      isApproved: false,
      status: 'pending',
      isActive: true
    };

    console.log('📋 Creating volunteer with data:', volunteerData);

    const volunteer = await Volunteer.create(volunteerData);

    console.log('✅ New volunteer registered:', volunteer._id);

    // Emit real-time event to admin dashboard
    if (io) {
      io.to('volunteerRoom').emit('newVolunteer', volunteer);
      console.log('📡 Emitted newVolunteer event to volunteerRoom');
    }

    res.status(201).json({
      success: true,
      message: "Registration successful! Your account is pending admin approval.",
      data: {
        _id: volunteer._id,
        fullName: volunteer.fullName,
        email: volunteer.email,
        phone: volunteer.phone,
        volunteerType: volunteer.volunteerType,
        status: volunteer.status,
        isApproved: volunteer.isApproved,
        registrationDate: volunteer.registrationDate
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};

// Login volunteer
export const loginVolunteer = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const volunteer = await Volunteer.findOne({ email: email.toLowerCase().trim() });
    
    if (!volunteer) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email address" 
      });
    }

    // Check approval status
    if (!volunteer.isApproved || volunteer.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. Please wait or contact support.',
        data: {
          status: volunteer.status,
          isApproved: volunteer.isApproved
        }
      });
    }

    if (volunteer.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: 'Your account has been rejected. Please contact admin.'
      });
    }

    if (volunteer.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.'
      });
    }

    // Update last login
    volunteer.lastLogin = new Date();
    await volunteer.save();

    console.log('✅ Volunteer logged in:', volunteer.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: volunteer._id,
        email: volunteer.email,
        fullName: volunteer.fullName,
        phone: volunteer.phone,
        volunteerType: volunteer.volunteerType,
        volunteerRoles: volunteer.volunteerRoles,
        address: volunteer.address,
        availability: volunteer.availability,
        additionalInfo: volunteer.additionalInfo,
        isAdmin: volunteer.isAdmin,
        isApproved: volunteer.isApproved,
        status: volunteer.status,
        registrationDate: volunteer.registrationDate,
        lastLogin: volunteer.lastLogin
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try later.',
      error: error.message 
    });
  }
};

// Get pending volunteers (for Admin Dashboard)
export const getPendingVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ 
      status: 'pending', 
      isApproved: false 
    })
      .select('fullName email phone volunteerType registrationDate address availability volunteerRoles additionalInfo status isApproved')
      .sort({ registrationDate: -1 });

    console.log(`📊 Found ${volunteers.length} pending volunteers`);
    
    res.json({ 
      success: true, 
      data: volunteers,
      count: volunteers.length
    });
  } catch (error) {
    console.error('❌ Error fetching pending volunteers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get single volunteer
export const getVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer not found' 
      });
    }

    res.json({ 
      success: true, 
      data: volunteer 
    });
  } catch (error) {
    console.error('❌ Error fetching volunteer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get all volunteers (paginated)
export const getVolunteers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const volunteers = await Volunteer.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Volunteer.countDocuments();
    const totalPages = Math.ceil(total / limit);

    console.log(`📊 Retrieved ${volunteers.length} volunteers (page ${page}/${totalPages})`);

    res.json({
      success: true,
      data: volunteers,
      pagination: { 
        page, 
        limit, 
        total, 
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Error fetching volunteers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Update volunteer
export const updateVolunteer = async (req, res, io) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!volunteer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer not found' 
      });
    }
    
    console.log('🔄 Volunteer updated:', volunteer._id);
    
    // Emit real-time update
    if (io) {
      io.to('volunteerRoom').emit('volunteerUpdated', volunteer);
      console.log('📡 Emitted volunteerUpdated event');
    }
    
    res.json({ 
      success: true, 
      message: 'Volunteer updated successfully', 
      data: volunteer 
    });
  } catch (error) {
    console.error('❌ Error updating volunteer:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Approve a volunteer
export const approveVolunteer = async (req, res, io) => {
  try {
    console.log('🔄 Approving volunteer:', req.params.id);
    
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved', 
        isApproved: true,
        isActive: true 
      },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer not found' 
      });
    }

    console.log('✅ Volunteer approved:', volunteer._id, volunteer.fullName);

    // Emit real-time update
    if (io) {
      io.to('volunteerRoom').emit('volunteerUpdated', volunteer);
      console.log('📡 Emitted volunteerUpdated event for approval');
    }

    res.json({ 
      success: true, 
      message: 'Volunteer approved successfully', 
      data: volunteer 
    });
  } catch (error) {
    console.error('❌ Error approving volunteer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Reject a volunteer
export const rejectVolunteer = async (req, res, io) => {
  try {
    console.log('🔄 Rejecting volunteer:', req.params.id);
    
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected', 
        isApproved: false,
        isActive: false 
      },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer not found' 
      });
    }

    console.log('❌ Volunteer rejected:', volunteer._id, volunteer.fullName);

    // Emit real-time update
    if (io) {
      io.to('volunteerRoom').emit('volunteerUpdated', volunteer);
      console.log('📡 Emitted volunteerUpdated event for rejection');
    }

    res.json({ 
      success: true, 
      message: 'Volunteer rejected successfully', 
      data: volunteer 
    });
  } catch (error) {
    console.error('❌ Error rejecting volunteer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Delete volunteer
export const deleteVolunteer = async (req, res, io) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer not found' 
      });
    }

    // Clean up related data
    await Promise.all([
      UpdateRequest.deleteMany({ volunteerId: req.params.id }),
      Activity.deleteMany({ volunteerId: req.params.id })
    ]);

    console.log('🗑️ Volunteer deleted:', req.params.id);

    // Emit real-time update
    if (io) {
      io.to('volunteerRoom').emit('volunteerDeleted', req.params.id);
      console.log('📡 Emitted volunteerDeleted event');
    }

    res.json({ 
      success: true, 
      message: 'Volunteer deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting volunteer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get volunteer profile
export const getProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: volunteer 
    });
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!volunteer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully', 
      data: volunteer 
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer not found' 
      });
    }

    // Clean up related data
    await Promise.all([
      UpdateRequest.deleteMany({ volunteerId: req.params.id }),
      Activity.deleteMany({ volunteerId: req.params.id })
    ]);

    res.json({ 
      success: true, 
      message: 'Profile deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Upload profile image placeholder
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image uploaded' 
      });
    }
    
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.body.volunteerId, 
      {
        profileImage: `/Uploads/profiles/${req.file.filename}`
      }, 
      { new: true }
    );
    
    if (!volunteer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Profile image uploaded successfully', 
      data: { 
        imageUrl: volunteer.profileImage 
      } 
    });
  } catch (error) {
    console.error('❌ Upload profile image error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get volunteer calls (accepted and rejected)
export const getVolunteerCalls = async (req, res) => {
  try {
    const { id } = req.params;

    const [accepted, rejected] = await Promise.all([
      Call.find({ 
        volunteerId: id, 
        status: { $in: ['accepted', 'completed'] } 
      }).sort({ createdAt: -1 }),
      Call.find({ 
        volunteerId: id, 
        status: 'rejected' 
      }).sort({ createdAt: -1 })
    ]);

    const formatCalls = (calls) =>
      calls.map((c) => ({
        ...c.toObject(),
        date: c.createdAt ? c.createdAt.toLocaleDateString() : '',
        time: c.startTime ? c.startTime.toLocaleTimeString() : (c.createdAt ? c.createdAt.toLocaleTimeString() : ''),
        userName: c.userName || 'Unknown User',
        userPhone: c.userPhone || 'Unknown',
        duration: c.duration || '0h 0m 0s',
        deEscalated: c.deEscalated || false,
      }));

    res.json({
      success: true,
      data: {
        acceptedCalls: formatCalls(accepted),
        rejectedCalls: formatCalls(rejected),
      }
    });
  } catch (error) {
    console.error('❌ Error fetching calls:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Alias for getVolunteerCalls
export const getVolunteerCallHistory = getVolunteerCalls;

// Get incoming calls
export const getIncomingCalls = async (req, res) => {
  try {
    const incomingCalls = await Call.find({ status: 'incoming' })
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: incomingCalls 
    });
  } catch (error) {
    console.error('❌ Error fetching incoming calls:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Accept call
export const acceptCall = async (req, res, io) => {
  try {
    const { callId, volunteerId } = req.body;

    const call = await Call.findById(callId);
    
    if (!call) {
      return res.status(404).json({ 
        success: false, 
        message: 'Call not found' 
      });
    }
    
    if (call.status === 'accepted') {
      return res.status(400).json({ 
        success: false, 
        message: 'Call already accepted' 
      });
    }

    call.status = 'accepted';
    call.volunteerId = volunteerId;
    call.acceptedAt = new Date();
    await call.save();

    // Emit real-time update
    if (io) {
      io.to('callRoom').emit('newCall', call);
      console.log('📡 Emitted call accepted event');
    }

    res.json({ 
      success: true, 
      message: 'Call accepted successfully', 
      data: call 
    });
  } catch (error) {
    console.error('❌ Error accepting call:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Reject call
export const rejectCall = async (req, res, io) => {
  try {
    const { callId, volunteerId } = req.body;

    const call = await Call.findById(callId);
    
    if (!call) {
      return res.status(404).json({ 
        success: false, 
        message: 'Call not found' 
      });
    }
    
    if (call.status === 'rejected') {
      return res.status(400).json({ 
        success: false, 
        message: 'Call already rejected' 
      });
    }

    call.status = 'rejected';
    call.volunteerId = volunteerId;
    call.rejectedAt = new Date();
    await call.save();

    // Emit real-time update
    if (io) {
      io.to('callRoom').emit('newCall', call);
      console.log('📡 Emitted call rejected event');
    }

    res.json({ 
      success: true, 
      message: 'Call rejected successfully', 
      data: call 
    });
  } catch (error) {
    console.error('❌ Error rejecting call:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// End call
export const endCall = async (req, res, io) => {
  try {
    const { callId, volunteerId } = req.body;

    const call = await Call.findById(callId);
    
    if (!call) {
      return res.status(404).json({ 
        success: false, 
        message: 'Call not found' 
      });
    }
    
    if (call.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Call already ended' 
      });
    }

    call.status = 'completed';
    call.volunteerId = volunteerId;
    call.completedAt = new Date();
    await call.save();

    // Emit real-time update
    if (io) {
      io.to('callRoom').emit('newCall', call);
      console.log('📡 Emitted call completed event');
    }

    res.json({ 
      success: true, 
      message: 'Call ended successfully', 
      data: call 
    });
  } catch (error) {
    console.error('❌ Error ending call:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Request update submission
export const submitUpdateRequest = async (req, res, io) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const volunteer = await Volunteer.findById(id);
    
    if (!volunteer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer not found' 
      });
    }

    const existingRequest = await UpdateRequest.findOne({ 
      volunteerId: id, 
      status: 'pending' 
    });
    
    if (existingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a pending update request' 
      });
    }

    const newRequest = await UpdateRequest.create({
      volunteerId: id,
      updatedData: updateData,
      requestedFields: Object.keys(updateData),
      status: 'pending',
      createdAt: new Date()
    });

    console.log('New update request:', newRequest._id);
    
    // Emit real-time update
    if (io) {
      io.to('updateRequestRoom').emit('newUpdateRequest', newRequest);
      console.log('📡 Emitted newUpdateRequest event');
    }

    res.status(201).json({ 
      success: true, 
      message: 'Update request submitted successfully', 
      data: newRequest 
    });
  } catch (error) {
    console.error('❌ Error submitting update request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get all update requests
export const getUpdateRequests = async (req, res) => {
  try {
    const requests = await UpdateRequest.find()
      .populate('volunteerId', 'fullName email volunteerType')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: requests 
    });
  } catch (error) {
    console.error('❌ Error fetching update requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get volunteer update requests
export const getVolunteerUpdateRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const requests = await UpdateRequest.find({ volunteerId: id })
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: requests 
    });
  } catch (error) {
    console.error('❌ Error fetching volunteer update requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Approve update request
export const approveUpdateRequest = async (req, res, io) => {
  try {
    const { requestId } = req.params;
    const { adminResponse } = req.body;

    const request = await UpdateRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found' 
      });
    }

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      request.volunteerId, 
      request.updatedData, 
      { new: true, runValidators: true }
    );

    if (!updatedVolunteer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Volunteer not found' 
      });
    }

    request.status = 'approved';
    request.adminResponse = adminResponse || 'Approved';
    request.processedAt = new Date();
    await request.save();
    
    // Delete the request after processing
    await UpdateRequest.findByIdAndDelete(requestId);

    console.log('Update request approved:', requestId);
    
    // Emit real-time updates
    if (io) {
      io.to('updateRequestRoom').emit('updateRequestApproved', requestId);
      io.to('volunteerRoom').emit('volunteerUpdated', updatedVolunteer);
      console.log('📡 Emitted update request approved events');
    }

    res.json({ 
      success: true, 
      message: 'Update request approved successfully', 
      data: updatedVolunteer 
    });
  } catch (error) {
    console.error('❌ Error approving update request:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Reject update request
export const rejectUpdateRequest = async (req, res, io) => {
  try {
    const { requestId } = req.params;
    const { adminResponse } = req.body;

    const request = await UpdateRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found' 
      });
    }

    request.status = 'rejected';
    request.adminResponse = adminResponse || 'Rejected';
    request.processedAt = new Date();
    await request.save();
    
    // Delete the request after processing
    await UpdateRequest.findByIdAndDelete(requestId);

    console.log('Update request rejected:', requestId);
    
    // Emit real-time update
    if (io) {
      io.to('updateRequestRoom').emit('updateRequestRejected', requestId);
      console.log('📡 Emitted update request rejected event');
    }

    res.json({ 
      success: true, 
      message: 'Update request rejected successfully', 
      data: request 
    });
  } catch (error) {
    console.error('❌ Error rejecting update request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Delete update request
export const deleteUpdateRequest = async (req, res, io) => {
  try {
    const { id, requestId } = req.params;

    const request = await UpdateRequest.findOneAndDelete({ 
      _id: requestId, 
      volunteerId: id 
    });
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found' 
      });
    }

    console.log('Update request deleted:', requestId);
    
    // Emit real-time update
    if (io) {
      io.to('updateRequestRoom').emit('updateRequestDeleted', requestId);
      console.log('📡 Emitted update request deleted event');
    }

    res.json({ 
      success: true, 
      message: 'Request deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting update request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Activity handlers
export const getActivities = async (req, res) => {
  try {
    const { id } = req.params;
    const activities = await Activity.find({ volunteerId: id })
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: activities 
    });
  } catch (error) {
    console.error('❌ Error fetching activities:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

export const createActivity = async (req, res, io) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const activity = await Activity.create({ 
      volunteerId: id, 
      ...data 
    });
    
    console.log('New activity created:', activity._id);
    
    // Emit real-time update
    if (io) {
      io.to('activityRoom').emit('newActivity', activity);
      console.log('📡 Emitted newActivity event');
    }

    res.status(201).json({ 
      success: true, 
      message: 'Activity created successfully', 
      data: activity 
    });
  } catch (error) {
    console.error('❌ Error creating activity:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

export const updateActivity = async (req, res, io) => {
  try {
    const { id, activityId } = req.params;
    
    const activity = await Activity.findOneAndUpdate(
      { _id: activityId, volunteerId: id }, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found' 
      });
    }
    
    console.log('Activity updated:', activity._id);
    
    // Emit real-time update
    if (io) {
      io.to('activityRoom').emit('activityUpdated', activity);
      console.log('📡 Emitted activityUpdated event');
    }

    res.json({ 
      success: true, 
      message: 'Activity updated successfully', 
      data: activity 
    });
  } catch (error) {
    console.error('❌ Error updating activity:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

export const deleteActivity = async (req, res, io) => {
  try {
    const { id, activityId } = req.params;
    
    const activity = await Activity.findOneAndDelete({ 
      _id: activityId, 
      volunteerId: id 
    });
    
    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found' 
      });
    }
    
    console.log('Activity deleted:', activityId);
    
    // Emit real-time update
    if (io) {
      io.to('activityRoom').emit('activityDeleted', activityId);
      console.log('📡 Emitted activityDeleted event');
    }

    res.json({ 
      success: true, 
      message: 'Activity deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting activity:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Statistics
export const getStatistics = async (req, res) => {
  try {
    const [
      total,
      approved,
      pending,
      helpline,
      nonHelpline
    ] = await Promise.all([
      Volunteer.countDocuments(),
      Volunteer.countDocuments({ isApproved: true }),
      Volunteer.countDocuments({ status: 'pending' }),
      Volunteer.countDocuments({ volunteerType: 'helpline', isApproved: true }),
      Volunteer.countDocuments({ volunteerType: 'non-helpline', isApproved: true })
    ]);

    const stats = { total, approved, pending, helpline, nonHelpline };
    
    console.log('Statistics retrieved:', stats);

    res.json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Search volunteers (admin)
export const searchVolunteers = async (req, res) => {
  try {
    const { query, type, status } = req.query;
    let filter = {};

    if (query) {
      filter.$or = [
        { fullName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ];
    }
    
    if (type) filter.volunteerType = type;
    if (status) filter.status = status;

    const volunteers = await Volunteer.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`Search results: ${volunteers.length} volunteers found`);

    res.json({ 
      success: true, 
      data: volunteers,
      count: volunteers.length
    });
  } catch (error) {
    console.error('❌ Error searching volunteers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};