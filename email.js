module.exports = function(firstname, fullname, email) {
  const mandrill = require('mandrill-api/mandrill');
  const mandrill_client = new mandrill.Mandrill('lVlWdn2r1PVYeibszQd9nQ');

  if (firstname !== "") {
    firstname = " " + firstname;
  }
  if (fullname === "") {
    fullname = email;
  }
  var template_name = "welcome-email";
  var template_content = [{
    "name": "name",
    "content": firstname
  }];
  var message = {
    "subject": "Welcome to Flipside!",
    "from_email": "welcome@flipsidetalk.com",
    "from_name": "Flipside",
    "to": [{
      "email": email,
      "name": fullname,
      "type": "to"
    }],
    "headers": {
      "Reply-To": "welcome@flipsidetalk.com"
    },
    "track_opens": true,
    "track_clicks": true,
  };
  mandrill_client.messages.sendTemplate({
      "template_name": template_name,
      "template_content": template_content,
      "message": message
    },
    function(result) {
      console.log(result);
    },
    function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
}
