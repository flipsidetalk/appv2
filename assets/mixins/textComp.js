var mixin = {
  methods: {
    showTool: function(sentenceId, seenvalue, textcomp){

      textcomp.hasUserSeenHelper = true;
      /** setting the sentence at hand**/
      //$("#tooltip").show();
      textcomp.helpdisplay = 'none';
      textcomp.lastReferenced = sentenceId;
      textcomp.tempseen = seenvalue;

      var sel = document.getElementById(sentenceId);
      var r = sel.getBoundingClientRect();
      var rel1= document.createRange();
      rel1.selectNode(document.getElementById('cal1'));
      var rel2= document.createRange();
      rel2.selectNode(document.getElementById('cal2'));
      var rb1 = rel1.getBoundingClientRect();
      var rb2 = rel2.getBoundingClientRect();


      r.center = (r.right+r.left)/2
      rb2.center = (rb2.right+rb2.left)/2
      rb1.center = (rb1.right+rb1.left)/2
      textcomp.tooltop = (r.top - rb2.top-42)*100/(rb1.top-rb2.top) + 'px'; //this will place ele below the selection
      textcomp.toolleft = (r.center - rb2.center - 130)*100/(rb1.center-rb2.center) + 'px'; //this will align the right edges together
      textcomp.isHighlighted = sentenceId;
      textcomp.talktop = (r.top - rb2.top) + 'px'; //this will place ele below the selection

      if (!textcomp.tempseen) {
        textcomp.tooldisplay = 'block';
        textcomp.talkdisplay = 'none';
        textcomp.toolcolor = '#2b2b2b';
      }
      else {
        if (seenvalue == 2) {
          textcomp.toolcolor = 'green';
        }
        else if (seenvalue == 3) {
          textcomp.toolcolor = 'red';
        }
        else {
          textcomp.toolcolor = 'purple';
        }
        textcomp.talkdisplay = 'block';
        textcomp.tooldisplay = 'none';

      }

    },
    showHelper: function(sentenceId, textcomp){
      /** setting the sentence at hand**/
      //$("#tooltip").show();
      if (!textcomp.hasUserVoted && !textcomp.hasUserSeenHelper) {
        var sel = document.getElementById(sentenceId);
        var r = sel.getBoundingClientRect();
        var rel1= document.createRange();
        rel1.selectNode(document.getElementById('cal1'));
        var rel2= document.createRange();
        rel2.selectNode(document.getElementById('cal2'));
        var rb1 = rel1.getBoundingClientRect();
        var rb2 = rel2.getBoundingClientRect();
        r.center = (r.right+r.left)/2
        rb2.center = (rb2.right+rb2.left)/2
        rb1.center = (rb1.right+rb1.left)/2
        textcomp.helptop = (r.top - rb2.top-42)*100/(rb1.top-rb2.top) + 'px'; //this will place ele below the selection
        textcomp.helpleft = (r.center - rb2.center - 130)*100/(rb1.center-rb2.center) + 'px'; //this will align the right edges together
        textcomp.helpdisplay = 'block';
      }
    },

    submitResponse: function(input, seenvalue, textcomp) {
      textcomp.countVote +=1;
      var placeholderId = textcomp.lastReferenced; //this is the sentenceID
      //passing response data
      textcomp.response.sentenceId = placeholderId;
      textcomp.response.input = input;
      this.postVote(textcomp.lastReferenced, input);
      textcomp.responses.push(textcomp.response)
      textcomp.response = {
        sentenceId: "",
        input: ""
      }; //resets response
      textcomp.article.sentences[placeholderId].seen = seenvalue; //changes m.seen
      textcomp.tempseen = seenvalue; //changes placeholder seen
      //textcomp.form = 0; //
      //textcomp.why = 1;
      textcomp.talkdisplay = "block";
      textcomp.tooldisplay = 'none';
      //  refreshClusterMap();
    },
    postVote: function(sentenceId, reaction) {
      var data = {
        sentenceId: sentenceId,
        reaction: reaction
      }
      $.ajax({
        type: 'POST',
        url: '/submitVote',
        data: data,
        success: function() {
          console.log("sendsuccess: " + data);
        },
        error: function() {
          console.log("error: " + JSON.stringify(data));
        }
      });
    },

    fetchComments: function(textcomp){
      var placeholderId = textcomp.lastReferenced;
      textcomp.whyResponse.input = "";
      textcomp.displayAgreeComments = [];
      textcomp.displayDisagreeComments = [];
      textcomp.displayUnsureComments = [];

      //console.log('commentData:' + JSON.stringify(textcomp.commentData));

      for (var comment of textcomp.commentData) {
        if (comment.sentenceId == placeholderId) {
          //append it to object
          textcomp.eachDisplayComment.agreeable = comment.reaction;
          textcomp.eachDisplayComment.text = comment.statement;
          textcomp.eachDisplayComment.username = comment.firstname;

          if (comment.reaction == -1) {
            textcomp.displayDisagreeComments.push(textcomp.eachDisplayComment);
          }
          else if (comment.reaction == 1) {
            textcomp.displayAgreeComments.push(textcomp.eachDisplayComment);
          }
          else {
            textcomp.displayUnsureComments.push(textcomp.eachDisplayComment);
          }
          textcomp.eachDisplayComment = {
            agreeable: '',
            text: '',
          };
        }
      }

      console.log("agree comments" + JSON.stringify(textcomp.displayAgreeComments));
      console.log("disagree comments" + JSON.stringify(textcomp.displayDisagreeComments));


    }
  },


  mounted: function(){

  }
};

module.exports = mixin;
