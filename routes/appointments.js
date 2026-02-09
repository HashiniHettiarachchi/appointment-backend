const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { auth, isStaffOrAdmin } = require('../middleware/auth');

// @route   GET /api/appointments
// @desc    Get all appointments (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};

    // Customers see only their appointments
    if (req.user.role === 'customer') {
      query.customer = req.user.userId;
    }
    // Staff see only their appointments
    else if (req.user.role === 'staff') {
      query.staff = req.user.userId;
    }
    // Admin sees all appointments

    const appointments = await Appointment.find(query)
      .populate('customer', 'name email phone')
      .populate('staff', 'name specialization')
      .populate('service', 'name duration price')
      .sort({ appointmentDate: 1, startTime: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('staff', 'name specialization')
      .populate('service', 'name duration price');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission to view this appointment
    if (
      req.user.role === 'customer' && 
      appointment.customer._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (
      req.user.role === 'staff' && 
      appointment.staff._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { staff, service, appointmentDate, startTime, endTime, notes, paymentMethod, amount } = req.body;

    // Get service to fetch price if amount not provided
    const Service = require('../models/Service');
    const serviceData = await Service.findById(service);
    
    if (!serviceData) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Use provided amount or get from service
    const appointmentAmount = amount || serviceData.price;

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      staff,
      appointmentDate,
      startTime,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = new Appointment({
      customer: req.user.userId,
      staff,
      service,
      appointmentDate,
      startTime,
      endTime,
      notes,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: 'pending',
      amount: appointmentAmount
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('customer', 'name email phone')
      .populate('staff', 'name specialization')
      .populate('service', 'name duration price');

    res.status(201).json({ 
      message: 'Appointment created successfully', 
      appointment: populatedAppointment 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, appointmentDate, startTime, endTime, notes, paymentStatus, paidAt } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update fields
    if (status) appointment.status = status;
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (startTime) appointment.startTime = startTime;
    if (endTime) appointment.endTime = endTime;
    if (notes !== undefined) appointment.notes = notes;
    
    // Payment status updates (staff/admin only, but we'll allow for simplicity)
    if (paymentStatus) appointment.paymentStatus = paymentStatus;
    if (paidAt) appointment.paidAt = paidAt;

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('customer', 'name email phone')
      .populate('staff', 'name specialization')
      .populate('service', 'name duration price');

    res.json({ 
      message: 'Appointment updated successfully', 
      appointment: updatedAppointment 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update status to cancelled instead of deleting
    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
