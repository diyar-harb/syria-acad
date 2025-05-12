import React from 'react';

const About = () => (
  <div className="about-page" style={{maxWidth: 700, margin: '2rem auto', padding: 24, background: '#222', color: '#fff', borderRadius: 12}}>
    <h1>عن المنصة</h1>
    <p>
      <b>Syria Acadime</b> منصة تعليمية ذكية تهدف إلى تمكين الطلاب والمعلمين وأولياء الأمور من تحقيق أفضل النتائج الأكاديمية من خلال أدوات تفاعلية متقدمة.
    </p>
    <ul>
      <li>بنك أسئلة متنوع ومصنف حسب المواد والمستوى.</li>
      <li>دروس تفاعلية وملخصات قابلة للتنزيل.</li>
      <li>تقارير أداء مفصلة للطلاب وأولياء الأمور.</li>
      <li>نظام تواصل آمن بين الطلاب والمعلمين.</li>
      <li>لوحات تحكم مخصصة لكل فئة مستخدم.</li>
    </ul>
    <p style={{marginTop: 32, textAlign: 'center', fontWeight: 'bold', color: '#ffd700'}}>صممت بواسطة WALEED S و DYAR H</p>
  </div>
);

export default About; 