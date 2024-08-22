const { Client } = require('pg');
const AWS = require('aws-sdk');

exports.handler = async (event) => {
    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const sns = new AWS.SNS();

    try {
        await client.connect();
        const { clientName, clientEmail, stylistId, serviceId, appointmentTime } = JSON.parse(event.body);
        
        const query = 'INSERT INTO appointments (client_name, client_email, stylist_id, service_id, appointment_time, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [clientName, clientEmail, stylistId, serviceId, appointmentTime, 'scheduled'];
        
        const result = await client.query(query, values);
        
        // Send confirmation SMS
        await sns.publish({
            Message: `Your appointment has been scheduled for ${appointmentTime}`,
            PhoneNumber: clientEmail, // Assuming clientEmail is actually a phone number
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify(result.rows[0])
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error creating appointment', error: error.message })
        };
    } finally {
        await client.end();
    }
};
