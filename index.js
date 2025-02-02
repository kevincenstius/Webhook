// index.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const VERIFY_TOKEN = "your_verify_token"; // Replace with your verify token

app.use(bodyParser.json());

// Verify Webhook
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403); // Forbidden
        }
    }
});

// Handle Webhook Events
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0];
            console.log("Webhook event received:", webhookEvent);
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webhook is running on port ${PORT}`);
});
