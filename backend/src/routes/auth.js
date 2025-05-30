const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    // إنشاء المستخدم في Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // إنشاء ملف المستخدم في Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      role,
      profile,
      createdAt: new Date(),
      lastLogin: new Date()
    });

    res.status(201).json({ message: 'تم إنشاء المستخدم بنجاح', uid: userRecord.uid });
  } catch (error) {
    console.error('خطأ في التسجيل:', error);
    res.status(400).json({ error: error.message });
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await auth.getUserByEmail(email);
    
    // تحديث آخر تسجيل دخول
    await db.collection('users').doc(userRecord.uid).update({
      lastLogin: new Date()
    });

    // إنشاء توكن مخصص
    const token = await auth.createCustomToken(userRecord.uid);
    
    res.json({ token, uid: userRecord.uid });
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
  }
});

// تجديد التوكن
router.post('/refresh-token', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'توكن غير موجود أو غير صالح' });
    }

    const idToken = authHeader.split(' ')[1];

    let decodedToken;
    try {
         // Verify the ID token with checkRevoked = true
         // This allows getting the UID even if the token is expired, unless explicitly revoked
         decodedToken = await auth.verifyIdToken(idToken, true); // true for checkRevoked
    } catch (error) {
        console.error('خطأ في التحقق من التوكن المنتهي الصلاحية لغرض التجديد:', error);
        // If verification fails (expired or revoked), return 401
        return res.status(401).json({ error: 'فشل التحقق من التوكن لغرض التجديد. يرجى إعادة تسجيل الدخول.' });
    }

    const uid = decodedToken.uid;
    const userRecord = await auth.getUser(uid); // Ensure user still exists and is active

    // Create a new custom token for this user
    const newToken = await auth.createCustomToken(userRecord.uid);

    res.json({ token: newToken, uid: userRecord.uid });
  } catch (error) {
    console.error('خطأ عام في مسار تجديد التوكن:', error);
    res.status(500).json({ error: 'خطأ في الخادم أثناء تجديد التوكن' });
  }
});

// الحصول على معلومات المستخدم
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

module.exports = router; 