"use strict";

$(document).ready(function(){
    let user = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        vehicles: [],
        paymentMethod: {
            cardName: "",
            cardNumber: "",
            expMM: "",
            expYY: "",
            cvv: "",
        },
        permissions: "1", // Default permissions
        modified_date: "",
        modified_by: "1",
    };

    // Initialize with event listeners and custom validations
    initMyProfile();
    initMyVehicles();
    initMyPaymentMethod();

    // On form submission
    $(".btn_submitForm").click(function(event){
        event.preventDefault();

        // Specific Case: Payment Method Form, must require all input fields if any has any input;
        // otherwise, all input fields are not required if they are all empty
        if ($("#paymentMethodSection").length) {
            if (paymentMethodIsEmpty()) {
                paymentMethodNotRequired();
            } else {
                paymentMethodRequired();
            }
        }

        // Valid form --> create new user
        if ($("form")[0].reportValidity()) {
            updateMyProfile(user)();
            updateMyVehicles(user)();
            updateMyPaymentMethod(user)();

            $.ajax({
                type: "POST",
                url: "/signup",
                crossDomain: true,
                data: JSON.stringify(user),
                dataType: "json",
                contentType: "application/json",
                success: function(userData){
                    alert(`Success! Account ${userData} has been created!`);
                    window.location.href = "/login";
                },
                error: function(result, status, error){
                    if (result.status === 403) {
                        alert("Account already exists. Please try again");
                    }
                },
            });
        }
    });
});
