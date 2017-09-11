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
      }
      mapcomp.tempsentenceId = mapcomp.arrayEveryone[mapcomp.displayCounter].sentenceId;
    },

    fetchNextClaim: function(mapcomp){
      mapcomp.displayCounter += 1;
      if (mapcomp.displayCounter >= mapcomp.arrayEveryone.length-1) {
        mapcomp.displayCounter = 0;
      }

      mapcomp.tempsentenceId = mapcomp.arrayEveryone[mapcomp.displayCounter].sentenceId;
    },
    addBorder: function(groupId, mapcomp){

      $(".aBubble").removeClass("borderClass");
      $('#'+groupId).addClass("borderClass");
    },

    colorBubbles: function(mapcomp){
      var sentenceShowing = mapcomp.tempsentenceId;
      for (var m of mapcomp.bubbleData) {
        if (m.group != -1) {
          for (var s of m.sentences) {
            if (s.sentenceId == sentenceShowing) {
              mapcomp.bubbleShade.group = m.group;
              var opacity = Math.abs(s.average)
              if (s.average > 0) {
                //fill should be green
                mapcomp.bubbleShade.fill = 'rgba(104, 207, 174,'+ opacity + ')'
              }
              else {
                //fill should be red
                mapcomp.bubbleShade.fill = 'rgba(235, 115, 115,'+ opacity + ')'
              }
              mapcomp.bubbleShades.push(mapcomp.bubbleShade);
              mapcomp.bubbleShade = {
                group: '',
                fill: ''
              };
            }
          }
        }
      }
      for (m of mapcomp.bubbleShades) {
        var bubbleId = m.group;
        var bubbleFill = m.fill;
        $('#'+bubbleId).attr("fill", bubbleFill);
      }

    }
  },
  mounted: function() {
    var textcomp = this.textcomp;
    var mapcomp = this.mapcomp;
    var fetchClaims = this.fetchClaims;
    var addBorder = this.addBorder;
    $(document).mouseup(function(e) {
      if ($(e.target).is('circle')) {
        fetchClaims(e.target.id, textcomp, mapcomp);
        addBorder(e.target.id, mapcomp);
      }
      if((e.target.className != "regularText") || (e.target.className != "highlightedText") || (e.target.id != "highlightedText")){
        textcomp.tooldisplay = 'none';
        textcomp.talkdisplay = 'none';
      }
   });
  }

};

module.exports = mixin;
