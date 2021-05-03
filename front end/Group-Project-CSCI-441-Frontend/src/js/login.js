$(document).ready(function(){
    // Login button, clicked
    $("button[type='submit']").click(function(event){
        event.preventDefault();
        const user = {
            email: $("#input_email").val(),
            password: $("#input_password").val(),
        };

        // Send POST request to backend
        $.ajax({
            type: "POST",
            url: "/login",
            data: JSON.stringify(user),
            success: function(data){
                window.location.href = data.redirect;
            },
            error: function(error){
                alert("Invalid username or password. Please try again.");
            },
            dataType: "json",
            contentType: "application/json",
        });
    });
});
