var mixin = {
  methods: {
    showTool: function(sentenceId, seenvalue, textcomp){
      /** setting the sentence at hand**/
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
      textcomp.tooltop = (r.top - rb2.top-35)*100/(rb1.top-rb2.top) + 'px'; //this will place ele below the selection

      textcomp.toolleft = (r.center - rb2.center - 105)*100/(rb1.center-rb2.center) + 'px'; //this will align the right edges together
      textcomp.tooldisplay = 'block';
      textcomp.isHighlighted = sentenceId;
      textcomp.talktop = (r.top - rb2.top) + 'px'; //this will place ele below the selection
      textcomp.talkdisplay = 'none';
    },
    submitResponse: function(input, seenvalue, textcomp) {
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
      textcomp.tooldisplay = "block";
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
  },
  mounted: function(){
    window.addEventListener('mousedown', function (textcomp) {
      console.log(
        "hello"
      );
      textcomp.tooldisplay = 'none';
      textcomp.isHighlighted = false;
    });
  }

};

module.exports = mixin;
