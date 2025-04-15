const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
        default: 'scheduled'
    },
    notes: {
        type: String
    },
    pointsEarned: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying of appointments by date and technician
appointmentSchema.index({ technician: 1, startTime: 1 });
appointmentSchema.index({ client: 1, startTime: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 