const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRCdBMRCKlpbr4KJyLdsHavdKZhNDByNU",
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