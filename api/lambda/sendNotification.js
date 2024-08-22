const AWS = require('aws-sdk');

const sns = new AWS.SNS();

exports.handler = async (event) => {
    const { phoneNumber, message } = JSON.parse(event.body);

    const params = {
        Message: message,
        PhoneNumber: phoneNumber
    };

    try {
        await sns.publish(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Notification sent successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error sending notification', error: error.message })
        };
    }
};
