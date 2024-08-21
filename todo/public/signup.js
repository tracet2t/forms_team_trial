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
