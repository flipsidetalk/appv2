var mixin = {
  methods: {
    fetchClaims: function(groupId, textcomp, mapcomp){
      mapcomp.displayEveryone = 'none';
      mapcomp.displayIndividual = 'block';
      //identify the id's for the sentences
      mapcomp.arrayClaim = [];
      console.log(textcomp.article.sentences[856].text)
      for (var m of mapcomp.bubbleData) {
        if (groupId == m.group) {
          for (var s = 0; s < 2; s++) {
            var tempId = m.sentences[s].sentenceId

            mapcomp.eachClaim.sentenceId = m.sentences[s].sentenceId;
            mapcomp.eachClaim.text = JSON.stringify(textcomp.article.sentences[tempId].text);
            if (m.sentences[s].average > 0 ) {
              //value is positive
              mapcomp.eachClaim.agreeable = 'agreeBlock';
              mapcomp.eachClaim.percent = m.sentences[s].agree;
            }
            else {
              mapcomp.eachClaim.agreeable = 'disagreeBlock';
              mapcomp.eachClaim.percent = m.sentences[s].disagree;

            }

            mapcomp.arrayClaim.push(mapcomp.eachClaim);
            mapcomp.eachClaim = {
              sentenceId: "",
              text: "",
              agreeable: "",
              percent: "",
            };
          }
        }
      }
      //claimIds now has the list of Id's
      //set however many claims and return (agreement, percentage, text, sentenceId)
    },

    fetchEveryone: function(textcomp, mapcomp){
      mapcomp.displayEveryone = 'block';
      mapcomp.displayIndividual = 'none';
      mapcomp.arrayEveryone = [];

      for (var m of mapcomp.bubbleData) {
        if (m.group == -1) {
          for (var s of m.sentences) {
            var tempId = s.sentenceId
            mapcomp.eachEveryone.sentenceId = tempId;
            mapcomp.eachEveryone.agree = s.agree;
            mapcomp.eachEveryone.unsure = s.unsure;
            mapcomp.eachEveryone.disagree = s.disagree;
            mapcomp.eachEveryone.text = textcomp.article.sentences[tempId].text;
            mapcomp.arrayEveryone.push(mapcomp.eachEveryone);
            mapcomp.eachEveryone = {
              sentenceId: '',
              text: '',
              agree: '',
              disagree: '',
              unsure: ''
            };
          }
        }
      /*  else {
          for (s of m.sentences) {
            if (s.sentenceId = ) {

            }

          }
        } */
      }
    },

    fetchNextClaim: function(mapcomp){
      mapcomp.displayCounter += 1;
      if (mapcomp.displayCounter >= mapcomp.arrayEveryone.length-1) {
        mapcomp.displayCounter = 0;
      }
    }
  }
};

module.exports = mixin;
