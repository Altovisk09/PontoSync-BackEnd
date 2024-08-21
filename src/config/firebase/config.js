const admin = require("firebase-admin");
const { getFirestore } = require('firebase-admin/firestore');
const { config } = require("dotenv");

config();
let firebaseApp;

const initializeFirebase = () => {
    try {
        if(!admin.apps.length){
            const serviceAccount = {
                "project_id": process.env.GOOGLE_PROJECT_ID,
                "client_email": process.env.GOOGLE_CLIENT_EMAIL,
                "private_key": process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            };
            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
             
        const db = getFirestore(firebaseApp);
        console.log("Firebase initialized successfully");
        return db;
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        throw error;
    }
};

module.exports = initializeFirebase;
