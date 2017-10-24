var mixin = {
  methods: {

    fetchClaims: function(groupId, textcomp, mapcomp){

      console.log('groupId', groupId)
      //mapcomp.displayEveryone = 'none';
      mapcomp.displayIndividual = true;
      //identify the id's for the sentences
      mapcomp.arrayClaim = [];

      for (var m of mapcomp.bubbleData) {
        if (groupId == m.group) {
          if (m.sentences.length < 2) {
            var sentenceObject = m.sentences[0];
            var tempId = m.sentences[0].sentenceId;

            mapcomp.eachClaim.sentenceId = sentenceObject.sentenceId;
            mapcomp.eachClaim.text = JSON.stringify(textcomp.article.sentences[tempId].text);
            if (sentenceObject.average > 0) {
              mapcomp.eachClaim.agreeable = 'agreeBlock';
              mapcomp.eachClaim.percent = sentenceObject.agree;
            }
            else {
              mapcomp.eachClaim.agreeable = 'disagreeBlock';
              mapcomp.eachClaim.percent = sentenceObject.disagree;
            }
            mapcomp.arrayClaim.push(mapcomp.eachClaim);
            mapcomp.eachClaim = {
              sentenceId: "",
              text: "",
              agreeable: "",
              percent: "",
            };
          }
          else {
            for (var s = 0; s < 2; s++) {
              var tempId = m.sentences[s].sentenceId
              mapcomp.eachClaim.sentenceId = m.sentences[s].sentenceId;
              // console.log(tempId)
              // console.log(textcomp.article.sentences[tempId])
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
      }
      //claimIds now has the list of Id's
      //set however many claims and return (agreement, percentage, text, sentenceId)
    },

    fetchEveryone: function(textcomp, mapcomp){

      textcomp.displayVoteCard = 'block';
      textcomp.displayContributeCard = false;
      mapcomp.showVotePercents = 'none';
      mapcomp.displayEveryone = 'block';
      //mapcomp.displayIndividual = 'none';
      mapcomp.arrayEveryone = [];

      for (var m in textcomp.article.sentences) {

        var sentenceObject = textcomp.article.sentences[m];

        if (sentenceObject.mainClaim) {

          mapcomp.eachEveryone.sentenceId = sentenceObject.id;
          mapcomp.eachEveryone.text = sentenceObject.text;
          mapcomp.eachEveryone.agree = '';
          mapcomp.eachEveryone.unsure = '';
          mapcomp.eachEveryone.disagree = '';


          for (var cluster of mapcomp.bubbleData) {
            if (cluster.group == 0) {
              for (var s of cluster.sentences) {
                if(s.sentenceId == sentenceObject.id){
                  var tempId = s.sentenceId
                  mapcomp.eachEveryone.agree = s.agree;
                  mapcomp.eachEveryone.unsure = s.unsure;
                  mapcomp.eachEveryone.disagree = s.disagree;
                }
              }
            }
          }

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
      mapcomp.tempsentenceId = mapcomp.arrayEveryone[mapcomp.displayCounter].sentenceId;
      textcomp.lastReferenced = mapcomp.arrayEveryone[mapcomp.displayCounter].sentenceId;
    },

    fetchNextClaim: function(mapcomp, textcomp){
      mapcomp.showVotePercents = 'none';
      textcomp.displayVoteCard = 'block';
      mapcomp.displayCounter += 1;
      if (mapcomp.displayCounter >= mapcomp.arrayEveryone.length) {
        mapcomp.displayCounter = 0;
      }

      mapcomp.tempsentenceId = mapcomp.arrayEveryone[mapcomp.displayCounter].sentenceId;
      textcomp.lastReferenced = mapcomp.arrayEveryone[mapcomp.displayCounter].sentenceId;
    },

    addBorder: function(groupId, mapcomp){

      //  $(".aBubble").removeClass("borderClass");
      //  $('#'+groupId).addClass("borderClass");
      $(".aBubble").removeAttr('stroke');
      $(".aBubble").removeAttr('stroke');

      $('#'+groupId).attr('stroke', 'rgba(91, 59, 122, 0.7)');
      $('#'+groupId).attr('stroke-width', '5px');

      //$('#'+groupId).attr('fill', 'url(#group'+groupId+')');

      //console.log(groupId);

    },

    colorBubbles: function(mapcomp){
      var sentenceShowing = mapcomp.tempsentenceId;
      for (var m of mapcomp.bubbleData) {
        if (m.group != 0) {
          for (var s of m.sentences) {
            if (s.sentenceId == sentenceShowing) {
              mapcomp.bubbleShade.group = m.group;
              var opacity = Math.abs(s.average)
              if (s.average > 0) {
                //fill should be green
                mapcomp.bubbleShade.fill = 'rgba(104, 207, 174,'+ opacity + ')';
              }
              else if (s.average < 0) {
                //fill should be red
                mapcomp.bubbleShade.fill = 'rgba(235, 115, 115,'+ opacity + ')';
              }
              else {
                mapcomp.bubbleShade.fill = 'rgba(220, 220, 220, 1)'
              } //else if (s.average == 0) {
                //
                //   mapcomp.bubbleShade.fill = 'blue';
                //
                // }

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

      },
      submitWhy: function(textcomp) {
        textcomp.whyResponse.sentenceId = textcomp.lastReferenced;
        textcomp.whyResponse.vote = textcomp.article.sentences[textcomp.lastReferenced].seen;
        textcomp.whyResponses.push(textcomp.whyResponse);
        textcomp.lastUserResponse = textcomp.whyResponse.input;
        textcomp.lastUserVote = textcomp.whyResponse.vote;
        this.postResponse(textcomp.whyResponse.input, textcomp.whyResponse.sentenceId);


        // console.log(textcomp.lastUserResponse);
        textcomp.whyResponse = {
          sentenceId: "",
          input: "",
          vote: ""
        };
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
      },

      submitVote: function(input, seenvalue, textcomp, mapcomp) {

        textcomp.voteCounter +=1;
        var placeholderId = textcomp.lastReferenced; //this is the sentenceID
        //passing response data
        textcomp.response.sentenceId = placeholderId;
        textcomp.response.input = input;
        textcomp.lastVoteValue = input;
        this.postVote(textcomp.lastReferenced, input, mapcomp);
        textcomp.responses.push(textcomp.response)
        textcomp.response = {
          sentenceId: "",
          input: ""
        }; //resets response
        textcomp.article.sentences[placeholderId].seen = seenvalue; //changes m.seen
        textcomp.tempseen = seenvalue; //changes placeholder seen
        //textcomp.form = 0; //
        //textcomp.why = 1;
        textcomp.displayContributeCard = true;
        //textcomp.displayVoteCard = 'none';

        mapcomp.showVotePercents = 'block';

        //  refreshClusterMap();
        //document.getElementById("thinkingEmoji").setAttribute("x", "120");



        var element = document.getElementById('bubbleBox');
        var positionInfo = element.getBoundingClientRect();
        var height = positionInfo.height;
        var width = positionInfo.width;

        var startingX = "";
        var startingY = "";
        //move emoji
        var element = document.getElementById('bubbleBox');
        var positionInfo = element.getBoundingClientRect();
        var height = positionInfo.height;
        var width = positionInfo.width;


        startingX = width/2 - width/8 -25
        startingY = height/2 - height/8 -25
        var changeX = Math.floor(Math.random() * width/4) + 1
        var changeY = Math.floor(Math.random() * height/4) + 1

        //d3.selectAll("#thinkingEmoji").transition().style("x",Math.floor(Math.random() * 100* height/4) + 1).duration(500);
        //d3.selectAll("#thinkingEmoji").transition().style("y",startingY).duration(500);


        d3.selectAll("#thinkingEmoji").transition().duration(500).attr("x",startingX+changeX).attr("y",startingY+changeY);
        //d3.selectAll("#thinkingEmoji").transition().style("y",startingY+changeY).duration(500);


      },
      postVote: function(sentenceId, reaction, mapcomp) {
        var data = {
          sentenceId: sentenceId,
          reaction: reaction
        }
        $.ajax({
          type: 'POST',
          url: '/submitVote',
          data: data,
          success: function(response) {
            console.log("sendsuccess: " + JSON.stringify(response));
            mapcomp.bubbleData = response;
            $('.d3stuff').html('<div class="d3stuff"><div><svg class="bubbleMap"><defs><pattern id="group1" x="0%" y="0%" height="100%" width="100%" viewBox="0 0 512 512"><image x="0%" y="0%" width="512" height="512" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://i.imgur.com/fzYCtwg.png"></image></pattern></defs></svg></div></div>')
            if (mapcomp.bubbleData.length > 2) {

              var diameter = 400; //max size of the bubbles
              var color = d3.scaleOrdinal(d3.schemeCategory20c);

              var bubbleData = mapcomp.bubbleData.slice(1);

              var viewBoxWidth = $('.bubbleMap').outerWidth();
              var viewBoxHeight = 300;

              var svg = d3.select(".bubbleMap")
              .attr("width", 100 + '%')
              .attr("height", 300)
              .attr("class", "bubble")
              .attr('id', "bubbleBox")
              .append("g")
              .attr("transform", "translate(0,0)");

              var tooltip = d3.select("body")
              .append("div")
              .style("position", "absolute")
              .style("z-index", "10")
              .style("visibility", "hidden")
              .style("color", "white")
              .style("padding", "8px")
              .style("background-color", "rgba(0, 0, 0, 0.75)")
              .style("border-radius", "6px")
              .style("font", "15px sans-serif")
              .text("tooltip");

              var emoji = d3.select(".bubble")
              .append("svg:image")
              .attr('id', 'thinkingEmoji')
              .attr('xlink:href', '../img/thinkingEmoji.png')
              .attr("x", viewBoxWidth/2-25)
              .attr("y", viewBoxHeight/2-25)
              .attr("width", "50")
              .attr("height", "50")

              var radiusScale = d3.scaleSqrt().domain([1, 60]).range([30, 130]);

              var simulation = d3.forceSimulation()
              .force("x", d3.forceX(viewBoxWidth / 2).strength(0.05))
              .force("y", d3.forceY(viewBoxHeight / 2).strength(0.05))
              .force("collide", d3.forceCollide(function(d) {
                return radiusScale(d.size + 5);
              }));

              var circles = svg.selectAll("circle")
              .data(bubbleData)
              .enter().append("circle")
              .attr("id", function(d) {
                return d.group;
              })
              .attr("r", function(d) {
                return radiusScale(d.size)
              })
              .attr("class", "aBubble")
              .attr("fill", "#a88dc3")
              .on("mouseover", function(d) {
                tooltip.text("group " + d.group + ', ' + d.size + " people");
                tooltip.style("visibility", "visible");
              })
              .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY + 24) + "px").style("left", (d3.event.pageX - 10) + "px");
              })
              .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
              })
              ;

              simulation.nodes(bubbleData)
              .on("tick", ticked)

              function ticked() {
                circles
                .attr("cx", function(d) {
                  return d.x
                })
                .attr("cy", function(d) {
                  return d.y
                })
              }

              var groupWithUser = "";
              if (mapcomp.user != undefined) {
                var userId = mapcomp.user.id;
              }
              else {
                var userId = '';
              }
              for (var i = 0; i < bubbleData.length; i++) {
                for (var m = 0; m < bubbleData[i]['users'].length; m++) {
                  if (bubbleData[i]['users'][m] == userId){
                    groupWithUser = bubbleData[i]['group'];
                    $("#" + groupWithUser).attr("fill", "url(#group1)");
                    $("#thinkingEmoji").attr("visibility", "hidden");
                  }
                }
              }
            }
          },
          error: function(response) {
            console.log("error: " + JSON.stringify(response));
          }
        });
      },
      fetchCommentsFromCard: function(textcomp){
        var placeholderId = textcomp.lastReferenced;
        textcomp.whyResponse.input = "";
        textcomp.displayAgreeComments = [];
        textcomp.displayDisagreeComments = [];
        textcomp.displayUnsureComments = [];

        //console.log('commentData:' + JSON.stringify(textcomp.commentData));

        for (var comment of textcomp.commentData) {
          if (comment.sentenceId == placeholderId &&comment.statement.length > 2) {
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

        // console.log("agree comments" + JSON.stringify(textcomp.displayAgreeComments));
        // console.log("disagree comments" + JSON.stringify(textcomp.displayDisagreeComments));

      }
    },
    mounted: function() {
      var textcomp = this.textcomp;
      var mapcomp = this.mapcomp;
      var fetchClaims = this.fetchClaims;
      var addBorder = this.addBorder;
      var bubbleData = this.mapcomp.bubbleData.slice(1);
      var groupWithUser = "";

      this.fetchEveryone(textcomp, mapcomp);

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
