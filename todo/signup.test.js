const { validateName, validatePhone, validateEmail, validatePassword, validateConfirmPassword } = require('./validation'); 


describe('Sign-Up Form Validation', () => {

    test('validateName  valid name', () => {
        expect(validateName('Uthpala Devaki')).toBe(true);
    });

    test('validateName  invalid name', () => {
        expect(validateName('')).toBe(false);
        expect(validateName('Deva123')).toBe(false);
    });

    test('validatePhone  valid phone number', () => {
        expect(validatePhone('0775689756')).toBe(true);
    });

    test('validatePhone invalid phone number', () => {
        expect(validatePhone('')).toBe(false);
        expect(validatePhone('07756')).toBe(false);
        expect(validatePhone('123456789a')).toBe(false);
    });

    test('validateEmail true for a valid email', () => {
        expect(validateEmail('test@devaki.com')).toBe(true);
    });

    test('validateEmail invalid email', () => {
        expect(validateEmail('')).toBe(false);
        expect(validateEmail('test@.com')).toBe(false);
    });

    test('validatePassword  valid password', () => {
        expect(validatePassword('Devaki@125')).toBe(true);
    });

    test('validatePassword invalid password', () => {
        expect(validatePassword('')).toBe(false);
        expect(validatePassword('weakpass')).toBe(false);
        expect(validatePassword('NoNumber@')).toBe(false);
    });

    test('validateConfirmPassword  passwords match', () => {
        expect(validateConfirmPassword('Devaki@125', 'Devaki@125')).toBe(true);
    });

    test('validateConfirmPassword  if passwords do not match', () => {
        expect(validateConfirmPassword('StrongP@ss1', 'DifferentPass1')).toBe(false);
    });

});
