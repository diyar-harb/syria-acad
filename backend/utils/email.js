const nodemailer = require('nodemailer')

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
const sendEmail = async options => {
  console.log('*** Email sending is DISABLED in development mode ***')
  console.log('To:', options.to)
  console.log('Subject:', options.subject)
  console.log('Text:', options.text)
  // لا يتم إرسال الإيميل فعليًا
  return true
}

module.exports = {
  sendEmail
}
