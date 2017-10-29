var loc = {};

getLoc();

function writeEmail(email) {
  ga('send', 'event', 'Submit', 'signup');
  var data = {
    email: email,
    location: loc
  };
  $.ajax({
    type: 'POST',
    url: '/emails',
    data: data,
    success: function() {
      // console.log("success: " + data);
    },
    error: function() {
      // console.log("error: " + data);
    }
  });
}

function writeContact() {
  var data = $("#contact-us-form").serialize();
  $.ajax({
    type: 'POST',
    url: '/contact',
    data: data,
    success: function() {
      // console.log("success: " + data);
      $("#name-contact-us, #email-contact-us, #message-contact-us").val("");
    },
    error: function() {
      // console.log("error: " + data);
    }
  });
}

function signUp() {
  if ($("#signup-email").val() === "" || $("#signup-password").val() === "" || $("#signup-fn").val() === "" || $("#signup-ln").val() === "") {
    $('#blank-fields').show();
    return;
  }
  var data = $("#signup-form").serialize();
  $.ajax({
    type: 'POST',
    url: '/localSignup',
    data: data,
    success: function(res) {
      // console.log(res)
      if (res === "acct_exists") {
        $('#email-already-signedup').show();
        return;
      } else if (res === "success") {
        $("#signin-email").val($("#signup-email").val());
        $("#signin-password").val($("#signup-password").val());
        return signIn();
      }
    },
    error: function() {
      // console.log("error: " + data);
    }
  });
}

function signIn() {
  if ($("#signin-email").val() === "" || $("#signin-password").val() === "") {
    return;
  }
  var data = $("#signin-form").serialize();
  $.ajax({
    type: 'POST',
    url: '/localSignin',
    data: data,
    success: function(res) {
      if (res === "success") {
        location.reload();
      } else if (res === "wrong_password") {
        $('#incorrect-password').show();
      }
    },
    error: function(res) {
      // console.log(res);
    }
  });
}

function validateEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function getLoc() {
  $.get("https://ipinfo.io", function(response) {
    loc = response.city + ", " + response.region;
  }, "jsonp");
}
