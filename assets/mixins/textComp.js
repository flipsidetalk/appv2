var mixin = {
  methods: {
    popMenu: function(obj, data) {
      data.why = false;
      data.responseSubmitted = false;
      data.form = 1;
      data.lastReferenced = obj.sentenceId;
    },
    popWhyMenu: function(obj, data) {
      data.why = true;
      data.form = 0;
      data.lastReferenced = obj.sentenceId;
      data.responseSubmitted = false;
    },
    popResponseForm: function(obj, data) {
      data.whyResponse.input = "";
      data.responseForm = true;
      data.lastReferencedResponseForm = obj.sentenceId;
    },
    submitResponse: function(sentence, input, data) {
      data.response.sentenceId = sentence.sentenceId;
      data.response.input = input;
      this.postResponse(sentence.sentenceId, input);
      data.responses.push(data.response)
      data.response = {
        sentenceId: "",
        input: ""
      };
      data.form = 0;
      data.why = 1;
      if (data.signedIn == false) {
        sentence.seen = true;
      }
      sentence.seen = true;
    },
    submitWhy: function(obj, data) {
      data.whyResponse.sentenceId = obj.sentenceId;
      data.whyResponses.push(data.whyResponse)
      this.postWhy(data.whyResponse.input, data.whyResponse.sentenceId);
      data.whyResponse = {
        sentenceId: "",
        input: ""
      };
      data.form = 0;
      data.why = 0;
      data.responseSubmitted = 1;
      data.responseForm = 0;
    },
    postResponse: function(passage_id, reaction) {
      var data = {
        passage_id: passage_id,
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
    postWhy: function(statement, passage_id) {
      var data = {
        passage_id: passage_id,
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
