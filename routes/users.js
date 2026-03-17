const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// @route   GET /api/users/staff
// @desc    Get all APPROVED staff members (for booking)
// @access  Public
router.get('/staff', async (req, res) => {
  try {
    const staff = await User.find({ 
      role: 'staff',
      isApproved: true  // Only show approved staff
    }).select('name email phone specialization availability');
    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/staff/pending
// @desc    Get all PENDING staff members (for approval)
// @access  Private (Admin only)
router.get('/staff/pending', auth, isAdmin, async (req, res) => {
  try {
    const pendingStaff = await User.find({ 
      role: 'staff',
      isApproved: false
    }).select('name email phone specialization createdAt');
    
    res.json(pendingStaff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/staff/all
// @desc    Get ALL staff members (approved and pending)
// @access  Private (Admin only)
router.get('/staff/all', auth, isAdmin, async (req, res) => {
  try {
    const allStaff = await User.find({ 
      role: 'staff'
    }).select('name email phone specialization isApproved approvedAt createdAt');
    
    res.json(allStaff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/staff/:id/approve
// @desc    Approve staff member and set specialization
// @access  Private (Admin only)
router.put('/staff/:id/approve', auth, isAdmin, async (req, res) => {
  try {
    const { specialization } = req.body;

    // Validate specialization is provided
    if (!specialization) {
      return res.status(400).json({ message: 'Specialization is required for approval' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'staff') {
      return res.status(400).json({ message: 'User is not a staff member' });
    }

    // Update user with approval
    user.isApproved = true;
    user.specialization = specialization;
    user.approvedBy = req.user.userId;
    user.approvedAt = new Date();

    await user.save();

    res.json({ 
      message: 'Staff member approved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        specialization: user.specialization,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/staff/:id/reject
// @desc    Reject/Remove staff member
// @access  Private (Admin only)
router.put('/staff/:id/reject', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'staff') {
      return res.status(400).json({ message: 'User is not a staff member' });
    }

    // Option 1: Delete the user completely
    await User.findByIdAndDelete(req.params.id);

    // Option 2: Change role back to customer (uncomment if preferred)
    // user.role = 'customer';
    // user.specialization = null;
    // user.isApproved = true;
    // await user.save();

    res.json({ message: 'Staff member rejected and removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/staff/:id/specialization
// @desc    Update staff specialization (can be used before or after approval)
// @access  Private (Admin only)
router.put('/staff/:id/specialization', auth, isAdmin, async (req, res) => {
  try {
    const { specialization } = req.body;

    if (!specialization) {
      return res.status(400).json({ message: 'Specialization is required' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'staff') {
      return res.status(400).json({ message: 'User is not a staff member' });
    }

    user.specialization = specialization;
    await user.save();

    res.json({ 
      message: 'Specialization updated successfully',
      user: {
        id: user._id,
        name: user.name,
        specialization: user.specialization
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (Admin or own profile)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is updating their own profile or is admin
    if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, phone, specialization, availability } = req.body;

    const updateData = { name, phone };
    
    // Only update staff-specific fields if user is staff
    if (req.user.role === 'staff' || req.user.role === 'admin') {
      if (specialization) updateData.specialization = specialization;
      if (availability) updateData.availability = availability;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/staff/:id
// @desc    Update staff member details
// @access  Private (Admin only)
router.put('/staff/:id', auth, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, specialization, isApproved } = req.body;
    
    const staff = await User.findById(req.params.id);
    
    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Check if email is being changed and if it's already in use
    if (email && email !== staff.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Update fields
    if (name) staff.name = name;
    if (email) staff.email = email;
    if (phone !== undefined) staff.phone = phone;
    if (specialization !== undefined) staff.specialization = specialization;
    
    // Handle approval status change
    if (typeof isApproved === 'boolean' && isApproved !== staff.isApproved) {
      staff.isApproved = isApproved;
      
      if (isApproved) {
        staff.approvedBy = req.user.userId;
        staff.approvedAt = new Date();
      } else {
        staff.approvedBy = null;
        staff.approvedAt = null;
      }
    }
    
    await staff.save();
    
    // Return staff without password
    const updatedStaff = await User.findById(req.params.id).select('-password');
    
    res.json({
      message: 'Staff member updated successfully',
      staff: updatedStaff
    });
    
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/staff/:id
// @desc    Delete staff member
// @access  Private (Admin only)
router.delete('/staff/:id', auth, isAdmin, async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    
    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Check if staff has any upcoming appointments
    const Appointment = require('../models/Appointment');
    const upcomingAppointments = await Appointment.countDocuments({
      staff: req.params.id,
      status: { $in: ['pending', 'confirmed'] },
      appointmentDate: { $gte: new Date().toISOString().split('T')[0] }
    });
    
    if (upcomingAppointments > 0) {
      return res.status(400).json({ 
        message: `Cannot delete staff member with ${upcomingAppointments} upcoming appointment(s). Please reassign or cancel them first.`,
        upcomingCount: upcomingAppointments
      });
    }
    
    // Delete the staff member
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Staff member deleted successfully',
      staffId: req.params.id
    });
    
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users
// @desc    Admin creates a new user
// @access  Private (Admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, role, specialization } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Password@123', salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'customer',
      isApproved: true, // admin-created users are auto-approved
    };

    if ((role === 'staff') && specialization) {
      userData.specialization = specialization;
    }

    const user = new User(userData);
    await user.save();

    const saved = await User.findById(user._id).select('-password');
    res.status(201).json({ message: 'User created successfully', user: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Admin deletes any user
// @access  Private (Admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent admin from deleting themselves
    if (req.user.userId === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
