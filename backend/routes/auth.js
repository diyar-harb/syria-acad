const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../db');
const { sendEmail } = require('../utils/email');
const { validatePassword } = require('../utils/validation');

// Request password reset
router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'البريد الإلكتروني غير مسجل' });
    }

    const user = userResult.rows[0];

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save reset token
    await pool.query(
      'INSERT INTO reset_tokens (user_id, token, otp, expires_at) VALUES ($1, $2, $3, $4)',
      [user.id, token, otp, expiresAt]
    );

    // Send email with OTP
    await sendEmail({
      to: user.email,
      subject: 'استعادة كلمة المرور',
      text: `رمز التحقق الخاص بك هو: ${otp}\n\nهذا الرمز صالح لمدة 15 دقيقة فقط.`,
      html: `
        <h1>استعادة كلمة المرور</h1>
        <p>رمز التحقق الخاص بك هو: <strong>${otp}</strong></p>
        <p>هذا الرمز صالح لمدة 15 دقيقة فقط.</p>
      `
    });

    res.json({ message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء معالجة الطلب' });
  }
});

// Verify reset OTP
router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Get user and their latest reset token
    const result = await pool.query(
      `SELECT u.id, rt.token, rt.otp, rt.expires_at, rt.used
       FROM users u
       JOIN reset_tokens rt ON u.id = rt.user_id
       WHERE u.email = $1 AND rt.used = false
       ORDER BY rt.created_at DESC
       LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'رمز التحقق غير صالح أو منتهي الصلاحية' });
    }

    const { token, otp: storedOtp, expires_at } = result.rows[0];

    // Check if OTP is expired
    if (new Date() > new Date(expires_at)) {
      return res.status(400).json({ error: 'رمز التحقق منتهي الصلاحية' });
    }

    // Verify OTP
    if (otp !== storedOtp) {
      return res.status(400).json({ error: 'رمز التحقق غير صحيح' });
    }

    res.json({ token });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء التحقق من الرمز' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Validate password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    // Get user and their reset token
    const result = await pool.query(
      `SELECT u.id, rt.token, rt.otp, rt.expires_at, rt.used
       FROM users u
       JOIN reset_tokens rt ON u.id = rt.user_id
       WHERE u.email = $1 AND rt.used = false
       ORDER BY rt.created_at DESC
       LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'رمز التحقق غير صالح أو منتهي الصلاحية' });
    }

    const { id: userId, otp: storedOtp, expires_at } = result.rows[0];

    // Check if OTP is expired
    if (new Date() > new Date(expires_at)) {
      return res.status(400).json({ error: 'رمز التحقق منتهي الصلاحية' });
    }

    // Verify OTP
    if (otp !== storedOtp) {
      return res.status(400).json({ error: 'رمز التحقق غير صحيح' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and mark token as used
    await pool.query('BEGIN');

    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );

    await pool.query(
      'UPDATE reset_tokens SET used = true WHERE user_id = $1 AND used = false',
      [userId]
    );

    await pool.query('COMMIT');

    res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تغيير كلمة المرور' });
  }
});

module.exports = router; 