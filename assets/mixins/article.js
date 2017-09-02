var mixin = {
  methods: {
    submitWhy: function(textcomp) {
      textcomp.whyResponse.sentenceId = textcomp.lastReferenced;
      textcomp.whyResponse.vote = textcomp.article.sentences[textcomp.lastReferenced].seen;
      textcomp.whyResponses.push(textcomp.whyResponse)
      this.postResponse(textcomp.whyResponse.input, textcomp.whyResponse.sentenceId);
      textcomp.whyResponse = {
        sentenceId: "",
        input: "",
        vote: ""
      };
      textcomp.responseSubmitted = 1;
      textcomp.responseForm = 0;
      textcomp.talkdisplay = "none";
    },
    postResponse: function(statement, sentenceId) {
      var data = {
        sentenceId: sentenceId,
        statement: statement
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
    }
  }
};

module.exports = mixin;
