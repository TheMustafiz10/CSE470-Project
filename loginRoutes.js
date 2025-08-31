
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { body, validationResult } = require('express-validator');

// // ✅ Use Volunteer model instead of User model
// const Volunteer = require('../models/Volunteer');

// // Login validation middleware
// const loginValidation = [
//   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
//   body('password').notEmpty().withMessage('Password is required')
// ];

// // Volunteer Login route
// router.post('/login', loginValidation, async (req, res) => {
//   try {
//     console.log("Login request:", req.body);
    
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ 
//         success: false, 
//         errors: errors.array() 
//       });
//     }

//     const { email, password } = req.body;

//     // ✅ Find volunteer by email (not user)
//     const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });
//     console.log("Volunteer fetched:", volunteer ? "YES" : "NO");
    
//     // Check if volunteer exists
//     if (!volunteer) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Invalid credentials' 
//       });
//     }

//     // ✅ Check approval status BEFORE password verification
//     if (!volunteer.isApproved) {
//       return res.status(403).json({ 
//         success: false, 
//         message: 'Your account is pending admin approval. Please wait for approval or contact support.' 
//       });
//     }

//     if (volunteer.status === "pending") {
//       return res.status(403).json({ 
//         success: false, 
//         message: 'Your account is not yet activated. Please contact admin.' 
//       });
//     }

//     if (volunteer.status === "inactive") {
//       return res.status(403).json({ 
//         success: false, 
//         message: 'Your account has been deactivated. Please contact admin.' 
//       });
//     }

//     // ✅ Use volunteer's matchPassword method (handles hashing properly)
//     console.log("=== DETAILED PASSWORD DEBUG ===");
//     console.log("Entered password:", password);
//     console.log("Entered password type:", typeof password);
//     console.log("Stored hash:", volunteer.password);
//     console.log("Hash starts with $2b$:", volunteer.password.startsWith('$2b$'));

//     // Test 1: Direct bcrypt comparison
//     let directResult = false;
//     try {
//       directResult = await bcrypt.compare(password, volunteer.password);
//       console.log("Direct bcrypt.compare result:", directResult);
//     } catch (error) {
//       console.error("Direct bcrypt error:", error);
//     }

//     // Test 2: Method comparison
//     let methodResult = false;
//     try {
//       methodResult = await volunteer.matchPassword(password);
//       console.log("matchPassword method result:", methodResult);
//     } catch (error) {
//       console.error("matchPassword error:", error);
//     }

//     console.log("=== END DEBUG ===");

//     // Use the direct comparison for now
//     const isPasswordValid = directResult;

//     if (!isPasswordValid) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Invalid credentials' 
//       });
//     }
//     // const isPasswordValid = await volunteer.matchPassword(password);

    
//     // // Check if password is correct
//     // if (!isPasswordValid) {
//     //   return res.status(401).json({ 
//     //     success: false, 
//     //     message: 'Invalid credentials' 
//     //   });
//     // }

//     // ✅ Update last login time
//     volunteer.lastLogin = new Date();
//     await volunteer.save();

//     // Generate JWT token with volunteer-specific data
//     const token = jwt.sign(
//       { 
//         volunteerId: volunteer._id,
//         email: volunteer.email,
//         volunteerType: volunteer.volunteerType,
//         isAdmin: volunteer.isAdmin
//       },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { 
//         expiresIn: '24h' 
//       }
//     );

//     // ✅ Successful login - send volunteer data
//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token: token,
//       volunteer: {
//         id: volunteer._id,
//         email: volunteer.email,
//         fullName: volunteer.fullName,
//         volunteerType: volunteer.volunteerType,
//         volunteerRoles: volunteer.volunteerRoles,
//         isAdmin: volunteer.isAdmin,
//         isApproved: volunteer.isApproved,
//         status: volunteer.status
//       }
//     });

//     console.log("✅ Login successful for:", email);

//   } catch (error) {
//     console.error('❌ Login error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error. Please try again later.' 
//     });
//   }
// });

// // Volunteer Registration route
// router.post('/register', async (req, res) => {
//   try {
//     console.log("Registration request received:", req.body);

//     // Create new volunteer
//     const volunteer = new Volunteer(req.body);
//     await volunteer.save();

//     console.log("✅ Volunteer registered successfully:", volunteer.email);

//     res.status(201).json({
//       success: true,
//       message: 'Registration successful. Your account is pending admin approval.',
//       volunteer: {
//         id: volunteer._id,
//         email: volunteer.email,
//         fullName: volunteer.fullName,
//         status: volunteer.status
//       }
//     });

//   } catch (error) {
//     console.error('❌ Registration error:', error);
    
//     // Handle duplicate email error
//     if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already exists. Please use a different email or try logging in.'
//       });
//     }

//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         details: validationErrors.join(', '),
//         errors: error.errors
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Registration failed. Please try again.',
//       details: error.message
//     });
//   }
// });

// // Logout route
// router.post('/logout', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// });

// // Password reset request route
// router.post('/forgot-password', 
//   body('email').isEmail().normalizeEmail(),
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ 
//           success: false, 
//           errors: errors.array() 
//         });
//       }

//       const { email } = req.body;
//       const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });

//       if (!volunteer) {
//         return res.status(200).json({
//           success: true,
//           message: 'If an account exists with this email, you will receive password reset instructions.'
//         });
//       }

//       // Generate reset token (implement your logic here)
//       // Send reset email (implement your logic here)

//       res.status(200).json({
//         success: true,
//         message: 'If an account exists with this email, you will receive password reset instructions.'
//       });

//     } catch (error) {
//       console.error('Password reset error:', error);
//       res.status(500).json({ 
//         success: false, 
//         message: 'Server error. Please try again later.' 
//       });
//     }
// });

// // ✅ Improved Verify token middleware (for protected routes)
// const verifyVolunteerToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
  
//   if (!authHeader) {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'No authorization header provided' 
//     });
//   }

//   const token = authHeader.split(' ')[1];
  
//   if (!token || token === 'null' || token === 'undefined') {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'No valid token provided' 
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//     req.volunteerId = decoded.volunteerId;
//     req.volunteerEmail = decoded.email;
//     req.isAdmin = decoded.isAdmin;
//     req.volunteerType = decoded.volunteerType;
//     next();
//   } catch (error) {
//     console.error('JWT Verification Error:', error.message);
    
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Invalid token format' 
//       });
//     } else if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Token has expired' 
//       });
//     } else {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Token verification failed' 
//       });
//     }
//   }
// };

// // Protected route - Get volunteer profile
// router.get('/profile', verifyVolunteerToken, async (req, res) => {
//   try {
//     const volunteer = await Volunteer.findById(req.volunteerId).select('-password');
    
//     if (!volunteer) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Volunteer not found' 
//       });
//     }

//     res.status(200).json({
//       success: true,
//       volunteer: volunteer
//     });

//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error. Please try again later.' 
//     });
//   }
// });

// // Admin route - Approve volunteer
// router.patch('/approve/:id', verifyVolunteerToken, async (req, res) => {
//   try {
//     // Check if user is admin
//     if (!req.isAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: 'Admin access required'
//       });
//     }

//     const volunteer = await Volunteer.findByIdAndUpdate(
//       req.params.id,
//       { 
//         isApproved: true, 
//         status: 'active' 
//       },
//       { new: true }
//     ).select('-password');

//     if (!volunteer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Volunteer not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Volunteer approved successfully',
//       volunteer: volunteer
//     });

//   } catch (error) {
//     console.error('Approve volunteer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error. Please try again later.'
//     });
//   }
// });

// module.exports = router;










// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { body, validationResult } = require('express-validator');

// // ✅ Use Volunteer model instead of User model
// const Volunteer = require('../models/Volunteer');

// // Login validation middleware
// const loginValidation = [
//   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
//   body('password').notEmpty().withMessage('Password is required') // keep field for validation, but won't be checked
// ];

// // Volunteer Login route - password check removed
// router.post('/login', loginValidation, async (req, res) => {
//   try {
//     console.log("Login request:", req.body);

//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ 
//         success: false, 
//         errors: errors.array() 
//       });
//     }

//     const { email } = req.body;

//     // Find volunteer by email
//     const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });
//     console.log("Volunteer fetched:", volunteer ? "YES" : "NO");

//     if (!volunteer) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Invalid credentials' 
//       });
//     }

//     // Check approval & status
//     if (!volunteer.isApproved) {
//       return res.status(403).json({ 
//         success: false, 
//         message: 'Your account is pending admin approval. Please wait for approval or contact support.' 
//       });
//     }

//     if (volunteer.status === "pending") {
//       return res.status(403).json({ 
//         success: false, 
//         message: 'Your account is not yet activated. Please contact admin.' 
//       });
//     }

//     if (volunteer.status === "inactive") {
//       return res.status(403).json({ 
//         success: false, 
//         message: 'Your account has been deactivated. Please contact admin.' 
//       });
//     }

//     // ✅ Update last login time
//     volunteer.lastLogin = new Date();
//     await volunteer.save();

//     // Generate JWT token (no password check)
//     const token = jwt.sign(
//       { 
//         volunteerId: volunteer._id,
//         email: volunteer.email,
//         volunteerType: volunteer.volunteerType,
//         isAdmin: volunteer.isAdmin
//       },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '24h' }
//     );

//     // Send response
//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token: token,
//       volunteer: {
//         id: volunteer._id,
//         email: volunteer.email,
//         fullName: volunteer.fullName,
//         volunteerType: volunteer.volunteerType,
//         volunteerRoles: volunteer.volunteerRoles,
//         isAdmin: volunteer.isAdmin,
//         isApproved: volunteer.isApproved,
//         status: volunteer.status
//       }
//     });

//     console.log("✅ Login successful for:", email);

//   } catch (error) {
//     console.error('❌ Login error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error. Please try again later.' 
//     });
//   }
// });

// // Volunteer Registration route
// router.post('/register', async (req, res) => {
//   try {
//     console.log("Registration request received:", req.body);

//     // Create new volunteer
//     const volunteer = new Volunteer(req.body);
//     await volunteer.save();

//     console.log("✅ Volunteer registered successfully:", volunteer.email);

//     res.status(201).json({
//       success: true,
//       message: 'Registration successful. Your account is pending admin approval.',
//       volunteer: {
//         id: volunteer._id,
//         email: volunteer.email,
//         fullName: volunteer.fullName,
//         status: volunteer.status
//       }
//     });

//   } catch (error) {
//     console.error('❌ Registration error:', error);
    
//     // Handle duplicate email error
//     if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already exists. Please use a different email or try logging in.'
//       });
//     }

//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         details: validationErrors.join(', '),
//         errors: error.errors
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Registration failed. Please try again.',
//       details: error.message
//     });
//   }
// });

// // Logout route
// router.post('/logout', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// });

// // Password reset request route
// router.post('/forgot-password', 
//   body('email').isEmail().normalizeEmail(),
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ 
//           success: false, 
//           errors: errors.array() 
//         });
//       }
    

//       const { email } = req.body;
//       const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });

//       if (!volunteer) {
//         return res.status(200).json({
//           success: true,
//           message: 'If an account exists with this email, you will receive password reset instructions.'
//         });
//       }

//       // Generate reset token (implement your logic here)
//       // Send reset email (implement your logic here)

//       res.status(200).json({
//         success: true,
//         message: 'If an account exists with this email, you will receive password reset instructions.'
//       });

//     } catch (error) {
//       console.error('Password reset error:', error);
//       res.status(500).json({ 
//         success: false, 
//         message: 'Server error. Please try again later.' 
//       });
//   }
// );

// // ✅ Improved Verify token middleware (for protected routes)
// const verifyVolunteerToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
  
//   if (!authHeader) {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'No authorization header provided' 
//     });
//   }

//   const token = authHeader.split(' ')[1];
  
//   if (!token || token === 'null' || token === 'undefined') {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'No valid token provided' 
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//     req.volunteerId = decoded.volunteerId;
//     req.volunteerEmail = decoded.email;
//     req.isAdmin = decoded.isAdmin;
//     req.volunteerType = decoded.volunteerType;
//     next();
//   } catch (error) {
//     console.error('JWT Verification Error:', error.message);
    
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Invalid token format' 
//       });
//     } else if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Token has expired' 
//       });
//     } else {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Token verification failed' 
//       });
//     }
//   }
// };

// // Protected route - Get volunteer profile
// router.get('/profile', verifyVolunteerToken, async (req, res) => {
//   try {
//     const volunteer = await Volunteer.findById(req.volunteerId).select('-password');
    
//     if (!volunteer) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Volunteer not found' 
//       });
//     }

//     res.status(200).json({
//       success: true,
//       volunteer: volunteer
//     });

//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error. Please try again later.' 
//     });
//   }
// });

// // Admin route - Approve volunteer
// router.patch('/approve/:id', verifyVolunteerToken, async (req, res) => {
//   try {
//     // Check if user is admin
//     if (!req.isAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: 'Admin access required'
//       });
//     }

//     const volunteer = await Volunteer.findByIdAndUpdate(
//       req.params.id,
//       { 
//         isApproved: true, 
//         status: 'active' 
//       },
//       { new: true }
//     ).select('-password');

//     if (!volunteer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Volunteer not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Volunteer approved successfully',
//       volunteer: volunteer
//     });

//   } catch (error) {
//     console.error('Approve volunteer error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error. Please try again later.' 
//     });
//   }
// });

// module.exports = router;








// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { body, validationResult } = require('express-validator');

// // ✅ Use Volunteer model
// const Volunteer = require('../models/Volunteer');

// // Login validation middleware
// const loginValidation = [
//   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
//   body('password').notEmpty().withMessage('Password is required') // field kept for validation
// ];

// // Volunteer Login route (password check removed)
// router.post('/login', loginValidation, async (req, res) => {
//   try {
//     console.log("Login request:", req.body);

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ 
//         success: false, 
//         errors: errors.array() 
//       });
//     }

//     const { email } = req.body;

//     // Find volunteer by email
//     const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });
//     console.log("Volunteer fetched:", volunteer ? "YES" : "NO");

//     if (!volunteer) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Invalid credentials' 
//       });
//     }

//     // Check approval & status
//     if (!volunteer.isApproved) {
//       return res.status(403).json({ 
//         success: false, 
//         message: 'Your account is pending admin approval. Please wait or contact support.' 
//       });
//     }

//     if (volunteer.status === "pending") {
//       return res.status(403).json({ 
//         success: false, 
//         message: 'Your account is not yet activated. Please contact admin.' 
//       });
//     }

//     if (volunteer.status === "inactive") {
//       return res.status(403).json({ 
//         success: false, 
//         message: 'Your account has been deactivated. Please contact admin.' 
//       });
//     }

//     // Update last login time
//     volunteer.lastLogin = new Date();
//     await volunteer.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { 
//         volunteerId: volunteer._id,
//         email: volunteer.email,
//         volunteerType: volunteer.volunteerType,
//         isAdmin: volunteer.isAdmin
//       },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '24h' }
//     );

//     // Send response
//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token: token,
//       volunteer: {
//         id: volunteer._id,
//         email: volunteer.email,
//         fullName: volunteer.fullName,
//         volunteerType: volunteer.volunteerType,
//         volunteerRoles: volunteer.volunteerRoles,
//         isAdmin: volunteer.isAdmin,
//         isApproved: volunteer.isApproved,
//         status: volunteer.status
//       }
//     });

//     console.log("✅ Login successful for:", email);

//   } catch (error) {
//     console.error('❌ Login error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error. Please try again later.' 
//     });
//   }
// });

// // Volunteer Registration route
// router.post('/register', async (req, res) => {
//   try {
//     console.log("Registration request received:", req.body);

//     const volunteer = new Volunteer(req.body);
//     await volunteer.save();

//     console.log("✅ Volunteer registered successfully:", volunteer.email);

//     res.status(201).json({
//       success: true,
//       message: 'Registration successful. Your account is pending admin approval.',
//       volunteer: {
//         id: volunteer._id,
//         email: volunteer.email,
//         fullName: volunteer.fullName,
//         status: volunteer.status
//       }
//     });

//   } catch (error) {
//     console.error('❌ Registration error:', error);

//     if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already exists. Please use a different email or try logging in.'
//       });
//     }

//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         details: validationErrors.join(', '),
//         errors: error.errors
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Registration failed. Please try again.',
//       details: error.message
//     });
//   }
// });

// // Logout route
// router.post('/logout', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// });

// // Password reset request route
// router.post('/forgot-password', 
//   body('email').isEmail().normalizeEmail(),
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ 
//           success: false, 
//           errors: errors.array() 
//         });
//       }

//       const { email } = req.body;
//       const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });

//       if (!volunteer) {
//         return res.status(200).json({
//           success: true,
//           message: 'If an account exists with this email, you will receive password reset instructions.'
//         });
//       }

//       // Generate reset token & send email (implement your logic here)
//       res.status(200).json({
//         success: true,
//         message: 'If an account exists with this email, you will receive password reset instructions.'
//       });

//     } catch (error) {
//       console.error('Password reset error:', error);
//       res.status(500).json({ 
//         success: false, 
//         message: 'Server error. Please try again later.' 
//       });
//     }
// });

// // ✅ Verify token middleware
// const verifyVolunteerToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
  
//   if (!authHeader) {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'No authorization header provided' 
//     });
//   }

//   const token = authHeader.split(' ')[1];
  
//   if (!token || token === 'null' || token === 'undefined') {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'No valid token provided' 
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//     req.volunteerId = decoded.volunteerId;
//     req.volunteerEmail = decoded.email;
//     req.isAdmin = decoded.isAdmin;
//     req.volunteerType = decoded.volunteerType;
//     next();
//   } catch (error) {
//     console.error('JWT Verification Error:', error.message);
    
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ success: false, message: 'Invalid token format' });
//     } else if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ success: false, message: 'Token has expired' });
//     } else {
//       return res.status(401).json({ success: false, message: 'Token verification failed' });
//     }
//   }
// };

// // Protected route - Get volunteer profile
// router.get('/profile', verifyVolunteerToken, async (req, res) => {
//   try {
//     const volunteer = await Volunteer.findById(req.volunteerId).select('-password');
    
//     if (!volunteer) {
//       return res.status(404).json({ success: false, message: 'Volunteer not found' });
//     }

//     res.status(200).json({ success: true, volunteer: volunteer });

//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
//   }
// });

// // Admin route - Approve volunteer
// router.patch('/approve/:id', verifyVolunteerToken, async (req, res) => {
//   try {
//     if (!req.isAdmin) {
//       return res.status(403).json({ success: false, message: 'Admin access required' });
//     }

//     const volunteer = await Volunteer.findByIdAndUpdate(
//       req.params.id,
//       { isApproved: true, status: 'active' },
//       { new: true }
//     ).select('-password');

//     if (!volunteer) {
//       return res.status(404).json({ success: false, message: 'Volunteer not found' });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Volunteer approved successfully',
//       volunteer: volunteer
//     });

//   } catch (error) {
//     console.error('Approve volunteer error:', error);
//     res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
//   }
// });

// module.exports = router; // ✅ fixed syntax issue












import express from 'express';
import { body, validationResult } from 'express-validator';
import Volunteer from '../models/Volunteer.js'; 

const router = express.Router();

// Login validation middleware
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
];

// Volunteer Login route - password check removed, no JWT
router.post('/login', loginValidation, async (req, res) => {
  try {
    console.log("Login request:", req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email } = req.body;

    // Find volunteer by email
    const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });
    console.log("Volunteer fetched:", volunteer ? "YES" : "NO");

    if (!volunteer) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check approval & status
    if (!volunteer.isApproved) {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is pending admin approval. Please wait or contact support.' 
      });
    }

    if (volunteer.status === "pending") {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is not yet activated. Please contact admin.' 
      });
    }

    if (volunteer.status === "inactive") {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account has been deactivated. Please contact admin.' 
      });
    }

    // Update last login time
    volunteer.lastLogin = new Date();
    await volunteer.save();

    // Respond without token, just send volunteer data
    res.status(200).json({
      success: true,
      message: 'Login successful',
      volunteer: {
        id: volunteer._id,
        email: volunteer.email,
        fullName: volunteer.fullName,
        volunteerType: volunteer.volunteerType,
        volunteerRoles: volunteer.volunteerRoles,
        isAdmin: volunteer.isAdmin,
        isApproved: volunteer.isApproved,
        status: volunteer.status
      }
    });

    console.log("✅ Login successful for:", email);

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

// Volunteer Registration route - no password, no JWT
router.post('/register', async (req, res) => {
  try {
    console.log("Registration request received:", req.body);

    // Create new volunteer (no password)
    const volunteer = new Volunteer(req.body);
    await volunteer.save();

    console.log("✅ Volunteer registered successfully:", volunteer.email);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Your account is pending admin approval.',
      volunteer: {
        id: volunteer._id,
        email: volunteer.email,
        fullName: volunteer.fullName,
        status: volunteer.status
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists. Please use a different email or try logging in.'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: validationErrors.join(', '),
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      details: error.message
    });
  }
});

// Logout route - no token needed
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Password reset route - no password involved here
router.post('/forgot-password', 
  body('email').isEmail().normalizeEmail(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { email } = req.body;
      const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });

      if (!volunteer) {
        return res.status(200).json({
          success: true,
          message: 'If an account exists with this email, you will receive password reset instructions.'
        });
      }

      // Handle password reset logic (not used here)
      res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions.'
      });

    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error. Please try again later.' 
      });
    }
});

// Admin route - Approve volunteer
router.patch('/approve/:id', async (req, res) => {
  try {
    const volunteerId = req.params.id;

    // Add admin check logic here if necessary

    // Find the volunteer by ID and update `isApproved` status
    const volunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { isApproved: true, status: 'active' },
      { new: true }
    ).select('-password'); // Do not return password field

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer approved successfully',
      volunteer
    });

  } catch (error) {
    console.error('Approve volunteer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

export default router;
