const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendVerificationCode = async (phoneNumber, code) => {
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