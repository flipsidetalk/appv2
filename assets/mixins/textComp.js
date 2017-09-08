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
      textcomp.tooltop = (r.top - rb2.top-42)*100/(rb1.top-rb2.top) + 'px'; //this will place ele below the selection
      textcomp.toolleft = (r.center - rb2.center - 130)*100/(rb1.center-rb2.center) + 'px'; //this will align the right edges together
      textcomp.isHighlighted = sentenceId;
      textcomp.talktop = (r.top - rb2.top) + 'px'; //this will place ele below the selection

      if (!textcomp.tempseen) {
        textcomp.tooldisplay = 'block';
        textcomp.talkdisplay = 'none';
        textcomp.toolcolor = 'black';
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

    var modal = document.getElementById('talkModal');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    //var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function() {
      modal.style.display = "block";
      console.log("okay displayed");
    }

    // When the user clicks on <span> (x), close the modal
    //span.onclick = function() {
    //  modal.style.display = "none";
    //}

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }  }

  };

  module.exports = mixin;
