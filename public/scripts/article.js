$.ajax({
  type: 'POST',
  url: '/getArticleData',
  success: function(response) {
    storyContent = new Vue({
      el: "#root",
      data: {
        textcomp: response.textcomp,
        mapcomp: response.mapcomp,
        user: response.user
      },
      mounted: function() {
        this.fetchSentenceData(this.textcomp)
        jQueryFunctions();

      },
      methods: {
        showTool: function(sentenceId, seenvalue, textcomp) {
          textcomp.hasUserSeenHelper = true;
          /** setting the sentence at hand**/
          //$("#tooltip").show();
          textcomp.helpdisplay = 'none';
          textcomp.lastReferenced = sentenceId;
          //textcomp.tempseen = seenvalue;

          var sel = document.getElementById(sentenceId);
          var r = sel.getBoundingClientRect();
          var rel1 = document.createRange();
          rel1.selectNode(document.getElementById('cal1'));
          var rel2 = document.createRange();
          rel2.selectNode(document.getElementById('cal2'));
          var rb1 = rel1.getBoundingClientRect();
          var rb2 = rel2.getBoundingClientRect();


          r.center = (r.right + r.left) / 2
          rb2.center = (rb2.right + rb2.left) / 2
          rb1.center = (rb1.right + rb1.left) / 2
          textcomp.tooltop = (r.top - rb2.top - 42) * 100 / (rb1.top - rb2.top) + 'px'; //this will place ele below the selection
          textcomp.toolleft = (r.center - rb2.center - 170) * 100 / (rb1.center - rb2.center) + 'px'; //this will align the right edges together
          textcomp.isHighlighted = sentenceId;
          textcomp.talktop = (r.top - rb2.top) + 'px'; //this will place ele below the selection

          // if (!textcomp.tempseen) {
          //   textcomp.tooldisplay = 'block';
          //   textcomp.talkdisplay = 'none';
          //   textcomp.toolcolor = '#2b2b2b';
          // }
          // else {
          //   if (seenvalue == 2) {
          //     textcomp.toolcolor = 'green';
          //   }
          //   else if (seenvalue == 3) {
          //     textcomp.toolcolor = 'red';
          //   }
          //   else {
          //     textcomp.toolcolor = 'purple';
          //   }
          //   textcomp.talkdisplay = 'block';
          //   textcomp.tooldisplay = 'none';
          //
          // }

        },
        showHelper: function(sentenceId, textcomp) {
          /** setting the sentence at hand**/
          //$("#tooltip").show();
          if (!textcomp.hasUserVoted && !textcomp.hasUserSeenHelper) {
            var sel = document.getElementById(sentenceId);
            var r = sel.getBoundingClientRect();
            var rel1 = document.createRange();
            rel1.selectNode(document.getElementById('cal1'));
            var rel2 = document.createRange();
            rel2.selectNode(document.getElementById('cal2'));
            var rb1 = rel1.getBoundingClientRect();
            var rb2 = rel2.getBoundingClientRect();
            r.center = (r.right + r.left) / 2
            rb2.center = (rb2.right + rb2.left) / 2
            rb1.center = (rb1.right + rb1.left) / 2
            textcomp.helptop = (r.top - rb2.top - 42) * 100 / (rb1.top - rb2.top) + 'px'; //this will place ele below the selection
            textcomp.helpleft = (r.center - rb2.center - 130) * 100 / (rb1.center - rb2.center) + 'px'; //this will align the right edges together
            textcomp.helpdisplay = 'block';
          }
        },

        submitWhy: function(textcomp) {
          textcomp.whyResponse.sentenceId = textcomp.lastReferenced;
          textcomp.whyResponse.vote = textcomp.article.sentences[textcomp.lastReferenced].seen;
          textcomp.whyResponses.push(textcomp.whyResponse);
          textcomp.lastUserResponse = textcomp.whyResponse.input;
          textcomp.lastUserVote = textcomp.whyResponse.vote;
          this.postResponse(textcomp.whyResponse.input, textcomp.whyResponse.sentenceId);

          textcomp.showUserResponse = 'block';
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

        submitResponse: function(input, seenvalue, textcomp) {
          textcomp.voteCounter += 1;
          var placeholderId = textcomp.lastReferenced; //this is the sentenceID
          //passing response data
          textcomp.lastVoteValue = input;
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
          // textcomp.talkdisplay = "block";
          // textcomp.tooldisplay = 'none';
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

        fetchComments: function(textcomp) {
          var placeholderId = textcomp.lastReferenced;
          textcomp.whyResponse.input = "";
          textcomp.displayAgreeComments = [];
          textcomp.displayDisagreeComments = [];
          textcomp.displayUnsureComments = [];


          for (var comment of textcomp.commentData) {
            if (comment.sentenceId == placeholderId && comment.statement.length > 2) {
              //append it to object
              textcomp.eachDisplayComment.agreeable = comment.reaction;
              textcomp.eachDisplayComment.text = comment.statement;
              textcomp.eachDisplayComment.username = comment.firstname;

              if (comment.reaction == -1) {
                textcomp.displayDisagreeComments.push(textcomp.eachDisplayComment);
              } else if (comment.reaction == 1) {
                textcomp.displayAgreeComments.push(textcomp.eachDisplayComment);
              } else {
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


        },
        fetchSentenceData: function(textcomp) { //equivalent to fetchEveryone from Mapcomp
          //textcomp.displayVoteCard = 'block';
          //textcomp.displayContributeCard = false;
          //mapcomp.showVotePercents = 'none';
          //mapcomp.displayEveryone = 'block';
          //mapcomp.displayIndividual = 'none';

          textcomp.arrayEveryone = [];

          for (var m in textcomp.article.sentences) {

            var sentenceObject = textcomp.article.sentences[m];

            if (sentenceObject.mainClaim) {
              textcomp.eachEveryone.text = sentenceObject.text;
              textcomp.eachEveryone.agree = '';
              textcomp.eachEveryone.unsure = '';
              textcomp.eachEveryone.disagree = '';
              textcomp.eachEveryone.sentenceId = sentenceObject.id;



              for (var cluster of textcomp.bubbleData) {
                if (cluster.group == 0) {


                  for (var s of cluster.sentences) {
                    if (s.sentenceId == sentenceObject.id) {
                      var tempId = s.sentenceId
                      textcomp.eachEveryone.agree = s.agree;
                      textcomp.eachEveryone.unsure = s.unsure;
                      textcomp.eachEveryone.disagree = s.disagree;
                    }
                  }

                }
              }

              textcomp.arrayEveryone.push(textcomp.eachEveryone);
              textcomp.eachEveryone = {
                sentenceId: '',
                text: '',
                agree: '',
                disagree: '',
                unsure: ''
              };

            }
          }


          // textcomp.lastReferenced = textcomp.arrayEveryone[textcomp.displayCounter].sentenceId;


        },
        fetchClaims: function(groupId, textcomp, mapcomp) {

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
                } else {
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
              } else {
                for (var s = 0; s < 2; s++) {
                  var tempId = m.sentences[s].sentenceId
                  mapcomp.eachClaim.sentenceId = m.sentences[s].sentenceId;

                  mapcomp.eachClaim.text = JSON.stringify(textcomp.article.sentences[tempId].text);
                  if (m.sentences[s].average > 0) {
                    //value is positive
                    mapcomp.eachClaim.agreeable = 'agreeBlock';
                    mapcomp.eachClaim.percent = m.sentences[s].agree;
                  } else {
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

        fetchEveryone: function(textcomp, mapcomp) {

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
                    if (s.sentenceId == sentenceObject.id) {
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

        fetchNextClaim: function(mapcomp, textcomp) {
          mapcomp.showVotePercents = 'none';
          textcomp.displayVoteCard = 'block';
          mapcomp.displayCounter += 1;
          if (mapcomp.displayCounter >= mapcomp.arrayEveryone.length) {
            mapcomp.displayCounter = 0;
          }

          mapcomp.tempsentenceId = mapcomp.arrayEveryone[mapcomp.displayCounter].sentenceId;
          textcomp.lastReferenced = mapcomp.arrayEveryone[mapcomp.displayCounter].sentenceId;
        },

        addBorder: function(groupId, mapcomp) {

          //  $(".aBubble").removeClass("borderClass");
          //  $('#'+groupId).addClass("borderClass");
          $(".aBubble").removeAttr('stroke');
          $(".aBubble").removeAttr('stroke');

          $('#' + groupId).attr('stroke', 'rgba(91, 59, 122, 0.7)');
          $('#' + groupId).attr('stroke-width', '5px');

          //$('#'+groupId).attr('fill', 'url(#group'+groupId+')');


        },

        colorBubbles: function(mapcomp) {
          var sentenceShowing = mapcomp.tempsentenceId;
          for (var m of mapcomp.bubbleData) {
            if (m.group != 0) {
              for (var s of m.sentences) {
                if (s.sentenceId == sentenceShowing) {
                  mapcomp.bubbleShade.group = m.group;
                  var opacity = Math.abs(s.average)
                  if (s.average > 0) {
                    //fill should be green
                    mapcomp.bubbleShade.fill = 'rgba(104, 207, 174,' + opacity + ')';
                  } else if (s.average < 0) {
                    //fill should be red
                    mapcomp.bubbleShade.fill = 'rgba(235, 115, 115,' + opacity + ')';
                  } else {
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
            $('#' + bubbleId).attr("fill", bubbleFill);
          }

        },

        submitWhy: function(textcomp) {
          textcomp.whyResponse.sentenceId = textcomp.lastReferenced;
          textcomp.whyResponse.vote = textcomp.article.sentences[textcomp.lastReferenced].seen;
          textcomp.whyResponses.push(textcomp.whyResponse);
          textcomp.lastUserResponse = textcomp.whyResponse.input;
          textcomp.lastUserVote = textcomp.whyResponse.vote;
          this.postResponse(textcomp.whyResponse.input, textcomp.whyResponse.sentenceId);


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

          textcomp.voteCounter += 1;
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


          startingX = width / 2 - width / 8 - 25
          startingY = height / 2 - height / 8 - 25
          var changeX = Math.floor(Math.random() * width / 4) + 1
          var changeY = Math.floor(Math.random() * height / 4) + 1

          //d3.selectAll("#thinkingEmoji").transition().style("x",Math.floor(Math.random() * 100* height/4) + 1).duration(500);
          //d3.selectAll("#thinkingEmoji").transition().style("y",startingY).duration(500);


          d3.selectAll("#thinkingEmoji").transition().duration(500).attr("x", startingX + changeX).attr("y", startingY + changeY);
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
              //console.log("sendsuccess: " + JSON.stringify(response));
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
                  .attr("x", viewBoxWidth / 2 - 25)
                  .attr("y", viewBoxHeight / 2 - 25)
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
                  });

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
                } else {
                  var userId = '';
                }
                for (var i = 0; i < bubbleData.length; i++) {
                  for (var m = 0; m < bubbleData[i]['users'].length; m++) {
                    if (bubbleData[i]['users'][m] == userId) {
                      console.log("USER IS GROUPED!");
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

        fetchCommentsFromCard: function(textcomp) {
          var placeholderId = textcomp.lastReferenced;
          textcomp.whyResponse.input = "";
          textcomp.displayAgreeComments = [];
          textcomp.displayDisagreeComments = [];
          textcomp.displayUnsureComments = [];
          for (var comment of textcomp.commentData) {
            if (comment.sentenceId == placeholderId && comment.statement.length > 2) {
              //append it to object
              textcomp.eachDisplayComment.agreeable = comment.reaction;
              textcomp.eachDisplayComment.text = comment.statement;
              textcomp.eachDisplayComment.username = comment.firstname;

              if (comment.reaction == -1) {
                textcomp.displayDisagreeComments.push(textcomp.eachDisplayComment);
              } else if (comment.reaction == 1) {
                textcomp.displayAgreeComments.push(textcomp.eachDisplayComment);
              } else {
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
      }

    });
  },
  error: function(response) {
    console.error("error: " + response);
  }
});

function jQueryFunctions() {
  $('#switch-to-email').click(function() {
    $('#sign-in-modal').modal('hide');
    $('#email-signup-modal').modal('show');
  });

  $('#switch-email-login').click(function() {
    $('#email-signup-modal').modal('hide');
    $('#email-login-modal').modal('show');
  });

  $('#sign-up').click(function(e) {
    e.preventDefault();
    var field = $('#inputEmail');
    var email = field.val();
    if (validateEmail(email)) {
      writeEmail(email);
      field.val("");
    } else {
      $('#signup > form > .form-group').addClass('has-error').addClass('has-feedback');
      $('#signup > form > .form-group > .glyphicon-remove').show();
    }
  });

  $('#sign-up-top').click(function(e) {
    e.preventDefault();
    var field = $('#inputEmail-top');
    var email = field.val();
    if (validateEmail(email)) {
      writeEmail(email);
      field.val("");
    } else {
      $('#signup-top > form > .form-group').addClass('has-error').addClass('has-feedback');
      $('#signup-top > form > .form-group > .glyphicon-remove').show();
    }
  });

  $('#submit-contact-us').click(function(e) {
    e.preventDefault();
    var name = $('#name-contact-us').val();
    var emailField = $('#email-contact-us');
    var email = emailField.val();
    var message = $('#message-contact-us').val()
    if (validateEmail(email)) {
      writeContact();
      $('#contact-modal').modal('hide');
    } else {
      $('#contact-us-form > .form-group.email').addClass('has-error').addClass('has-feedback');
      $('#contact-us-form > .form-group.email > .glyphicon-remove').show();
    }
  });

  $('#signup-btn').click(function(e) {
    e.preventDefault();
    var email = $('#signup-email').val();
    var fn = $('#signup-fn').val();
    var ln = $('#signup-ln').val();
    var password = $('#signup-password').val();
    if (validateEmail(email)) {
      signUp(email, password, fn, ln);
    } else {
      $('#valid-email-signup').show();
    }
  });

  $('#signin-btn').click(function(e) {
    e.preventDefault();
    var email = $('#signin-email').val();
    var password = $('#signin-password').val();
    if (validateEmail(email)) {
      signIn(email, password);
    } else {
      $('#valid-email-signin').show();
    }
  });

  $(document).mouseup(function(e) {
    if ($(e.target).is('circle')) {
      fetchClaims(e.target.id, textcomp, mapcomp);
      addBorder(e.target.id, mapcomp);
    }
    if ((e.target.className != "regularText") || (e.target.className != "highlightedText") || (e.target.id != "highlightedText")) {
      storyContent.textcomp.tooldisplay = 'none';
      storyContent.textcomp.talkdisplay = 'none';
    }
  });
}
