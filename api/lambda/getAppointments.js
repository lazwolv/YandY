const { Client } = require('pg');
const AWS = require('aws-sdk');

const secretsManager = new AWS.SecretsManager();

exports.handler = async (event) => {
    let client;
    try {
        const secretData = await secretsManager.getSecretValue({ SecretId: 'beauty-salon-db-credentials' }).promise();
        const { host, user, password, database } = JSON.parse(secretData.SecretString);
        
        client = new Client({ host, user, password, database });
        await client.connect();
        
        const query = 'SELECT * FROM appointments';
        const result = await client.query(query);
        
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error retrieving appointments', error: error.message })
        };
    } finally {
        if (client) await client.end();
    }
};