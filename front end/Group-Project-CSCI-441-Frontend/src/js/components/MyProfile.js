"use strict";

/**
 * @desc Checks to see if the password input fields are empty.
 *
 * @returns {boolean} - Returns true if at least one password input field is not empty, false if all are empty
 */
function passwordIsEmpty(){
    let isEmpty = true;
    $("#profileSection input[type='password']").each(function(){
        if ($(this).val().trim() !== "") {
            isEmpty = false;
        }
    });
    return isEmpty;
}

/**
 * @desc Set all password input fields to be required
 */
function passwordRequired(){
    $("#profileSection input[type='password']").each(function(){
        this.required = true;
    });
}

/**
 * @desc Set all password input fields to not be required
 */
function passwordNotRequired(){
    $("#profileSection input[type='password']").each(function(){
        this.required = false;
    });
}

/**
 * @desc - set the custom validation for My Profile section
 */
function initMyProfile(){
    $("#input_confirmPassword").on("input", function(){
        this.setCustomValidity("");
        if (this.value !== $("#input_password").val()) {
            this.setCustomValidity("Does not match!");
            this.reportValidity();
        }
    });
}

/**
 * @desc - Populate the My Profile section with existing information
 *
 * @param {Object} user - user object
 */
function showMyProfile(user){
    const { email, firstName, lastName, phone } = user || {};
    $("#input_email").val(email);
    $("#input_firstName").val(firstName);
    $("#input_lastName").val(lastName);
    $("#input_phone").val(phone);
}

/**
 * @desc - Updates the user object with the input on the My Profile section
 *
 * @param {Object} user
 * @returns {function} - returns callback function
 */
function updateMyProfile(user){
    return function(){
        $("#profileSection input").each(function(){
            if ($(this).attr("name") !== "confirmPassword") {
                user[$(this).attr("name")] = $(this).val();
            }
        });

        user.modified_date = formatDate(new Date());
        return user;
    };
}
