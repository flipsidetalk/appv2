var mixin = {
  methods: {
    fetchClaims: function(groupId, textcomp, mapcomp){
      //identify the id's for the sentences

      mapcomp.claimIds = [];
      for (var m of mapcomp.bubbleData) {
        if (groupId == m.group) {
          for (var s = 0; s < 2; s++) {
            mapcomp.claimIds.push(m.sentences[s].sentenceId);
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
