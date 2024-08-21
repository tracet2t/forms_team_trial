const { validateName, validatePhone, validateEmail, validatePassword, validateConfirmPassword } = require('./validation');

describe('Sign-Up Form Validation', () => {
    test('validateName valid name', () => {
        expect(validateName('Uthpala Devaki')).toBe(true);
    });

    test('validateName invalid name', () => {
        expect(validateName('')).toBe(false);
        expect(validateName('Deva123')).toBe(false);
    });

  
});


const { validateName, validatePhone, validateEmail, validatePassword, validateConfirmPassword } = require('../validation');

var nameError = document.getElementById('name-error');
var phoneError = document.getElementById('phone-error');
var emailError = document.getElementById('email-error');
var pwError = document.getElementById('pw-error');
var CPError = document.getElementById('CP-error');
var SubmitError = document.getElementById('Submit-error');

function updateValidationMessages() {
    var nameResult = validateName(document.getElementById('Cname').value.trim());
    nameError.innerHTML = nameResult.message;

    var phoneResult = validatePhone(document.getElementById('Cphone').value);
    phoneError.innerHTML = phoneResult.message;

    var emailResult = validateEmail(document.getElementById('Cemail').value);
    emailError.innerHTML = emailResult.message;

    var passwordResult = validatePassword(document.getElementById('Cpassword').value);
    pwError.innerHTML = passwordResult.message;

    var confirmPasswordResult = validateConfirmPassword(document.getElementById('Cpassword').value, document.getElementById('CconfirmPassword').value);
    CPError.innerHTML = confirmPasswordResult.message;
}

document.getElementById('Cname').addEventListener('keyup', updateValidationMessages);
document.getElementById('Cphone').addEventListener('keyup', updateValidationMessages);
document.getElementById('Cemail').addEventListener('keyup', updateValidationMessages);
document.getElementById('Cpassword').addEventListener('keyup', updateValidationMessages);
document.getElementById('CconfirmPassword').addEventListener('keyup', updateValidationMessages);
