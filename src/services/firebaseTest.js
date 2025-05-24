import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    // اختبار الاتصال بقاعدة البيانات
    const testCollection = collection(db, 'test');
    await addDoc(testCollection, {
      message: 'Test connection',
      timestamp: new Date()
    });

    // قراءة البيانات للتأكد
    const querySnapshot = await getDocs(testCollection);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    console.log('Firebase connection successful:', results);
    return true;
  } catch (error) {
    console.error('Firebase connection error:', error);
    return false;
  }
}; 