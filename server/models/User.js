const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true
    },
    verificationCode: {
        type: String,
        expires: '5m' // Verification code expires after 5 minutes
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    points: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ['client', 'employee', 'admin'],
        default: 'client'
    },
    favoriteTechnicians: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Method to generate verification code
userSchema.methods.generateVerificationCode = function () {
    this.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    return this.verificationCode;
};

// Method to verify code
userSchema.methods.verifyCode = function (code) {
    return this.verificationCode === code;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 