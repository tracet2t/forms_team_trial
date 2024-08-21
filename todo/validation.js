

function validateName(name) {
    if (name.length === 0) return { valid: false, message: 'Name is required' };
    if (!name.match(/^[A-Za-z]+(\s[A-Za-z]+)+$/)) return { valid: false, message: 'Invalid Format' };
    return { valid: true, message: 'Valid' };
}

function validatePhone(phone) {
    if (phone.length === 0) return { valid: false, message: 'Phone is required' };
    if (phone.length !== 10) return { valid: false, message: 'Should be 10 digits' };
    if (!phone.match(/^[0-9]{10}$/)) return { valid: false, message: 'Phone number should be digits only' };
    return { valid: true, message: 'Valid' };
}

function validateEmail(email) {
    if (email.length === 0) return { valid: false, message: 'Email is required' };
    if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) return { valid: false, message: 'Invalid email format' };
    return { valid: true, message: 'Valid' };
}

function validatePassword(password) {
    if (password.length === 0) return { valid: false, message: 'Password is required' };
    if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
    if (!password.match(/[A-Z]/)) return { valid: false, message: 'Password must contain at least one uppercase letter' };
    if (!password.match(/[a-z]/)) return { valid: false, message: 'Password must contain at least one lowercase letter' };
    if (!password.match(/[0-9]/)) return { valid: false, message: 'Password must contain at least one number' };
    if (!password.match(/[@$!%*?&#]/)) return { valid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
    return { valid: true, message: 'Valid' };
}

function validateConfirmPassword(password, confirmPassword) {
    if (confirmPassword.length === 0) return { valid: false, message: 'Confirm Password is required' };
    if (password !== confirmPassword) return { valid: false, message: 'Passwords do not match' };
    return { valid: true, message: 'Passwords match' };
}

module.exports = { validateName, validatePhone, validateEmail, validatePassword, validateConfirmPassword };

function validatePassword(password) {
    if (password.length === 0) return { valid: false, message: 'Password is required' };
    if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
    if (!password.match(/[A-Z]/)) return { valid: false, message: 'Password must contain at least one uppercase letter' };
    if (!password.match(/[a-z]/)) return { valid: false, message: 'Password must contain at least one lowercase letter' };
    if (!password.match(/[0-9]/)) return { valid: false, message: 'Password must contain at least one number' };
    if (!password.match(/[@$!%*?&#]/)) return { valid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
    return { valid: true, message: 'Valid' };
}

module.exports = { validatePassword };