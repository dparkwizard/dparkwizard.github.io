const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const stripe = require('stripe')('spk_test_51QEMwJQuGWNDNoDwtiLLlXCTDKvHD3cjfAZ8aZO13kky0hWo5nteaOam9Va0ccXl2trfC0i6wqxtPsUj44bAMEls00md6kF4Fc');

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

exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        console.error('req.method:', req.method);
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