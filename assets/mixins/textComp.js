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

    popMenu: function(obj, textcomp) {
      textcomp.why = false;
      textcomp.responseSubmitted = false;
      textcomp.form = 1;
      textcomp.lastReferenced = obj.sentenceId;
    },
    popWhyMenu: function(obj, textcomp) {
      textcomp.why = true;
      textcomp.form = 0;
      textcomp.lastReferenced = obj.sentenceId;
      textcomp.responseSubmitted = false;
    },
    popResponseForm: function(obj, textcomp) {
      textcomp.whyResponse.input = "";
      textcomp.responseForm = true;
      textcomp.lastReferencedResponseForm = obj.sentenceId;
    },

    submitResponse: function(input, seenvalue, textcomp) {
      var placeholderId = textcomp.lastReferenced; //this is the sentenceID

      //passing response data
      textcomp.response.sentenceId = placeholderId;
      textcomp.response.input = input;
      this.postResponse(textcomp.lastReferenced, input);
      textcomp.responses.push(textcomp.response)
      textcomp.response = {
        sentenceId: "",
        input: ""
      }; //resets response

      textcomp.article2.text.main2[placeholderId].seen = seenvalue; //changes m.seen
      textcomp.tempseen = seenvalue; //changes placeholder seen

      //textcomp.form = 0; //
      //textcomp.why = 1;
      textcomp.tooldisplay = "block";
    //  refreshClusterMap();
    },


    submitWhy: function(obj, textcomp) {
      textcomp.whyResponse.sentenceId = obj.sentenceId;
      textcomp.whyResponses.push(textcomp.whyResponse)
      this.postWhy(textcomp.whyResponse.input, textcomp.whyResponse.sentenceId);
      textcomp.whyResponse = {
        sentenceId: "",
        input: ""
      };
      textcomp.form = 0;
      textcomp.why = 0;
      textcomp.responseSubmitted = 1;
      textcomp.responseForm = 0;
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
