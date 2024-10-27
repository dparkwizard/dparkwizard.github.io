const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const stripe = require('stripe')('sk_test_51QEMwJQuGWNDNoDweLXBpHpsOclwBeI548PhN6aS4tfJgdD2m1SVoZXTeMFGlcsGmCBhOetn79rJGf7cQ1WQEPxt0085YNpvRH');
const cors = require('cors')({ origin: true });

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvqF52YW7rHS1_NRoVqS82gpbLFmthONA",
    authDomain: "talk-89b49.firebaseapp.com",
    projectId: "talk-89b49",
    storageBucket: "talk-89b49.appspot.com",
    messagingSenderId: "370153813454",
    appId: "1:370153813454:web:6b28541f81ebecaf74a79f",
    measurementId: "G-9LEJ028XLR",    
};

exports.getFirebaseConfig = functions.https.onRequest((req, res) => {
    res.json(firebaseConfig);
});

exports.createCheckoutSession = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const { minutes } = req.body;

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${minutes} Minutes`,
                        },
                        unit_amount: minutes * 100, // Assuming $1 per minute
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: 'https://magicpoint.ai/success',
                cancel_url: 'https://magicpoint.ai/cancel',
            });

            res.json({ id: session.id });
        } catch (error) {
            console.error('Error creating checkout session:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});