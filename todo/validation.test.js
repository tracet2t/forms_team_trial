

const { validateName, validatePhone, validateEmail, validatePassword, validateConfirmPassword } = require('./validation');

describe('Validation Functions', () => {
    test('validateName valid name', () => {
        expect(validateName('Uthpala Devaki')).toBe(true);
    });

    test('validateName invalid name', () => {
        expect(validateName('')).toBe(false);
        expect(validateName('Deva123')).toBe(false);
    });

   
});
validatePassword

describe('Validation Functions', () => {
    test('validateName valid name', () => {
        expect(validateName('Uthpala Devaki')).toEqual({ valid: true, message: 'Valid' });
    });

    test('validateName invalid name', () => {
        expect(validateName('')).toEqual({ valid: false, message: 'Name is required' });
        expect(validateName('Deva123')).toEqual({ valid: false, message: 'Invalid Format' });
    });

    test('validatePhone valid phone number', () => {
        expect(validatePhone('0775689756')).toEqual({ valid: true, message: 'Valid' });
    });

    test('validatePhone invalid phone number', () => {
        expect(validatePhone('')).toEqual({ valid: false, message: 'Phone is required' });
        expect(validatePhone('07756')).toEqual({ valid: false, message: 'Should be 10 digits' });
        expect(validatePhone('123456789a')).toEqual({ valid: false, message: 'Phone number should be digits only' });
    });

    test('validateEmail valid email', () => {
        expect(validateEmail('test@devaki.com')).toEqual({ valid: true, message: 'Valid' });
    });

    test('validateEmail invalid email', () => {
        expect(validateEmail('')).toEqual({ valid: false, message: 'Email is required' });
        expect(validateEmail('test@.com')).toEqual({ valid: false, message: 'Invalid email format' });
    });

    test('validatePassword valid password', () => {
        expect(validatePassword('Devaki@125')).toEqual({ valid: true, message: 'Valid' });
    });

    test('validatePassword invalid password', () => {
        expect(validatePassword('')).toEqual({ valid: false, message: 'Password is required' });
        expect(validatePassword('weakpass')).toEqual({ valid: false, message: 'Password must be at least 8 characters' });
        expect(validatePassword('NoNumber@')).toEqual({ valid: false, message: 'Password must contain at least one number' });
    });

    test('validateConfirmPassword passwords match', () => {
        expect(validateConfirmPassword('Devaki@125', 'Devaki@125')).toEqual({ valid: true, message: 'Passwords match' });
    });

    test('validateConfirmPassword if passwords do not match', () => {
        expect(validateConfirmPassword('StrongP@ss1', 'DifferentPass1')).toEqual({ valid: false, message: 'Passwords do not match' });
    });

    const { validatePassword } = require('./validation');

describe('Validation Functions', () => {
    test('validatePassword invalid password', () => {
        expect(validatePassword('')).toEqual({ valid: false, message: 'Password is required' });
        expect(validatePassword('weakpass')).toEqual({ valid: false, message: 'Password must be at least 8 characters' });
        expect(validatePassword('NoNumber@')).toEqual({ valid: false, message: 'Password must contain at least one number' });
        expect(validatePassword('NoSpecial123')).toEqual({ valid: false, message: 'Password must contain at least one special character (@$!%*?&)' });
    });

    test('validatePassword valid password', () => {
        expect(validatePassword('Devaki@125')).toEqual({ valid: true, message: 'Valid' });
    });
});

});
