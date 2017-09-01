var mixin = {
  methods: {
    checkValidLink: function(event) {
      event.preventDefault();
      const link = $('#link-input').val()
      var data = {
        link: link,
      }
      $.ajax({
        type: 'POST',
        url: '/checkValidLink',
        data: data,
        success: function(response) {
          console.log("sendsuccess: " + JSON.stringify(response));
          if (response == 'valid') {
            $('.form-error').hide();
            $('#loading-msg').show();
            var response = {
              link: link,
            }
            $.ajax({
              type: 'POST',
              url: '/submitLink',
              data: data,
              success: function(response) {
                console.log("sendsuccess: " + JSON.stringify(response));
                if (response.substring(0,1) == '/') {
                  window.location.href = response;
                } else {
                  $('.form-error').hide();
                  $('#error-msg').show();
                }
              },
              error: function(response) {
                console.log("error: " + JSON.stringify(response));
              }
            });
          } else {
            $('.form-error').hide();
            $('#invalid-link-msg').show();
          }
        },
        error: function(response) {
          console.log("error: " + JSON.stringify(response));
        }
      });
    },
  },
  mounted: function() {

  }
};

module.exports = mixin;
