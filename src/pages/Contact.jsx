import React from 'react';

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert('تم نسخ الرقم: ' + text);
};

const Contact = () => (
  <div className="contact-page" style={{maxWidth: 700, margin: '2rem auto', padding: 24, background: '#222', color: '#fff', borderRadius: 12}}>
    <h1>اتصل بنا</h1>
    <p>لأي استفسار أو دعم يمكنك التواصل معنا عبر:</p>
    <ul style={{fontSize: '1.1rem'}}>
      <li>
        البريد الإلكتروني: 
        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=dearharb2006@gmail.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{color:'#ffd700', cursor:'pointer'}}
        >
          dearharb2006@gmail.com
        </a>
      </li>
      <li>
        رقم الاتصال: 
        <span 
          style={{color:'#ffd700', cursor:'pointer'}} 
          onClick={() => copyToClipboard('00963948530531')}
        >
          00963948530531
        </span>
      </li>
      <li>
        رقم إضافي: 
        <span 
          style={{color:'#ffd700', cursor:'pointer'}} 
          onClick={() => copyToClipboard('00963998016333')}
        >
          00963998016333
        </span>
      </li>
      <li>رابط البورتفوليو: <a href="https://astonishing-halva-cf271b.netlify.app/" target="_blank" rel="noopener noreferrer" style={{color:'#ffd700'}}>https://astonishing-halva-cf271b.netlify.app/</a></li>
      <li>العنوان: دمشق - سوريا (عنوان افتراضي)</li>
    </ul>
    <p style={{marginTop: 32, textAlign: 'center', color: '#aaa'}}>نحن هنا لخدمتكم على مدار الساعة.</p>
  </div>
);

export default Contact; 