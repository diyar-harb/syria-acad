/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {string|null} Error message if validation fails, null if password is valid
 */
const validatePassword = (password) => {
  if (!password) {
    return 'كلمة المرور مطلوبة';
  }

  if (password.length < 8) {
    return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
  }

  if (!/[A-Z]/.test(password)) {
    return 'يجب أن تحتوي كلمة المرور على حرف كبير على الأقل';
  }

  if (!/[a-z]/.test(password)) {
    return 'يجب أن تحتوي كلمة المرور على حرف صغير على الأقل';
  }

  if (!/[0-9]/.test(password)) {
    return 'يجب أن تحتوي كلمة المرور على رقم على الأقل';
  }

  return null;
};

module.exports = {
  validatePassword
}; 