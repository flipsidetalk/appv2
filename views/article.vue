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
        <div class="section-content u-maxWidth1000 marginTopBottom70">
          <div class="row white">

            <div class="col-sm-offset-2 col-sm-8">
              <!--BEGIN MAPCOMP-->


              <h2 class="u-lighter margin-top-0 montserratLight" name="main">THE PEOPLE'S OPINION</h2>

              <div id="mapcompAnchor" class="row" v-if="mapcomp.acluData.length > 2">

                <div v-if="textcomp.voteCounter > 4">
                  <button type="button" name="button" class="u-greenBackgroundButtonFill keyButtons" onclick="location.reload()">See Yourself!</button>
                </div>

                <map-comp :mapcomp="mapcomp"></map-comp>
                <div class="col-md-12">
                  <div v-bind:style="{display: mapcomp.displayIndividual}">
                    <div v-for="m in mapcomp.arrayClaim">
                      <div v-bind:class="m.agreeable" class="commentBlock">
                        <div class="commentHeader">
                          <div v-if="m.agreeable == 'agreeBlock'" class="u-lighter">
                            {{(m.percent*100).toFixed(2)}}% in agreement
                          </div>
                          <div v-else class="u-lighter">
                            {{(m.percent*100).toFixed(2)}}% in disagreement
                          </div>
                        </div>
                        <div class="commentSection">
                          <h5 class="u-lighter">{{m.text}}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div class="col-sm-offset-2 col-sm-8">





              <h2 class="section-heading center-heading margin-top-0 montserratLight" name="main">{{textcomp.article.title.title}}</h2>
              <p class="center-heading">by {{textcomp.article.authors[0].name}} of {{textcomp.article.publication.name}} on {{textcomp.article.formattedDate}}</p>
              <div class="allClaims">
                <div class="u-inlineBlock u-sizeFullWidth">
                  <div class="button keyButtons u-lighter purpleBackground u-inlineBlock u-marginAuto center u-width50" name="keybutton" v-on:click="fetchEveryone(textcomp, mapcomp)">
                    vote
                  </div>
                </div>

                <div class="everyone cardBlock" v-bind:style="{display: mapcomp.displayEveryone}">

                  <div v-for="(m, mindex) in mapcomp.arrayEveryone">
                    <div v-if="mapcomp.displayCounter == mindex">
                      <button type="button" name="button" class="keyButtons u-greenBackgroundButtonFill u-lighter u-fontSize20 u-floatRight u-inlineBlock u-marginTop10" v-on:click="fetchNextClaim(mapcomp, textcomp)">Next -></button>

                      <div class="commentHeader">
                        <!-- actualId: {{m.sentenceId}}
                        lastReferenced: {{textcomp.lastReferenced}}
                        responses: {{textcomp.responses}} -->
                        <h4>Vote on five sentences see how you compare to others:</h4><br>

                        <h4 class="u-lighter georgia">{{m.text}}</h4>
                      </div>
                      <div class="voteSection" v-bind:style="{display: textcomp.displayVoteCard}">
                        <span v-if="textcomp.user == undefined" class="center">
                          <span href="#sign-in-modal" data-toggle="modal">
                            <i class="fa fa-smile-o fa-2x black u-pointer" aria-hidden="true"></i>
                            <span class="u-agreeButtonsCard u-verticalAlignTop u-inlineBlock"><span class="u-agreeButton">agree</span></span>
                          </span>
                          <span href="#sign-in-modal" data-toggle="modal">
                            <i class="fa fa-frown-o fa-2x black" aria-hidden="true"></i>
                            <span class="u-agreeButtonsCard u-verticalAlignTop u-inlineBlock"><span class="u-agreeButton">disagree</span></span>
                          </span>

                          <span href="#sign-in-modal" data-toggle="modal">
                            <i class="fa fa-meh-o fa-2x black" aria-hidden="true"></i>
                            <span class="u-agreeButtonsCard u-verticalAlignTop u-inlineBlock u-lastAgreeButton"><span class="u-agreeButton">unsure</span></span>
                          </span>
                        </span>
                        <span v-else class="center">
                          <span v-on:click="submitVote(1, 2, textcomp, mapcomp)">
                            <i class="fa fa-smile-o fa-2x black u-pointer" aria-hidden="true"></i>
                            <span class="u-agreeButtonsCard u-verticalAlignTop u-inlineBlock">
                              <span class="u-agreeButton">agree</span>
                            </span>
                          </span>
                          <span v-on:click="submitVote(-1, 3, textcomp, mapcomp)" class="u-button">
                            <i class="fa fa-frown-o fa-2x black" aria-hidden="true"></i>
                            <span class="u-agreeButtonsCard u-verticalAlignTop u-inlineBlock">
                              <span class="u-agreeButton">disagree</span>
                            </span>
                          </span>
                          <span v-on:click="submitVote(0, 4, textcomp, mapcomp)" class="u-button">
                            <i class="fa fa-meh-o fa-2x black" aria-hidden="true"></i>
                            <span class="u-agreeButtonsCard u-verticalAlignTop u-inlineBlock u-lastAgreeButton">
                              <span class="u-agreeButton">unsure</span>
                            </span>
                          </span>
                        </span>
                      </div>
                      <div class="contributeCard  u-paddingLeft20" v-bind:style="{display: textcomp.displayContributeCard}">

                        <span><h4 class="u-lighter"> you voted:

                          <span v-if="textcomp.lastVoteValue == 0">
                            unsure
                          </span>
                          <span v-if="textcomp.lastVoteValue == 1">
                            agree
                          </span>
                          <span v-if="textcomp.lastVoteValue == -1">
                            disagree
                          </span>
                        </h4></span>
                        <span> <button href="#talkModal" data-toggle="modal" class="keyButtons u-purpleBackground" v-on:click="fetchCommentsFromCard(textcomp), textcomp.showUserResponse ='none'">respond</button>
                        </span>

                        <br>


                      </div>
                      <div v-bind:style="{display: mapcomp.showVotePercents}" class="u-marginLeft10">
                        <div v-if="(m.agree*100).toFixed(0) != 0 && (m.disagree*100).toFixed(0) != 0 ">

                          <h4 class="u-lighter"> others voted:</h4>
                          <div class="commentBlock agreeBlock .transition2" v-bind:style="{width: 50+m.agree*50 + '%'}">
                            <div class="commentHeader">
                              <h4 class="u-lighter">{{(m.agree*100).toFixed(0)}}% agree</h4>
                            </div>
                          </div>
                          <div class="commentBlock disagreeBlock .transition2" v-bind:style="{width: 50+m.disagree*50 + '%'}">
                            <div class="commentHeader">
                              <h4 class="u-lighter">{{(m.disagree*100).toFixed(0)}}% disagree</h4>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <h4>No one else has voted, but you can share this with friends!!</h4>
                        </div>
                      </div>





                    </div>
                  </div>
                </div>
              </div>


              <br><br>

              <text-comp :textcomp="textcomp"></text-comp>
              <br><br>

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
    <br> <br><br><br>

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
          <span v-for="m in mapcomp.acluData">
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
          <span v-for="m in mapcomp.acluData">
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
