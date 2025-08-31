
// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { body, validationResult } from 'express-validator';
// import Volunteer from '../models/Volunteer.js'; // Assuming correct path

// const router = express.Router();

// // Login validation middleware
// const loginValidation = [
//   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
//   body('password').notEmpty().withMessage('Password is required')
// ];

// // Login route
// router.post('/login', loginValidation, async (req, res) => {
//   try {
//     console.log('🔍 Login attempt:', req.body);
    
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.log('🔍 Validation errors:', errors.array());
//       return res.status(400).json({ 
//         success: false, 
//         errors: errors.array(),
//         message: errors.array()[0].msg
//       });
//     }

//     const { email, password } = req.body;

//     // Trim password to remove leading/trailing spaces
//     const trimmedPassword = password.trim();

//     // Find volunteer by email (including password field)
//     const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });
//     console.log('🔍 Volunteer found:', volunteer ? 'Yes' : 'No');
    
//     // Check if volunteer exists
//     if (!volunteer) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Invalid credentials' 
//       });
//     }

//     // Check if volunteer is approved (you can comment this out if not using approval system)
//     if (volunteer.status === 'inactive' || (volunteer.hasOwnProperty('isApproved') && !volunteer.isApproved)) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Your account is pending approval. Please contact the administrator.' 
//       });
//     }

//     // Verify password using the model's method
//     const isPasswordValid = await volunteer.matchPassword(trimmedPassword);
//     console.log('🔍 Password valid:', isPasswordValid);
    
//     // Check if password is correct
//     if (!isPasswordValid) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Invalid credentials' 
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { 
//         userId: volunteer._id, 
//         email: volunteer.email,
//         volunteerType: volunteer.volunteerType
//       },
//       process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
//       { 
//         expiresIn: '24h' // You can adjust the expiry time here if needed
//       }
//     );

//     console.log('🔍 Token generated successfully');

//     // Successful login - send response
//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token: token,
//       user: {
//         id: volunteer._id,
//         email: volunteer.email,
//         fullName: volunteer.fullName,
//         volunteerType: volunteer.volunteerType,
//         isApproved: volunteer.isApproved,
//         isActive: volunteer.isActive
//       }
//     });

//   } catch (error) {
//     console.error('❌ Login error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error. Please try again later.' 
//     });
//   }
// });

// // Logout route
// router.post('/logout', (req, res) => {
//   // For JWT, logout is mainly handled on frontend by removing token
//   // You could implement a blacklist here if needed
  
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
//           errors: errors.array(),
//           message: errors.array()[0].msg
//         });
//       }

//       const { email } = req.body;
//       const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });

//       // Don't reveal if user exists or not for security
//       res.status(200).json({
//         success: true,
//         message: 'If an account exists with this email, you will receive password reset instructions.'
//       });

//       // TODO: Implement actual password reset logic here
//       // Generate reset token, send email, etc.

//     } catch (error) {
//       console.error('❌ Password reset error:', error);
//       res.status(500).json({ 
//         success: false, 
//         message: 'Server error. Please try again later.' 
//       });
//     }
// });

// // Verify token middleware (for protected routes)
// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
  
//   if (!authHeader) {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'No authorization header provided' 
//     });
//   }

//   // Extract token from "Bearer <token>" format
//   const token = authHeader.split(' ')[1];
  
//   // Check if token exists and is not null/undefined
//   if (!token || token === 'null' || token === 'undefined') {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'No valid token provided' 
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
//     req.userId = decoded.userId;
//     req.userEmail = decoded.email;
//     req.volunteerType = decoded.volunteerType;
//     next();
//   } catch (error) {
//     console.error('❌ JWT Verification Error:', error.message);
    
//     // More specific error messages
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

// // Protected route - Get user profile
// router.get('/profile', verifyToken, async (req, res) => {
//   try {
//     console.log('🔍 Fetching profile for user:', req.userId);
    
//     const volunteer = await Volunteer.findById(req.userId).select('-password');
    
//     if (!volunteer) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Volunteer not found' 
//       });
//     }

//     console.log('🔍 Profile found:', volunteer.email);

//     res.status(200).json({
//       success: true,
//       user: volunteer
//     });

//   } catch (error) {
//     console.error('❌ Profile fetch error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error. Please try again later.' 
//     });
//   }
// });

// export default router;














// import express from 'express';
// import jwt from 'jsonwebtoken';
// import { body, validationResult } from 'express-validator';
// import Volunteer from '../models/Volunteer.js'; // Assuming correct path

// const router = express.Router();

// // Login validation middleware (No password check)
// const loginValidation = [
//   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
// ];

// // Login route (Email-based authentication only)
// router.post('/login', loginValidation, async (req, res) => {
//   try {
//     console.log('🔍 Login attempt:', req.body);
    
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.log('🔍 Validation errors:', errors.array());
//       return res.status(400).json({ 
//         success: false, 
//         errors: errors.array(),
//         message: errors.array()[0].msg
//       });
//     }

//     const { email } = req.body;

//     // Trim email to remove leading/trailing spaces
//     const trimmedEmail = email.trim().toLowerCase();

//     // Find volunteer by email (no password check now)
//     const volunteer = await Volunteer.findOne({ email: trimmedEmail });
//     console.log('🔍 Volunteer found:', volunteer ? 'Yes' : 'No');
    
//     // Check if volunteer exists
//     if (!volunteer) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Invalid credentials' 
//       });
//     }

//     // Check if volunteer is approved (you can comment this out if not using approval system)
//     if (volunteer.status === 'inactive' || (volunteer.hasOwnProperty('isApproved') && !volunteer.isApproved)) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Your account is pending approval. Please contact the administrator.' 
//       });
//     }

//     // Generate JWT token (No password check now)
//     const token = jwt.sign(
//       { 
//         userId: volunteer._id, 
//         email: volunteer.email,
//         volunteerType: volunteer.volunteerType
//       },
//       process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
//       { 
//         expiresIn: '24h' // You can adjust the expiry time here if needed
//       }
//     );

//     console.log('🔍 Token generated successfully');

//     // Successful login - send response
//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token: token,
//       user: {
//         id: volunteer._id,
//         email: volunteer.email,
//         fullName: volunteer.fullName,
//         volunteerType: volunteer.volunteerType,
//         isApproved: volunteer.isApproved,
//         isActive: volunteer.isActive
//       }
//     });

//   } catch (error) {
//     console.error('❌ Login error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error. Please try again later.' 
//     });
//   }
// });

// // Logout route
// router.post('/logout', (req, res) => {
//   // For JWT, logout is mainly handled on frontend by removing token
//   // You could implement a blacklist here if needed
  
//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// });

// // Password reset request route (Not using password validation here)
// router.post('/forgot-password', 
//   body('email').isEmail().normalizeEmail(),
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ 
//           success: false, 
//           errors: errors.array(),
//           message: errors.array()[0].msg
//         });
//       }

//       const { email } = req.body;
//       const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });

//       // Don't reveal if user exists or not for security
//       res.status(200).json({
//         success: true,
//         message: 'If an account exists with this email, you will receive password reset instructions.'
//       });

//       // TODO: Implement actual password reset logic here
//       // Generate reset token, send email, etc.

//     } catch (error) {
//       console.error('❌ Password reset error:', error);
//       res.status(500).json({ 
//         success: false, 
//         message: 'Server error. Please try again later.' 
//       });
//     }
// });

// // Verify token middleware (for protected routes)
// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
  
//   if (!authHeader) {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'No authorization header provided' 
//     });
//   }

//   // Extract token from "Bearer <token>" format
//   const token = authHeader.split(' ')[1];
  
//   // Check if token exists and is not null/undefined
//   if (!token || token === 'null' || token === 'undefined') {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'No valid token provided' 
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
//     req.userId = decoded.userId;
//     req.userEmail = decoded.email;
//     req.volunteerType = decoded.volunteerType;
//     next();
//   } catch (error) {
//     console.error('❌ JWT Verification Error:', error.message);
    
//     // More specific error messages
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

// // Protected route - Get user profile
// router.get('/profile', verifyToken, async (req, res) => {
//   try {
//     console.log('🔍 Fetching profile for user:', req.userId);
    
//     const volunteer = await Volunteer.findById(req.userId).select('-password');
    
//     if (!volunteer) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Volunteer not found' 
//       });
//     }

//     console.log('🔍 Profile found:', volunteer.email);

//     res.status(200).json({
//       success: true,
//       user: volunteer
//     });

//   } catch (error) {
//     console.error('❌ Profile fetch error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error. Please try again later.' 
//     });
//   }
// });

// export default router;









import express from 'express';
import { body, validationResult } from 'express-validator';
import Volunteer from '../models/Volunteer.js';

const router = express.Router();

// Login validation middleware
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required') // Password validation is kept but won't be used for JWT
];

// Volunteer Login route - No JWT, just email and password check
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

    const { email, password } = req.body;

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
        message: 'Your account is pending admin approval. Please wait for approval or contact support.' 
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

    // Response without token, just send volunteer data
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

// Volunteer Registration route (no password or JWT involved)
router.post('/register', async (req, res) => {
  try {
    console.log("Registration request received:", req.body);

    // Create new volunteer (without password)
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

// Logout route
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Password reset request route (no password involved, just email validation)
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

      // Logic to handle password reset (send reset email etc.)
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

// Admin route - Approve volunteer (still based on admin checking logic)
router.patch('/approve/:id', async (req, res) => {
  try {
    const volunteerId = req.params.id;

    // Check if the current user is an admin
    // Add admin check logic here

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
