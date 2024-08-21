var nameError = document.getElementById('name-error');
var phoneError = document.getElementById('phone-error');
var emailError = document.getElementById('email-error');
var pwError = document.getElementById('pw-error');
var CPError = document.getElementById('CP-error');
var SubmitError = document.getElementById('Submit-error');

function validateName() {
    var name = document.getElementById('Cname').value.trim(); 
    
    if (name.length == 0) {
        nameError.innerHTML = 'Name is required';
        return false;
    }
    
    if (!name.match(/^[A-Za-z]+(\s[A-Za-z]+)+$/)) {
        nameError.innerHTML = 'Invalid Format';
        return false;
    }
    
    nameError.innerHTML = 'Valid';
    return true;
}

function validatePhone() {
    var phone = document.getElementById('Cphone').value;

    if(phone.length == 0){
        phoneError.innerHTML = 'Phone is required';
        return false;
    }
    if(phone.length !== 10){
        phoneError.innerHTML = 'Should be 10 digits';
        return false;
    }
    if(!phone.match(/^[0-9]{10}$/)){
        phoneError.innerHTML = 'Phone number should be digits only';
        return false;
    }
    
    phoneError.innerHTML = ' Valid';
    return true;
}

function validateEmail(){
    var email = document.getElementById('Cemail').value;
    var emailError = document.getElementById('email-error');
    
    if(email.length == 0 ){
        emailError.innerHTML = 'Email is required';
        return false;
    }
    if(!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)){
        emailError.innerHTML = 'Invalid email format';
        return false;
    }
    emailError.innerHTML = 'Valid';
    return true;
}

function validatePassword() {
    var password = document.getElementById('Cpassword').value;
    var pwError = document.getElementById('pw-error');
    
    if(password.length == 0) {
        pwError.innerHTML = 'Password is required';
        return false;
    }
    if(password.length < 8) {
        pwError.innerHTML = 'Password must be at least 8 characters';
        return false;
    }
    if(!password.match(/[A-Z]/)) {
        pwError.innerHTML = 'Password must contain at least one uppercase letter';
        return false;
    }
    if(!password.match(/[a-z]/)) {
        pwError.innerHTML = 'Password must contain at least one lowercase letter';
        return false;
    }
    if(!password.match(/[0-9]/)) {
        pwError.innerHTML = 'Password must contain at least one number';
        return false;
    }
    if(!password.match(/[@$!%*?&#]/)) {
        pwError.innerHTML = 'Password must contain at least one special character (@$!%*?&)';
        return false;
    }
    
    pwError.innerHTML = ' Valid';
    return true;
}

function validateConfirmPassword() {
    var password = document.getElementById('Cpassword').value;
    var confirmPassword = document.getElementById('CconfirmPassword').value;
    var CPError = document.getElementById('CP-error');
    
    if(confirmPassword.length == 0) {
        CPError.innerHTML = 'Confirm Password is required';
        return false;
    }
    if(password !== confirmPassword) {
        CPError.innerHTML = 'Passwords do not match';
        return false;
    }
    
    CPError.innerHTML = ' Passwords match';
    return true;
}

function validateForm(){
    if(!validateName() || !validatePhone() || !validateEmail() || !validatePassword() || !validateConfirmPassword()){
        SubmitError.innerHTML = 'Please fix errors to submit';
        setTimeout(function(){SubmitError.style.display = 'none';},3000);
        return false;
    }
}
