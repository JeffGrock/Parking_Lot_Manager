"use strict";

/**
 * @desc - Checks for input validation based on pattern attribute
 *
 * @returns {boolean} - true if the input box validation satisfies validation constraints, false otherwise
 */
function validateLicensePlate() {
    let isValid = true;
    const input_licensePlate = $("#input_licensePlate")[0];
    input_licensePlate.required = true;

    // Validate license plate input
    isValid = input_licensePlate.reportValidity();

    input_licensePlate.required = false;
    return isValid;
}

/**
 * @desc Creates the list item for the vehicles list, which contains the license plate # and a delete button
 *
 * @param {string[]} vehicles - Array of vehicle license plate numbers
 * @returns {HTMLElement} - Returns all li HTMLElement for each vehicle in the vehicles list
 */
function populateVehiclesList(vehicles) {
    return vehicles.map(function (vehicle) {
        // Create the list item (li)
        const list_vehicles_item = document.createElement("li");
        list_vehicles_item.classList.add("list-group-item", "d-flex", "flex-row", "justify-content-between", "align-items-center", "list_vehicles_item");

        // Create the span text to display license plate number
        const item_span = document.createElement("span");
        item_span.textContent = sanitizeHTML(vehicle);

        // Create the a tag for the delete button
        const btn_deleteVehicle = document.createElement('a');
        btn_deleteVehicle.href = "#";
        btn_deleteVehicle.setAttribute("role", "button");
        btn_deleteVehicle.classList.add("btn", "btn-outline-danger", "btn-sm", "btn_deleteVehicle");
        btn_deleteVehicle.textContent = "Delete";

        // Append span and a tag to li
        list_vehicles_item.append(item_span, btn_deleteVehicle);

        return list_vehicles_item.outerHTML;
    }).join('');
}

/**
 * @desc Returns a list of the license plate numbers
 *
 * @returns {string[]} Array of license plate numbers
 */
function getVehiclesList() {
    const vehicles = new Set();
    $("#list_vehicles li>span").each(function () {
        vehicles.add(sanitizeHTML(this.textContent));
    });

    return [...vehicles];
}

/**
 * @desc Add a new license plate number to the set and re-renders the vehicles list on the DOM
 *
 * @param {string[]} vehicle
 */
function addVehicle(vehicle) {
    const vehicleToAdd = sanitizeHTML(vehicle).toUpperCase();
    const vehicles = new Set(getVehiclesList());

    // Check to see if vehicle to be added is already in the set
    if (vehicles.has(vehicleToAdd)) {
        $(".invalidLicensePlate").show();       // show invalid feedback
        $("#input_licensePlate")[0].focus();        // focus back on input box
    } else {
        vehicles.add(vehicleToAdd);     // add to Set
        $("#input_licensePlate").val('');       // clear input box for license plate
        $(".invalidLicensePlate").hide();       // hide invalid feedback
    }

    // Re-render the vehicles list
    showMyVehicles([...vehicles]);
}

/**
//  * @desc Removes a license plate number from the set and re-renders the vehicles list to the DOM
//  *
//  * @param {string} vehicle Vehicle to be removed from the Set
//  */
// function deleteVehicle(vehicle) {
//     const vehicleToDelete = vehicle.toUpperCase();
//     const vehicles = new Set(getVehiclesList());
//     vehicles.forEach(function (vehicle) {
//         if (vehicle === vehicleToDelete) {
//             vehicles.delete(vehicle);
//         }
//     })

//     showMyVehicles([...vehicles]);
// }

/**
 * @desc Set the custom validation and event listeners for the My Vehicles section
 */
function initMyVehicles() {
    // Custom Validation
    $("#input_licensePlate").on("invalid", function () {
        this.setCustomValidity("Please enter a valid license plate number.");
    })

    $("#input_licensePlate").on("input", function () {
        this.setCustomValidity('');
        $(".invalidLicensePlate").hide();
    })

    // Add Vehicle button
    $(".btn_addVehicle").click(function (event) {
        event.preventDefault();
        let isValid = validateLicensePlate();
        if (isValid) {
            addVehicle($("#input_licensePlate").val());
            $("#input_licensePlate").focus();
        }
    })

    // Delete button for each vehicle item in the vehicles list
    $("body").on("click", "#list_vehicles a", function (event) {
        event.preventDefault();
        $(this).parent().remove();
    })
}

/**
 * @desc Renders the vehicles list to the DOM
 *
 * @param {string[]} vehicles - Array of vehicle license plate numbers
 */
function showMyVehicles(vehicles = []) {
    $("#list_vehicles").html(populateVehiclesList(vehicles));
}

/**
 * @desc Updates the user's vehicles record
 *
 * @param {Object} user - User object containing the user's information
 * @returns {function} - Returns a callback function to be called by the Update button
 */
function updateMyVehicles(user) {
    return function () {
        user.vehicles = [...getVehiclesList()]
        user.modified_date = formatDate(new Date());
        return user;
    }
}