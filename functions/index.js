const functions = require('firebase-functions');
const express = require('express');
const stripe = require('./stripe');

const app = express();

app.post('/checkout', async (req, res) => {
  const { items } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000, // Amount in cents
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

exports.api = functions.https.onRequest(app);