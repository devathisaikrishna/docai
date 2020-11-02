import $ from 'jquery';

$.validator.addMethod("strongPassword", function (value, element) {
    return this.optional(element) || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/i.test(value);
}, "Passwords are 8-16 characters with uppercase letters, lowercase letters and at least one number."); 

$.validator.addMethod("strongPassword", function(value) {
    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
        && /[a-z]/.test(value) // has a lowercase letter
        && /\d/.test(value) // has a digit
 }, "Passwords are 8-16 characters with letters, spacial character and at least one number.");

 $.validator.addMethod("phonenumber",
    function (value, element) {
        if (value != '') {
            return /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]{8,18}$/.test(value);
        } else {
            return true;
        }
    },
    "Please enter valid phone number"
);

$.validator.addMethod("postcodecheck",
    function (value, element) {
        if (value != '') {
            return /^(0[289][0-9]{2})|([1345689][0-9]{3})|(2[0-8][0-9]{2})|(290[0-9])|(291[0-4])|(7[0-4][0-9]{2})|(7[8-9][0-9]{2})$/.test(value);
        } else {
            return true;
        }
    },
    "Please enter valid 4 digit postcode number"
);

$.validator.addMethod("email", function (value, element) {
    if (value != '') {
        return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
    } else {
        return true;
    }
}, "Please enter valid email address"
);

$.validator.addMethod("notequalto", function(value, element, param) {
    var temp = (param)?$(param).val():'';
    return this.optional(element) || value !== temp;
  }, "Please specify different value from old password.");