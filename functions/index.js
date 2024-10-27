const functions = require('firebase-functions');
const express = require('express');
const stripe = require('stripe')('your-secsk_test_51QEMwJQuGWNDNoDweLXBpHpsOclwBeI548PhN6aS4tfJgdD2m1SVoZXTeMFGlcsGmCBhOetn79rJGf7cQ1WQEPxt0085YNpvRH'); // Replace with your Stripe secret key
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items,
        mode: 'payment',
        success_url: 'https://magicpoint.ai/success', // Replace with your success URL
        cancel_url: 'https://magicpoint.ai/cancel',   // Replace with your cancel URL
    });

    res.json({ id: session.id });
});

exports.api = functions.https.onRequest(app);