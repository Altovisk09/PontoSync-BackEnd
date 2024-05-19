const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { config } = require("dotenv");

config();

const firebaseConfig = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: "googleapis.com"
};

const initializeFirebase = () => {
    try {
        const firebaseApp = initializeApp({
            credential: cert(firebaseConfig),
            projectId: process.env.FIREBASE_PROJECT_ID
        });
        const firestore = getFirestore(firebaseApp);
        console.log("Firebase initialized successfully");
        return firestore;
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        throw error;
    }
};

module.exports = initializeFirebase;
