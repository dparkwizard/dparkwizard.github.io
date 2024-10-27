const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const stripe = require('stripe')('sk_test_51QEMwJQuGWNDNoDweLXBpHpsOclwBeI548PhN6aS4tfJgdD2m1SVoZXTeMFGlcsGmCBhOetn79rJGf7cQ1WQEPxt0085YNpvRH');
const cors = require('cors')({ origin: "https://magicpoint.ai" });

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

        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');

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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Handle user authentication status
firebase.auth().onAuthStateChanged(user => {
    const userStatusButton = document.getElementById('user-status');
    if (user) {
        // User is signed in
        userStatusButton.textContent = user.displayName || 'User';
    } else {
        // No user is signed in
        userStatusButton.textContent = 'Not logged in';
    }
});

// Example sign-in function (replace with your actual sign-in logic)
function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
        console.log('User signed in:', result.user);
    }).catch(error => {
        console.error('Error signing in:', error);
    });
}

// Example sign-out function
function signOut() {
    firebase.auth().signOut().then(() => {
        console.log('User signed out');
    }).catch(error => {
        console.error('Error signing out:', error);
    });
}

// Stripe initialization
const stripeClient = Stripe('pk_test_51QEMwJQuGWNDNoDwtiLLlXCTDKvHD3cjfAZ8aZO13kky0hWo5nteaOam9Va0ccXl2trfC0i6wqxtPsUj44bAMEls00md6kF4Fc');

document.querySelectorAll('.purchase-button').forEach(button => {
    button.addEventListener('click', async (event) => {
        const minutes = event.target.getAttribute('data-minutes');
        try {
            const response = await fetch('https://talk-89b49.cloudfunctions.net/createCheckoutSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ minutes })
            });

            if (response.ok) {
                const session = await response.json();
                // Redirect to Stripe Checkout
                const { error } = await stripeClient.redirectToCheckout({ sessionId: session.id });
                if (error) {
                    console.error('Error redirecting to checkout:', error);
                }
            } else {
                console.error('Failed to create checkout session:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});