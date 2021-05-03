"use strict";

$(document).ready(async function () {
  let user = {}; // example user

  /**
   * Administrative navigation button is hidden by default
   */
  $("#navAdmin").hide();
  $("#modifyPermissions").hide();

  /**
   * Search for GET variables in the URL
   */
  var administrativeUser  = {};
  var userId = 0;
  const webAddress = window.location.search;
  const getVariables = new URLSearchParams(webAddress);

  /**
   * @desc Removes the "active" from class list
   */
  function clearActive() {
    $(".active").removeClass("active");
  }

  /**
   * @desc Add the class "active" to the selected sidebar option
   *
   * @param {HTMLElement} el - the HTMLElement that will have "active" added to the class list
   */
  function setActive(el) {
    el.classList.add("active");
  }

  /**
   * @desc Returns a synchronous function that is used to get the currently logged in user information
   * @return {Promise}
   */
  const getAuthenticatedUser = function () {
    return new Promise(function (resolve, reject) {
      $.ajax({
        method: "GET",
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        url: "/users/loggedIn",
        async: false,
        success: function (data) {
          resolve(data);
        },
        error: function (result, status, error) {
          reject(result + " " + status + " " + error);
        },
      });
    });
  };

  const getAdministrativeUserSelection = function(userId) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        method: "GET",
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        url: "/users/" + userId,
        async: false,
        success: function (data) {
          resolve(data);
        },
        error: function (result, status, error) {
          reject(result + " " + status + " " + error);
        },
      });
    });
  }

  /**
   * @desc Sends a PUT request to /dashboard, which updates the user in the db
   * @param {Object} user - User data
   */
  function updateUser(user) {
    //Bypass email check on the backend if this is an administrative update request
    if ( !$.isEmptyObject(administrativeUser) )  user.adminUpdate = 1;
    // Send Ajax PUT request to server
    $.ajax({
      type: "PUT",
      url: "/dashboard",
      crossDomain: true,
      data: JSON.stringify(user),
      dataType: "json",
      contentType: "application/json",
      success: function (updatedUser) {
        user = updatedUser;

        // Display user account on sidebar
        $(".emailAddress").text(user.email); // Show the user's email under My Account

        // Display feedback to user that records have been updated
        $(".update_feedback").show();
        setTimeout(function () {
          $(".update_feedback").hide();
        }, 5000);
      },
      error: function (result, status, error) {
        if (result.status === 403) {
          alert("Email already in use. Please try a different email");
        } else {
          alert(result + " " + status + " " + error);
        }
      },
    });
  }

  /**
   * @desc Adds a "Update" button to the form and a hidden div for feedback; also includes the update button event listener
   *
   * @param {function} updateUserSettings - callback function that is triggered when update button is clicked
   */
  function addUpdateButton(updateUserSettings) {
    $("form").append(
      `<button type="button" class="btn btn-outline-primary btn-sm btn_update">Update</button>`
    );
    $("form").append(
      `<div class="valid-feedback update_feedback"><p class="mb-0">Updated!</p></div>`
    );

    // Update button event
    $(".btn_update").click(function (event) {
      event.preventDefault();

      const form = $(this).parents("form")[0];

      // Specific Case: Profile Section
      //      if there's input in any of the password input field, make all password input fields required
      //      otherwise, if all password input fields are empty, it should not be required
      if ($("#profileSection").length) {
        if (passwordIsEmpty()) {
          passwordNotRequired();
        } else {
          passwordRequired();
        }
      }

      // Specific Case: Payment Method Form, must require all input fields if any has any input;
      // otherwise, all input fields are not required if they are all empty
      if ($("#paymentMethodSection").length) {
        if (paymentMethodIsEmpty()) {
          paymentMethodNotRequired();
        } else {
          paymentMethodRequired();
        }
      }

      // Valid form --> update
      if (form.reportValidity()) {
        const updatedUser = updateUserSettings();
        updateUser(updatedUser);
      }
    });
  }

  /**
   * @desc Load to the DOM the specific setting that user selected from the sidebar, and initialize event listeners/handlers
   *
   * @param {Object} user - User object containing the user's profile, vehicles, and payment method
   */
  function displaySetting(user) {
    $(".emailAddress").text(user.email); // Show the user's email under My Account
    const setting = $(".active").attr("data-sidebar");

    $(".form_title").text(setting);
    switch (setting) {
      case "My Profile":
        $("#form_update").load("./modals/MyProfile.html", function () {
          initMyProfile();
          showMyProfile(user);
          addUpdateButton(updateMyProfile(user));
        });
        break;
      case "My Vehicles":
        $("#form_update").load("./modals/MyVehicles.html", function () {
          initMyVehicles();
          showMyVehicles(user.vehicles);
          addUpdateButton(updateMyVehicles(user));
        });
        break;
      case "My Payment Method":
        $("#form_update").load("./modals/MyPaymentMethod.html", function () {
          initMyPaymentMethod();
          showMyPaymentMethod(user.paymentMethod);
          addUpdateButton(updateMyPaymentMethod(user));
        });
        break;
      case "My Reservations":
        $("#form_update").load("./modals/MyReservations.html", function () {
          getReservation(user.email);
        });
        break;
      default:
        console.error(`Error: ${setting} is not an available setting.`);
    }
  }

  function administrativeSetup(admin) {
    $("#navAdmin").show();
    /**
     * 1. Admins should not modify their own account
     * 2. Only super user are able to modify other administrators, but not other super users
     * 3. Super users cannot modify other super users
     *
     */
    if ( admin._id !== user._id &&
        user.permissions !== 3 &&
        !(user.permissions === 2 && admin.permissions < 3) ) {
      //Display admin content
      $("#adminName").text(admin.firstName + " " + admin.lastName);
      $("#modifyPermissions").show();
      $("#modalIncludes").load("modals/admin/modal_modify_user_permissions.html");

      //Set event listener for modify permissions button
      $("#modifyPermissions").on("click", function () {
        if (admin.permissions < 3) {
          //Administrators cannot grant admin access
          $("#modifyPermissionsAdmin").hide();
        }
        $("#user_permissionLevel").val(user.permissions);
        $("#modify_user_permissions_modal").modal();
      });

      //Set dynamic event listener for modal submit
      $("body").on("click", "button.modifyPermissions", function () {
        let previousValue = user.permissions;
        user.permissions = $("#user_permissionLevel").val();
        if (user.permissions != previousValue ) $(".btn_update").click();
      });
    }
  }

  getAuthenticatedUser()
    .then(function (foundUser) {
      userId = getVariables.get('uval');
      if ( userId ) {
        //Do avoid potential asynchronous inconsistencies, call here.
        administrativeUser = foundUser;
        getAdministrativeUserSelection(userId)
            .then(function (foundUser) {
              user = foundUser;
              displaySetting(user);
              administrativeSetup(administrativeUser);
            })
            .catch(function (err) {
              window.location.href = "./admin.html";
            });
      }
      else {
        user = foundUser;
        if ( user.permissions > 1 ) $("#navAdmin").show();
        displaySetting(user);
      }
    })
    .catch(function (err) {
      window.location.href = "./login.html";
    });


  $(".list-group-item").click(function (event) {
    event.preventDefault();
    clearActive();
    setActive(this);
    displaySetting(user);
  });
});
