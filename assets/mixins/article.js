var mixin = {
  methods: {
    submitWhy: function(textcomp) {
      textcomp.whyResponse.sentenceId = textcomp.lastReferenced;
      textcomp.whyResponses.push(textcomp.whyResponse)
      //this.postWhy(textcomp.whyResponse.input, textcomp.whyResponse.sentenceId);
      textcomp.whyResponse = {
        sentenceId: " ",
        input: " "
      };
      textcomp.responseSubmitted = 1;
      textcomp.responseForm = 0;
    }
  }
};

module.exports = mixin;
