var mixin = {
  methods: {
    fetchClaims: function(groupId, textcomp, mapcomp){
      //identify the id's for the sentences
      mapcomp.displayClaim = [];
      console.log(textcomp.article.sentences[856].text)
      for (var m of mapcomp.bubbleData) {
        if (groupId == m.group) {
          for (var s = 0; s < 2; s++) {
            var tempId = m.sentences[s].sentenceId

            mapcomp.eachClaim.sentenceId = m.sentences[s].sentenceId;
            mapcomp.eachClaim.text = JSON.stringify(textcomp.article.sentences[tempId].text);
            if (m.sentences[s].average > 0 ) {
              //value is positive
              mapcomp.eachClaim.agreeable = 'agree';
              mapcomp.eachClaim.percent = m.sentences[s].agree;
            }
            else {
              mapcomp.eachClaim.agreeable = 'disagree';
              mapcomp.eachClaim.percent = m.sentences[s].disagree;

            }

            mapcomp.displayClaim.push(mapcomp.eachClaim);
            mapcomp.eachClaim = {
              sentenceId: "",
              text: "",
              agreeable: "",
              percent: "",
            };
          }
        }
      }

      console.log(mapcomp.claimIds);


      //claimIds now has the list of Id's
      //set however many claims and return (agreement, percentage, text, sentenceId)
    }
  }
};

module.exports = mixin;
