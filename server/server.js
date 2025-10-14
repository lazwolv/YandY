require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const {
    sendVerificationCode,
    sendAppointmentConfirmation,
    sendAppointmentReminder
} = require('./services/twilioService');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.post('/api/auth/request-verification', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Format phone number
        const formattedPhone = phoneNumber.replace(/\D/g, '');

        // Check if user exists
        let user = await User.findOne({ phoneNumber: formattedPhone });

        if (!user) {
            // Create new user if doesn't exist
            user = new User({
                phoneNumber: formattedPhone,
                isVerified: false
            });
        }

        // Generate and save verification code
        const code = user.generateVerificationCode();
        await user.save();

        // Send verification code via SMS
        const sent = await sendVerificationCode(formattedPhone, code);

        if (sent) {
            res.status(200).json({ message: 'Verification code sent' });
        } else {
            res.status(500).json({ message: 'Failed to send verification code' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
});

app.post('/api/auth/verify', async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;
        const formattedPhone = phoneNumber.replace(/\D/g, '');

        const user = await User.findOne({ phoneNumber: formattedPhone });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verifyCode(code)) {
            user.isVerified = true;
            user.verificationCode = undefined;
            await user.save();

            res.status(200).json({
                message: 'Verification successful',
                user: {
                    id: user._id,
                    phoneNumber: user.phoneNumber,
                    isVerified: user.isVerified
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid verification code' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying code', error: error.message });
    }
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { clientId, technicianId, service, startTime, endTime } = req.body;

        const appointment = new Appointment({
            client: clientId,
            technician: technicianId,
            service,
            startTime,
            endTime
        });

        await appointment.save();

        // Send confirmation SMS
        const client = await User.findById(clientId);
        const technician = await User.findById(technicianId);

        await sendAppointmentConfirmation(client.phoneNumber, {
            date: new Date(startTime).toLocaleDateString(),
            time: new Date(startTime).toLocaleTimeString(),
            technician: technician.fullName
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating appointment', error: error.message });
    }
});

app.get('/api/appointments/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const appointments = await Appointment.find({
            $or: [{ client: userId }, { technician: userId }]
        })
            .populate('client', 'fullName phoneNumber')
            .populate('technician', 'fullName')
            .sort({ startTime: 1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});