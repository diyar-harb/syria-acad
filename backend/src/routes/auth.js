const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');
const axios = require('axios');

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    // التحقق من وجود البيانات المطلوبة
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'يجب توفير البريد الإلكتروني وكلمة المرور' 
      });
    }

    // التحقق من الدور (role)
    if (!role || !['teacher', 'student'].includes(role)) {
      return res.status(400).json({ 
        error: 'الدور غير صالح. يجب أن يكون إما معلم أو طالب' 
      });
    }

    // إنشاء المستخدم في Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true // تعيين البريد كمفعل مباشرة
    });

    // إنشاء ملف المستخدم في Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      role,
      profile: profile || {},
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true
    });

    // إذا كان الدور معلم، احفظه أيضاً في مجموعة teachers مع خاصية role
    if (role === 'teacher') {
      await db.collection('teachers').doc(userRecord.uid).set({
        email,
        role: 'teacher',
        profile: profile || {},
        createdAt: new Date(),
        isActive: true
      });
    }

    // إنشاء توكن مخصص للمستخدم الجديد
    const token = await auth.createCustomToken(userRecord.uid);

    // إرجاع رد ناجح مع التوكن
    res.status(201).json({ 
      message: 'تم إنشاء الحساب بنجاح',
      uid: userRecord.uid,
      token,
      role
    });

  } catch (error) {
    console.error('خطأ في التسجيل:', error);
    
    // معالجة أخطاء Firebase المختلفة
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ 
        error: 'البريد الإلكتروني مستخدم بالفعل' 
      });
    }
    
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ 
        error: 'البريد الإلكتروني غير صالح' 
      });
    }
    
    if (error.code === 'auth/weak-password') {
      return res.status(400).json({ 
        error: 'كلمة المرور ضعيفة جداً' 
      });
    }

    // أي خطأ آخر
    res.status(500).json({ 
      error: 'حدث خطأ أثناء إنشاء الحساب' 
    });
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // تحقق من كلمة المرور عبر Firebase Auth REST API
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    );

    const { localId: uid } = response.data;

    // يمكنك هنا تحديث بيانات المستخدم في Firestore إذا أردت
    // await db.collection('users').doc(uid).update({ lastLogin: new Date() });

    // إنشاء توكن مخصص
    const token = await auth.createCustomToken(uid);

    res.json({ token, uid });
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error.response?.data || error.message);
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
    // ابحث أولاً في مجموعة users
    let userDoc = await db.collection('users').doc(req.user.uid).get();
    if (userDoc.exists) {
      return res.json(userDoc.data());
    }

    // إذا لم يوجد في users، ابحث في teachers
    userDoc = await db.collection('teachers').doc(req.user.uid).get();
    if (userDoc.exists) {
      return res.json(userDoc.data());
    }

    // إذا لم يوجد في أي مجموعة
    return res.status(404).json({ error: 'المستخدم غير موجود' });
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

module.exports = router; 