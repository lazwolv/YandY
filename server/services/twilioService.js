const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Only initialize Twilio client if credentials are provided and valid
const hasValidCredentials = accountSid &&
                             authToken &&
                             accountSid.startsWith('AC') &&
                             !accountSid.includes('your_twilio');

const client = hasValidCredentials ? twilio(accountSid, authToken) : null;

const sendVerificationCode = async (phoneNumber, code) => {
    if (!client) {
        console.log('Twilio not configured. Verification code:', code);
        return true; // Return true for development without Twilio
    }

    try {
        await client.messages.create({
            body: `Your Y&Y Beauty verification code is: ${code}. This code will expire in 5 minutes.`,
            from: twilioPhoneNumber,
            to: phoneNumber
        });
        return true;
    } catch (error) {
        console.error('Error sending verification code:', error);
        return false;
    }
};

const sendAppointmentConfirmation = async (phoneNumber, appointmentDetails) => {
    if (!client) {
        console.log('Twilio not configured. Skipping appointment confirmation SMS.');
        return true;
    }

    try {
        await client.messages.create({
            body: `Your appointment at Y&Y Beauty is confirmed for ${appointmentDetails.date} at ${appointmentDetails.time} with ${appointmentDetails.technician}.`,
            from: twilioPhoneNumber,
            to: phoneNumber
        });
        return true;
    } catch (error) {
        console.error('Error sending appointment confirmation:', error);
        return false;
    }
};

const sendAppointmentReminder = async (phoneNumber, appointmentDetails) => {
    if (!client) {
        console.log('Twilio not configured. Skipping appointment reminder SMS.');
        return true;
    }

    try {
        await client.messages.create({
            body: `Reminder: You have an appointment at Y&Y Beauty tomorrow at ${appointmentDetails.time} with ${appointmentDetails.technician}.`,
            from: twilioPhoneNumber,
            to: phoneNumber
        });
        return true;
    } catch (error) {
        console.error('Error sending appointment reminder:', error);
        return false;
    }
};

const sendPromotionalMessage = async (phoneNumber, message) => {
    if (!client) {
        console.log('Twilio not configured. Skipping promotional SMS.');
        return true;
    }

    try {
        await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: phoneNumber
        });
        return true;
    } catch (error) {
        console.error('Error sending promotional message:', error);
        return false;
    }
};

module.exports = {
    sendVerificationCode,
    sendAppointmentConfirmation,
    sendAppointmentReminder,
    sendPromotionalMessage
};
