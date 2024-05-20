const admin = require("firebase-admin");
const { getFirestore } = require('firebase-admin/firestore');
const { config } = require("dotenv");

config();

const initializeFirebase = () => {
    try {
        const serviceAccount = require("./pontoSync.json");
        const firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        const db = getFirestore(firebaseApp);
        console.log("Firebase initialized successfully");
        return db;
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        throw error;
    }
};

module.exports = initializeFirebase;
