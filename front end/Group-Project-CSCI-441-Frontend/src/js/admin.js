$(document).ready(function() {

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

   getAuthenticatedUser()
       .then(function (foundUser) {
          //Nothing needs to happen here. Redirect occurs if not authenticated.
       })
       .catch(function (err) {
          window.location.href = "./dashboard.html";
       });

   populate_users();
   get_payment_rate();

   /*
    * Load required modal
    */
   $("#selectUserModal").load("modals/admin/modal_select_user.html");
   $("#selectSpaceModal").load("modals/admin/modal_select_space.html");
   $("#adjustPaymentRateModal").load("modals/admin/modal_adjust_payment_rate.html");

   /*
    * Set jQuery listeners for modal triggers
    */

   $("#selectUserProfileIcon").on("click", function() {
      $("#select_user_modal").modal();
   });

   $("#selectParkingSpaceIcon").on("click", function() {
      $("#select_space_modal").modal();
   });

   $("#adjustPaymentRateIcon").on("click", function() {
      $("#adjust_payment_rate").modal();
   });

   /*
    * Add event listener for dynamically generated elements
    */

   $("body").on("click", "button.userButton", function() {
      window.location ="./dashboard.html?uval=" + $('#selectUserModalDropdown').val();
   });

   $("body").on("click", "button.adjustButton", function() {
      adjust_payment_rate();
   });


   function verify_user(id) {
      var ajax_call = $.ajax({
         method: 'GET',
         crossDomain: true,
         dataType: 'json',
         contentType: 'application/json',
         url: '/users/' + id,
         async: true,
         success: function(data) {
            alert(111);
         },
         error: function(result, status, error) {
            alert(result + " " + status + " " + error);
         }
      });
   }

   function populate_users() {
      var ajax_call = $.ajax({
         method: 'GET',
         crossDomain: true,
         dataType: 'json',
         contentType: 'application/json',
         url: '/users',
         async: true,
         success: function(data) {
            $.each(data, function(key, value) {
               $("#selectUserModalDropdown").append("<option value='" + value._id + "'>" + value.firstName + " " + value.lastName + "</option>")
            });
         },
         error: function(result, status, error) {
            alert(result + " " + status + " " + error);
         }
      });
   }

   function get_payment_rate() {
      var ajax_call = $.ajax({
         method: 'GET',
         crossDomain: true,
         dataType: 'json',
         contentType: 'application/json',
         url: '/payrate',
         async: true,
         success: function(data) {
            $("#paymentRate").val(data.payment_rate_per_hour);
            $("#paymentRate").data("id", data._id);
         },
         error: function(result, status, error) {
            alert("Unable to retrieve payment rate. Please try again.");
         }
      });
   }

   function adjust_payment_rate() {
      let amount = $("#paymentRate").val();
      let id = $("#paymentRate").data("id");

      if (!amount || !id) {
         alert("Unable to retrieve payment rate id or amount");
         return;
      }

      var data = { "payment_rate_per_hour": amount };

      var ajax_call = $.ajax({
         method: 'PATCH',
         datatype: "json",
         url: '/payrate/' + id,
         data: JSON.stringify(data),
         contentType: 'application/json',
         crossDomain: true,
         async: false,
         success: function(data) {
            alert("Successfully updated!");
            get_payment_rate();
         },
         error: function(result, status, error) {
            alert("Unable to retrieve payment rate. Please try again.");
         }
      });
   }

});
