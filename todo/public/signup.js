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
    
    nameError.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
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
    
    phoneError.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    return true;
}
