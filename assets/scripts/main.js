$(function() {

  $('#sign-up').click(function(e) {
    e.preventDefault();
    var field = $('#inputEmail');
    var email = field.val();
    if (validateEmail(email)) {
      writeEmail(email);
      field.val("");
    } else {
      $('#signup > form > .form-group').addClass('has-error').addClass('has-feedback');
      $('#signup > form > .form-group > .glyphicon-remove').show();
    }
  });

  $('#sign-up-top').click(function(e) {
    e.preventDefault();
    var field = $('#inputEmail-top');
    var email = field.val();
    if (validateEmail(email)) {
      writeEmail(email);
      field.val("");
    } else {
      $('#signup-top > form > .form-group').addClass('has-error').addClass('has-feedback');
      $('#signup-top > form > .form-group > .glyphicon-remove').show();
    }
  });

  $('#submit-contact-us').click(function(e) {
    e.preventDefault();
    var name = $('#name-contact-us').val();
    var emailField = $('#email-contact-us');
    var email = emailField.val();
    var message = $('#message-contact-us').val()
    if (validateEmail(email)) {
      writeContact();
      $('#contact-modal').modal('hide');
    } else {
      $('#contact-us-form > .form-group.email').addClass('has-error').addClass('has-feedback');
      $('#contact-us-form > .form-group.email > .glyphicon-remove').show();
    }
  });

  $('#switch-to-email').click(function() {
    $('#sign-in-modal').modal('hide');
    $('#email-signup-modal').modal('show');
  });

  $('#switch-email-login').click(function() {
    $('#email-signup-modal').modal('hide');
    $('#email-login-modal').modal('show');
  });

  $('#signup-btn').click(function(e) {
    e.preventDefault();
    var email = $('#signup-email').val();
    var fn = $('#signup-fn').val();
    var ln = $('#signup-ln').val();
    var password = $('#signup-password').val();
    if (validateEmail(email)) {
      signUp(email, password, fn, ln);
    } else {
      $('#valid-email-signup').show();
    }
  });

  $('#signin-btn').click(function(e) {
    e.preventDefault();
    var email = $('#signin-email').val();
    var password = $('#signin-password').val();
    if (validateEmail(email)) {
      signIn(email, password);
    } else {
      $('#valid-email-signin').show();
    }
  });
});

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
        window.location.href = "/";
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
