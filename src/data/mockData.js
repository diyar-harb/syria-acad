export const subjects = [
  {
    id: 1,
    name: 'الرياضيات',
    grade: 'الحادي عشر',
    description: 'دراسة المفاهيم الرياضية المتقدمة والتحليل والهندسة',
    topics: ['التفاضل والتكامل', 'الهندسة التحليلية', 'المتجهات', 'المصفوفات'],
    image: '/img/math.jpg'
  },
  {
    id: 2,
    name: 'الفيزياء',
    grade: 'الحادي عشر',
    description: 'دراسة القوانين الفيزيائية والظواهر الطبيعية',
    topics: ['الميكانيكا', 'الكهرباء والمغناطيسية', 'الحرارة', 'الضوء'],
    image: '/img/physics.jpg'
  }
];

export const articles = [
  {
    id: 1,
    title: 'كيف تتفوق في الرياضيات؟',
    subject: 'الرياضيات',
    author: 'د. أحمد محمد',
    date: '2024-03-15',
    content: 'نصائح وإرشادات للتفوق في مادة الرياضيات للصف الحادي عشر...',
    image: '/img/math-success.jpg'
  },
  {
    id: 2,
    title: 'تطبيقات الفيزياء في حياتنا اليومية',
    subject: 'الفيزياء',
    author: 'د. سارة أحمد',
    date: '2024-03-14',
    content: 'اكتشف كيف تؤثر قوانين الفيزياء على حياتنا اليومية...',
    image: '/img/physics-daily.jpg'
  }
];

export const questions = [
  {
    id: 1,
    subject: 'الرياضيات',
    topic: 'التفاضل',
    question: 'جد مشتقة الدالة f(x) = x³ + 2x² - 4x + 1',
    options: [
      '3x² + 4x - 4',
      '3x² + 2x - 4',
      '2x² + 4x - 4',
      'x³ + 2x - 4'
    ],
    correctAnswer: 0,
    explanation: 'نستخدم قواعد الاشتقاق: مشتقة x³ هي 3x²، ومشتقة 2x² هي 4x، ومشتقة -4x هي -4'
  },
  {
    id: 2,
    subject: 'الفيزياء',
    topic: 'الميكانيكا',
    question: 'ما هي وحدة قياس القوة في النظام الدولي؟',
    options: [
      'نيوتن',
      'جول',
      'باسكال',
      'واط'
    ],
    correctAnswer: 0,
    explanation: 'النيوتن هو وحدة قياس القوة في النظام الدولي للوحدات (SI)'
  }
];

export const exams = [
  {
    id: 1,
    subject: 'الرياضيات',
    title: 'اختبار نصف الفصل - التفاضل والتكامل',
    duration: 60,
    totalMarks: 50,
    questions: [1, 3, 5, 7, 9], // أرقام الأسئلة
    date: '2024-03-20'
  },
  {
    id: 2,
    subject: 'الفيزياء',
    title: 'اختبار الميكانيكا النهائي',
    duration: 90,
    totalMarks: 60,
    questions: [2, 4, 6, 8, 10],
    date: '2024-03-25'
  }
];

export const courses = [
  {
    id: 1,
    subject: 'الرياضيات',
    title: 'التفاضل والتكامل للمبتدئين',
    instructor: 'د. أحمد محمد',
    duration: '8 أسابيع',
    lessons: [
      {
        title: 'مقدمة في التفاضل',
        duration: '45 دقيقة',
        videoUrl: '/videos/calc-intro.mp4'
      },
      {
        title: 'قواعد الاشتقاق',
        duration: '60 دقيقة',
        videoUrl: '/videos/calc-rules.mp4'
      }
    ],
    price: 'مجاناً',
    image: '/img/calc-course.jpg'
  },
  {
    id: 2,
    subject: 'الفيزياء',
    title: 'أساسيات الميكانيكا',
    instructor: 'د. سارة أحمد',
    duration: '6 أسابيع',
    lessons: [
      {
        title: 'القوة والحركة',
        duration: '50 دقيقة',
        videoUrl: '/videos/mechanics-intro.mp4'
      },
      {
        title: 'قوانين نيوتن',
        duration: '55 دقيقة',
        videoUrl: '/videos/newton-laws.mp4'
      }
    ],
    price: 'مجاناً',
    image: '/img/mechanics-course.jpg'
  }
]; 