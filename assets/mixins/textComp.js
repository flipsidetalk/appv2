var mixin = {
  methods: {
    popMenu: function(obj, textcomp) {
      textcomp.why = false;
      textcomp.responseSubmitted = false;
      textcomp.form = 1;
      textcomp.lastReferenced = obj.sentenceId;
    },
    popWhyMenu: function(obj, textcomp) {
      textcomp.why = true;
      textcomp.form = 0;
      textcomp.lastReferenced = obj.sentenceId;
      textcomp.responseSubmitted = false;
    },
    popResponseForm: function(obj, textcomp) {
      textcomp.whyResponse.input = "";
      textcomp.responseForm = true;
      textcomp.lastReferencedResponseForm = obj.sentenceId;
    },
    submitResponse: function(sentence, input, responseColor, textcomp) {
      alert("hello");
      textcomp.response.sentenceId = sentence.sentenceId;
      textcomp.response.input = input;
      this.postResponse(sentence.sentenceId, input);
      textcomp.responses.push(textcomp.response)
      textcomp.response = {
        sentenceId: "",
        input: ""
      };
      textcomp.form = 0;
      textcomp.why = 1;
      if (textcomp.signedIn == false) {
        sentence.seen = responseColor;
      }
      sentence.seen = responseColor;
      refreshClusterMap();
    },
    submitWhy: function(obj, textcomp) {
      textcomp.whyResponse.sentenceId = obj.sentenceId;
      textcomp.whyResponses.push(textcomp.whyResponse)
      this.postWhy(textcomp.whyResponse.input, textcomp.whyResponse.sentenceId);
      textcomp.whyResponse = {
        sentenceId: "",
        input: ""
      };
      textcomp.form = 0;
      textcomp.why = 0;
      textcomp.responseSubmitted = 1;
      textcomp.responseForm = 0;
    },
    postResponse: function(sentenceId, reaction) {
      var data = {
        sentenceId: sentenceId,
        reaction: reaction
      }
      $.ajax({
        type: 'POST',
        url: '/submitResponse',
        data: data,
        success: function() {
          console.log("sendsuccess: " + data);
        },
        error: function() {
          console.log("error: " + data);
        }
      });
    },
    postWhy: function(statement, sentenceId) {
      var data = {
        sentenceId: sentenceId,
        statement: statement
      }
      $.ajax({
        type: 'POST',
        url: '/submitWhy',
        data: data,
        success: function() {
          console.log("sendsuccess: " + data);
        },
        error: function() {
          console.log("error: " + data);
        }
      });
    }
  }
};

module.exports = mixin;
