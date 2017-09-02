var mixin = {
  methods: {
    submitWhy: function(textcomp) {
      textcomp.whyResponse.sentenceId = textcomp.lastReferenced;
      textcomp.whyResponse.vote = textcomp.article.sentences[textcomp.lastReferenced].seen;
      textcomp.whyResponses.push(textcomp.whyResponse)
      //this.postWhy(textcomp.whyResponse.input, textcomp.whyResponse.sentenceId);
      textcomp.whyResponse = {
        sentenceId: "",
        input: "",
        vote: ""
      };
      textcomp.responseSubmitted = 1;
      textcomp.responseForm = 0;
      textcomp.talkdisplay = "none";
    }
  }
};

module.exports = mixin;
