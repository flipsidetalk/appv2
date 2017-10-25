<template>
  <div>


    <header-comp :headercomp="headercomp"></header-comp> <!--takes component headercomp, passes headercomp data, could also pass data for other comps-->
    <signin-comp></signin-comp>
    <div id="root">
      <div class="container content textcomp.article">
        <div v-if="textcomp.voteCounter > 4">
          <div class="goToBubbleButton">
            <button type="button" name="button" class="u-greenBackgroundButtonFill keyButtons" href="window.location.href.split('#')[0]">See bubbles below story!</button>
          </div>
        </div>
        <div class="section-content u-maxWidth1000 marginTopBottom50">
          <div class="row white">

          <!--INTRO SECTION -->

          <div class="col-sm-offset-2 col-sm-8 u-marginBottom20">
            <h2 class="montserratLight section-heading">Welcome to <b class="newRed">Flipside!</b></h2>
            <h3 class="montserratLight">A new way to share and hear others' <b class="newGreen">opinions</b></h3><br>
            <h3 class="montserratLight">1. <b class="newRed">Vote</b> on main claims in the article below</h3>
            <h3 class="montserratLight">2. support your opinion with <b class="newRed">Reasons</b></h3>
            <h3 class="montserratLight">3. See the big picture and <b class="newRed">How You Compare</b></h3>
          </div>

          <!-- ARTICLE TEXT -->
          <div class="col-sm-offset-2 col-sm-8">
            <h2 class="section-heading center-heading margin-top-0 montserratLight" name="main">{{textcomp.article.title.title}}</h2>
            <p class="center-heading">by {{textcomp.article.authors[0].name}} of {{textcomp.article.publication.name}} on {{textcomp.article.formattedDate}}</p>


            <text-comp :textcomp="textcomp"></text-comp>


            <div class="cardBlock" v-bind:style="{display: mapcomp.displayEveryone}">
              <div class="u-paddingBottom10">
                <div v-for="(m, mindex) in mapcomp.arrayEveryone">
                  <div v-if="mapcomp.displayCounter == mindex">
                    <div class="u-sizeFullWidth u-inlineBlock u-paddingTop10 u-paddingLeft12 u-paddingRight12">
                      <!-- <a :href="'#'+m.sentenceId">
                      <button type="button" name="button" class="u-floatLeft keyButtons lessImportantButton u-lighter u-fontSize14 u-marginTop10">SEE CONTEXT</button>
                    </a> -->
                    <button type="button" name="button" class="u-floatRight keyButtons u-greenBackgroundButtonFill u-lighter u-fontSize14 u-marginTop10" v-on:click="textcomp.displayContributeCard = false, fetchNextClaim(mapcomp, textcomp)">NEXT CLAIM</button>
                  </div>
                  <div class="u-sizeFullWidth u-inlineBlock u-paddingLeft12 u-paddingRight20 u-marginLeft10 u-marginTop10">
                    <p class="u-paddingTop10 u-marginLeft10 u-fontSize25 grayFont u-marginTop0">Claim {{mapcomp.displayCounter+1}}/{{mapcomp.arrayEveryone.length}}</p>
                  </div>
                  <div class="u-padding10 u-inlineBlock">
                    <h4 class="u-paddingRight20 u-paddingLeft20 georgiaCard u-marginTop0">"{{m.text}}"</h4>
                  </div>
                  <div class="voteSection u-inlineBlock u-paddingBottom10" v-bind:style="{display: textcomp.displayVoteCard}">

                    <span v-if="textcomp.voteCounter < 2">
                      <span class="center">
                        <span v-on:click="submitVote(1, 2, textcomp, mapcomp), fetchCommentsFromCard(textcomp), textcomp.showUserResponse ='none'" class="cardButtonSection center u-greenBackgroundButton u-borderRadiusBL">
                          <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock">Agree</span>
                        </span>
                        <span v-on:click="submitVote(-1, 3, textcomp, mapcomp), fetchCommentsFromCard(textcomp), textcomp.showUserResponse ='none'" class="cardButtonSection center u-redBackgroundButton">
                          <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock">Disagree</span>
                        </span>
                        <span v-on:click="submitVote(0, 4, textcomp, mapcomp), fetchCommentsFromCard(textcomp), textcomp.showUserResponse ='none'" class="cardButtonSection center u-grayBackgroundButton u-borderRadiusBR">
                          <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock u-lastAgreeButton">Unsure</span>
                        </span>
                      </span>
                    </span>
                    <span v-else>
                      <span v-if="textcomp.user == undefined" class="center">
                        <span href="#sign-in-modal" data-toggle="modal" class="cardButtonSection center u-greenBackgroundButton u-borderRadiusBL">
                          <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock">agree</span>
                        </span>
                        <span href="#sign-in-modal" data-toggle="modal" class="cardButtonSection center u-redBackgroundButton">
                          <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock">disagree</span>
                        </span>
                        <span href="#sign-in-modal" data-toggle="modal" class="cardButtonSection center u-grayBackgroundButton u-borderRadiusBR">
                          <span class="u-cardButtonText u-unsureButtonsCard u-verticalAlignTop u-inlineBlock">unsure</span>
                        </span>
                      </span>
                      <span v-else class="center">
                        <span v-on:click="submitVote(1, 2, textcomp, mapcomp), fetchCommentsFromCard(textcomp), textcomp.showUserResponse ='none'" class="cardButtonSection center u-greenBackgroundButton u-borderRadiusBL">
                          <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock">Agree</span>
                        </span>
                        <span v-on:click="submitVote(-1, 3, textcomp, mapcomp), fetchCommentsFromCard(textcomp), textcomp.showUserResponse ='none'" class="cardButtonSection center u-redBackgroundButton">
                          <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock">Disagree</span>
                        </span>
                        <span v-on:click="submitVote(0, 4, textcomp, mapcomp), fetchCommentsFromCard(textcomp), textcomp.showUserResponse ='none'" class="cardButtonSection center u-grayBackgroundButton u-borderRadiusBR">
                          <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock u-lastAgreeButton">Unsure</span>
                        </span>
                      </span>
                    </span>

                  </div>



                  <transition name="slide-fade">
                    <div v-if="textcomp.displayContributeCard" class="u-paddingLeft20 u-paddingRight20">
                      <hr>
                      <div>
                        <h4 class="u-lighter"> I
                          <span v-if="textcomp.lastVoteValue == 0">
                            am unsure because...
                          </span>
                          <span v-if="textcomp.lastVoteValue == 1">
                            agree because ...
                          </span>
                          <span v-if="textcomp.lastVoteValue == -1">
                            disagree because...
                          </span>
                        </h4>
                      </div>

                      <textarea type="text" placeholder="write a reason to help others understand your stance" name="" value="" class="talkInput u-sizeFullWidth" v-model="textcomp.whyResponse.input" style="background-color: white;"></textarea>
                      <div class="u-sizeFullWidth u-inlineBlock">
                        <p class="talkButton montserratLight u-floatRight" v-on:click="submitWhy(textcomp), textcomp.showUserResponse = 'block'">Share</p>
                      </div>

                      <div v-bind:style="{display: textcomp.showUserResponse}" class="u-sizeFullWidth u-paddingTop10 u-paddingBottom10">
                        <h4>Thank you for sharing!</h4>
                      </div>

                      <div v-if="(m.agree*100).toFixed(0) != 0 && (m.disagree*100).toFixed(0) != 0 " class="u-inlineBlock u-sizeFullWidth">
                        <div class="col-xs-6 u-paddingRight0 grayBorderRB">

                          <h4 class="agreeTeal  u-paddingRight10 u-marginTop0 u-paddingBottom10">{{(m.agree*100).toFixed(0)}}% agree</h4>
                          <div v-for="(commentObj, mindex) in textcomp.displayAgreeComments">
                            <div class="u-paddingRight10 grayBorderTop">
                              <p class="commentText u-paddingTop10 u-marginTop10 u-paddingBottom10 BorderRadius7">{{commentObj.text}}</p>
                            </div>
                          </div>
                        </div>
                        <div class="col-xs-6 u-paddingLeft0 grayBorderLB">
                          <h4 class="disagreeRed u-paddingLeft10 u-marginTop0 u-paddingBottom10">{{(m.disagree*100).toFixed(0)}}% disagree</h4>
                          <div v-for="commentObj in textcomp.displayDisagreeComments">
                            <div class="u-paddingLeft10 grayBorderTop">
                              <p class="commentText u-paddingTop10 u-marginTop10 u-paddingBottom10 BorderRadius7">{{commentObj.text}}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
          <br><br>
          </div>


          <div class="col-sm-offset-2 col-sm-8">
            <!--BEGIN MAPCOMP-->
            <div id="mapcompAnchor" v-if="mapcomp.bubbleData.length > 2">
              <div v-if="textcomp.voteCounter > 4">
                <button type="button" name="button" class="u-greenBackgroundButtonFill keyButtons" onclick="location.reload()">See Yourself!</button>
              </div>

              <h2 class="margin-top-0 u-lighter" name="main">Welcome to Flipside!</h2><br>
              <h3 class="u-lighter"><b>Click on Bubbles</b> to learn what different people think.</h3>

              <div class="cardBlock u-height350">
                <div class="u-paddingTop10">
                  <div class="u-sizeFullWidth u-inlineBlock u-paddingLeft12 u-paddingRight20 u-marginLeft10">
                    <p class="u-paddingTop10 u-marginLeft10 u-fontSize25 grayFont u-marginTop0">The People's Opinion</p>
                  </div>
                  <map-comp :mapcomp="mapcomp"></map-comp>
                  <div class="u-sizeFullWidth u-inlineBlock u-paddingBottom10 u-paddingLeft12 u-paddingRight12">
                    <button type="button" name="button" class="u-floatRight keyButtons u-greenBackgroundButtonFill u-lighter u-fontSize14 u-marginTop10" v-on:click="textcomp.displayContributeCard = false, mapcomp.displayIndividual = false;">Vote</button>
                  </div>
                  <transition name='slide-fade'>
                    <div v-if="mapcomp.displayIndividual">
                      <div class="u-inlineBlock">

                        <div class="u-paddingRight20 u-paddingLeft20">
                          <hr>
                        </div>
                        <div class="u-padding10">

                          <div class="u-sizeFullWidth u-inlineBlock u-paddingLeft12 u-paddingRight20 u-marginLeft10 u-marginTop10 u-marginRight10">

                            <button type="button u-marginRight10" class="close" v-on:click="mapcomp.displayIndividual = false;">
                              <span class="u-fontSize45 u-lighter">&times;</span>
                            </button>
                            <p class="u-paddingTop10 u-marginLeft10 u-fontSize25 grayFont u-marginTop0">How this group voted:</p>
                          </div>

                          <div v-for="m in mapcomp.arrayClaim">

                            <div class="u-paddingLeft10">

                              <div v-if="m.agreeable == 'agreeBlock'">
                                <h4 class="agreeTeal u-fontSize20 u-paddingLeft20">{{(m.percent*100).toFixed(0)}}% agree with:</h4>
                              </div>
                              <div v-else>
                                <h4 class="disagreeRed u-fontSize20 u-paddingLeft20">{{(m.percent*100).toFixed(0)}}% disagree with:</h4>
                              </div>
                              <div>
                                <h5 class="georgiaCard u-paddingRight20 u-paddingLeft20 u-paddingBottom10">{{m.text}}</h5>
                              </div>

                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--START MODAL-->
  <div class="modal fade talkModal" id="talkModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-content talkDialogue">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button><br>
      <div class="content-section">
        <h4 class="quoteSection">
          <div v-for="(m, mindex) in textcomp.article.sentences">

            <div v-if="mindex == textcomp.lastReferenced">
              {{m.text}}
            </div>
          </div>
          <!--{{textcomp.article.sentences[textcomp.lastReferenced]}} -->
        </h4>

        <!-- <div v-if="textcomp.article.sentences[textcomp.lastReferenced]seen == 2">
        <h5>I <b>AGREE</b> because ... </h5>
      </div>
      <div v-else-if="textcomp.article.sentences[textcomp.lastReferenced].seen == 3">
      <h5>I <b>DISAGREE</b> because ... </h5>
    </div>
    <div v-else="textcomp.article.sentences[textcomp.lastReferenced].seen == 4">
    <h5>I am <b>UNSURE</b> because ... </h5>
  </div> -->

  <h5>I think ...<b></b> </h5>
  <textarea type="text" placeholder="" name="" value="" class="talkInput u-sizeFullWidth" v-model="textcomp.whyResponse.input" style="background-color: white;"></textarea>
  <p class="talkButton montserratLight u-floatRight" v-on:click="submitWhy(textcomp), textcomp.showUserResponse = 'block'">Share</p>


  <div v-bind:style="{display: textcomp.showUserResponse}">
    <div v-if="textcomp.lastUserVote == 2">
      <div class="commentBlock agreeBlock">
        <h4 class="white-text commentHeader u-inlineBlock">thanks for responding!</h4>
        <div class="commentSection">
          <div class="commentContent">
            <p class="commentText">{{textcomp.lastUserResponse}}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="textcomp.lastUserVote == 3">
      <div class="commentBlock disagreeBlock">
        <h4 class="white-text commentHeader u-inlineBlock">thanks for responding!</h4>
        <div class="commentContent">
          <p class="commentText">{{textcomp.lastUserResponse}}</p>
        </div>
      </div>
    </div>
    <div v-else="textcomp.lastUserVote == 4">
      <div class="commentBlock agreeBlock">
        <h4 class="white-text commentHeader u-inlineBlock">thanks for responding!</h4>
        <div class="commentContent">
          <p class="commentText">{{textcomp.lastUserResponse}}</p>
        </div>
      </div>
    </div>
  </div>
  <br>

  <div class="commentBlock agreeBlock">
    <div class="u-sizeFullWidth u-inlineBlock">
      <h4 class="white-text commentHeader u-inlineBlock">
        <span v-for="m in mapcomp.bubbleData">
          <span v-if="m.group == 0">
            <span v-for="s in m.sentences">
              <span v-if="s.sentenceId == textcomp.lastReferenced">
                {{(s.agree*100).toFixed(2)}}%
              </span>
            </span>
          </span>
        </span>
        <span>in agreement</span>
      </h4>

      <div class="seeMoreButton u-floatRight u-inlineBlock" v-on:click="textcomp.showAgreeComments = !textcomp.showAgreeComments">
        <div v-if="textcomp.showAgreeComments">
          read less
        </div>
        <div v-else>
          read more  ({{textcomp.displayAgreeComments.length}})
        </div>
      </div>

    </div>

    <div v-if="!textcomp.showAgreeComments">
      <div v-for="(commentObj, mindex) in textcomp.displayAgreeComments">
        <div v-if="mindex < 2">
          <div class="commentSection">
            <div class="commentName">
              <b class="commentText">{{commentObj.username}}</b>
            </div>
            <div class="commentContent">
              <p class="commentText">{{commentObj.text}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-for="commentObj in textcomp.displayAgreeComments">
        <div class="commentSection">
          <div class="commentName">
            <b class="commentText">{{commentObj.username}}</b>
          </div>
          <div class="commentContent">
            <p class="commentText">{{commentObj.text}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="commentBlock disagreeBlock">
    <div class="u-sizeFullWidth u-inlineBlock">
      <h4 class="white-text commentHeader u-inlineBlock">
        <span v-for="m in mapcomp.bubbleData">
          <span v-if="m.group == 0">
            <span v-for="s in m.sentences">
              <span v-if="s.sentenceId == textcomp.lastReferenced">
                {{(s.disagree*100).toFixed(2)}}%
              </span>
            </span>
          </span>
        </span>
        <span>in disagreement</span>
      </h4>
      <div class="seeMoreButton u-floatRight u-inlineBlock" v-on:click="textcomp.showDisagreeComments = !textcomp.showDisagreeComments">
        <div v-if="textcomp.showDisagreeComments">
          read less
        </div>
        <div v-else>
          read more ({{textcomp.displayDisagreeComments.length}})
        </div>
      </div>
    </div>
    <div v-if="!textcomp.showDisagreeComments">
      <div v-for="(commentObj, mindex) in textcomp.displayDisagreeComments">
        <div v-if="mindex < 2">
          <div class="commentSection">
            <div class="commentName">
              <b class="commentText">{{commentObj.username}}</b>
            </div>
            <div class="commentContent">
              <p class="commentText">{{commentObj.text}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-for="commentObj in textcomp.displayDisagreeComments">
        <div class="commentSection">
          <div class="commentName">
            <b class="commentText">{{commentObj.username}}</b>
          </div>
          <div class="commentContent">
            <p class="commentText">{{commentObj.text}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</div> <!--END MODAL-->
</div>
</template>


<script src="jquery.localscroll.js" type="text/javascript"></script>
<script src="jquery.scrollTo.js" type="text/javascript"></script>
<script>
import headerComp from './components/header-comp.vue'; //gets the components
import signinComp from './components/signin-comp.vue';
import introComp from './components/intro-comp.vue';
import mapComp from './components/map-comp.vue';
import cardsComp from './components/cards-comp.vue';
import textComp from './components/text-comp.vue';
import commentsComp from './components/comments-comp.vue';
import mixin from '../assets/mixins/article.js';

export default {
  mixins: [mixin], //mixin from article.js, variable named mixin above
  data: function() {
    return {}
  },
  components: {
    headerComp: headerComp,
    signinComp: signinComp,
    introComp: introComp,
    mapComp: mapComp,
    cardsComp: cardsComp,
    textComp: textComp,
    commentsComp: commentsComp
  }
}
</script>

<style lang="css">

</style>
