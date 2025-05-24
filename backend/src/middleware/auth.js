const { auth } = require('../config/firebase');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'غير مصرح' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('خطأ في المصادقة:', error);
    res.status(401).json({ error: 'توكن غير صالح' });
  }
};

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'المستخدم غير موجود' });
      }

      const userData = userDoc.data();
      if (!roles.includes(userData.role)) {
        return res.status(403).json({ error: 'غير مصرح' });
      }

      next();
    } catch (error) {
      console.error('خطأ في التحقق من الدور:', error);
      res.status(500).json({ error: 'خطأ في الخادم' });
    }
  };
};

module.exports = {
  authenticateUser,
  checkRole
}; 