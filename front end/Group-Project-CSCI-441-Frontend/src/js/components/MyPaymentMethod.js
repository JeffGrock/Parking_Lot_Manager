"use strict";

/**
 * Validates the user input for payment information.
 *
 * @returns {boolean} - true if valid, otherwise false
 */
function validatePaymentInformation(){
    let isValid = false;

    $("#paymentMethodSection input").each(function(){
        // Upon clicking "Save Payment Method", make all input fields for Payment Information required
        this.required = true;
        isValid = this.reportValidity();
        if (!isValid) return isValid;
    });

    return isValid;
}

/**
 * @desc Determines if all input fields in the payment method section is empty
 *
 * @returns {boolean} - Returns true if all input fields in payment method section is empty, false otherwise
 */
function paymentMethodIsEmpty(){
    let isEmpty = true;
    $("#paymentMethodSection input").each(function(){
        if ($(this).val().trim() !== "") {
            isEmpty = false;
        }
    });
    return isEmpty;
}

/**
 * @desc Set all input fields in the payment method section to be required
 */
function paymentMethodRequired(){
    $("#paymentMethodSection input").each(function(){
        this.required = true;
    });
}

/**
 * @desc Set all input fields in the payment method section to not be required
 */
function paymentMethodNotRequired(){
    $("#paymentMethodSection input").each(function(){
        this.required = false;
    });
}

/**
 * @desc - set the custom validation for My Payment Method section
 */
function initMyPaymentMethod(){
    // Set minimum expiration year YY on payment method
    const currentYear = new Date().getFullYear();
    $("#input_expYY").attr("min", (currentYear % 100).toString());
}

/**
* @desc Populates the payment method section with existing information
*
* @param {Object} paymentMethod - Object containing the payment method information
*/
function showMyPaymentMethod(paymentMethod){
    const { cardName, cardNumber, expMM, expYY, cvv } = paymentMethod || {};
    $("#input_cardName").val(cardName);
    $("#input_cardNumber").val(cardNumber);
    $("#input_expMM").val(expMM);
    $("#input_expYY").val(expYY);
    $("#input_cvv").val(cvv);
}

/**
 * @desc Updates the user's payment method record
 *
 * @param {Object} user - User object containing the user's information
 * @returns {function} - Returns a callback function to be called by the Update button
 */
function updateMyPaymentMethod(user){
    paymentMethodIsEmpty();
    return function(){
        $("#paymentMethodSection input").each(function(){
            user.paymentMethod[$(this).attr("name")] = $(this).val();
        });

        user.modified_date = formatDate(new Date());
        return user;
    };
}
