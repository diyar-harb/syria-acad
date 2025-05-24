require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// تهيئة Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

// تصدير الكائنات المطلوبة
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = {
  admin,
  db,
  auth,
  storage
}; 