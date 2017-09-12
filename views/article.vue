<template>
  <div>


    <header-comp :headercomp="headercomp"></header-comp> <!--takes component headercomp, passes headercomp data, could also pass data for other comps-->
    <signin-comp></signin-comp>
    <div class="container content article-top">
      <div class="section-content u-maxWidth1000 u-paddingRight20 u-paddingLeft20">
        <div class="row" v-if="mapcomp.bubbleData.length > 2">
          <map-comp :mapcomp="mapcomp"></map-comp>
          <!--this is keycomp -->
          <div class="col-md-6">
            <span class="">
              <h4 class="">the ideas within our bubbles:</h4>
              <span type="button" class="keyButtons u-lighter purpleBackground" name="keybutton" v-on:click="fetchEveryone(textcomp, mapcomp)">everyone</span>
              <span v-for="m in mapcomp.bubbleData">
                <span v-if="m.group != 0">
                  <span type="button" class="keyButtons u-lighter u-fontSize20 purpleBackground" name="keybutton" v-bind:id="m.group" v-on:click="fetchClaims(m.group, textcomp, mapcomp), addBorder(m.group, textcomp, mapcomp)">{{m.group}}</span>
                </span>
              </span>
              <h4></h4>
              <div class="everyone" v-bind:style="{display: mapcomp.displayEveryone}">
                <div v-for="(m, mindex) in mapcomp.arrayEveryone">
                  <div v-if="mapcomp.displayCounter == mindex">
                    tempsentenceId: {{mapcomp.tempsentenceId}}
                    <div class="commentHeader">
                      actualId: {{m.sentenceId}}
                      <h4 class="u-lighter">{{m.text}}</h4>
                    </div>
                    <div class="commentBlock agreeBlock .transition2" v-bind:style="{width: 50+m.agree*50 + '%'}">
                      <div class="commentHeader">
                        <h4 class="u-lighter">{{m.agree*100}}% agree</h4>
                      </div>
                    </div>
                    <div class="commentBlock disagreeBlock .transition2" v-bind:style="{width: 50+m.disagree*50 + '%'}">
                      <div class="commentHeader">
                        <h4 class="u-lighter">{{m.disagree*100}}% disagree</h4>
                      </div>
                    </div>
                    <div class="commentBlock purpleBackground .transition2" v-bind:style="{width: 50+m.unsure*50 + '%'}">
                      <div class="commentHeader">
                        <h4 class="u-lighter">{{m.unsure*100}}% unsure</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" name="button" class="keyButtons u-lighter u-fontSize20 u-floatRight" v-on:click="fetchNextClaim(mapcomp), colorBubbles(mapcomp)">Next -></button>
              </div>

              <div v-bind:style="{display: mapcomp.displayIndividual}">
                <div v-for="m in mapcomp.arrayClaim">
                  <div v-bind:class="m.agreeable" class="commentBlock">
                    <div class="commentHeader">
                      <div v-if="m.agreeable == 'agreeBlock'" class="u-lighter">
                        {{m.percent*100}}% in AGREEMENT
                      </div>
                      <div v-else class="u-lighter">
                        {{m.percent*100}}% in DISAGREEMENT
                      </div>
                    </div>
                    <div class="commentSection">
                      <h5 class="u-lighter">{{m.text}}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </span>
          </div>

        </div>
      </div>
    </div>
    <div id="root">
      <div class="container content textcomp.article">
        <div class="section-content u-maxWidth1000">
          <div class="row white">
            <div class="col-sm-offset-2 col-sm-8">
              <p>{{textcomp.lastReferenced}}</p>
              <p>{{textcomp.whyResponse}}</p>
              <p>{{textcomp.whyResponses}}</p>
              <text-comp :textcomp="textcomp"></text-comp>
              <comments-comp :commentscomp="commentscomp"></comments-comp>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--START MODAL-->
    <div class="modal fade talkModal" id="talkModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-content talkDialogue">
        <div class="close">&times;</div><br>
        <div class="content-section">
          <h4 class="quoteSection">
            <div v-for="(m, mindex) in textcomp.article.sentences">

              <div v-if="mindex == textcomp.lastReferenced">
                {{m.text}}
              </div>
            </div>
            <!--{{textcomp.article.sentences[textcomp.lastReferenced]}} -->
          </h4>
          <h5>I <b>AGREE</b> because ... </h5>
          <textarea type="text" placeholder="" name="" value="" class="talkInput u-sizeFullWidth" v-model="textcomp.whyResponse.input" style="background-color: white;"></textarea>
          <p class="talkButton montserratLight u-floatRight" v-on:click="submitWhy(textcomp)">Share</p>
          <br> <br><br><br>

          <div v-for="m in mapcomp.bubbleData">
            <div v-if="m.group == 0">
              <div v-for="s in m.sentences">
                <div v-if="s.sentenceId == textcomp.lastReferenced">
                  <div class="commentBlock agreeBlock">
                    <div class="u-sizeFullWidth u-inlineBlock">
                      <h4 class="white-text commentHeader u-inlineBlock">{{s.agree*100}}% IN AGREEMENT</h4>
                      <div class="seeMoreButton u-floatRight u-inlineBlock" v-on:click="textcomp.showAgreeComments = !textcomp.showAgreeComments">
                        <div v-if="textcomp.showAgreeComments">
                          read less
                        </div>
                        <div v-else>
                          read more
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
                      <h4 class="white-text commentHeader u-inlineBlock">{{s.disagree*100}}% IN DISAGREEMENT</h4>
                      <div class="seeMoreButton u-floatRight u-inlineBlock" v-on:click="textcomp.showDisagreeComments = !textcomp.showDisagreeComments">
                        <div v-if="textcomp.showDisagreeComments">
                          read less
                        </div>
                        <div v-else>
                          read more
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
