<template>
  <div>
    <header-comp :headercomp="headercomp"></header-comp>
    <signin-comp></signin-comp>
    <div class="container content article-top">
      <div class="section-content u-maxWidth1200 u-paddingRight20 u-paddingLeft20">
        <div class="row">
          <map-comp :mapcomp="mapcomp"></map-comp>

          <!--this is keycomp -->
          <div class="col-md-6">
            <span class="">
              {{mapcomp.claimIds}}
              <h4 class="">the ideas within our bubbles:</h4>
              <span type="button" class="keyButtons u-lighter purpleBackground" name="keybutton">all of us</span>
              <span v-for="m in mapcomp.bubbleData">
                <span v-if="m.group != -1">
                  <span type="button" class="keyButtons u-lighter u-fontSize20 purpleBackground" name="keybutton" v-bind:id="m.group" v-on:click="fetchClaims(m.group, textcomp, mapcomp)">{{m.group}}</span>
                </span>
              </span>
              <h4></h4>
            </span>
          </div>

        </div>
      </div>
    </div>
    <div id="root">
      <div class="container content textcomp.article">
        <div class="section-content u-maxWidth1200">
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
            {{textcomp.article.sentences[textcomp.lastReferenced]}}
          </h4>
          <h5>I <b>AGREE</b> because ... </h5>
          <textarea type="text" placeholder="" name="" value="" class="talkInput u-sizeFullWidth" v-model="textcomp.whyResponse.input" style="background-color: white;"></textarea>
          <p class="talkButton montserratLight u-floatRight" v-on:click="submitWhy(textcomp)">Share</p>
          <br> <br><br><br>

          <div v-for="m in mapcomp.bubbleData">
            <div v-if="m.group == -1">
              <div v-for="s in m.sentences">
                <div v-if="s.sentenceId == textcomp.lastReferenced">
                  <div class="commentBlock agreeBlock">
                    <h3 class="white-text commentHeader">{{s.agree*100}}% IN AGREEMENT</h3>
                    <div class="commentSection">
                      <div class="commentName">
                        <b class="commentText">john</b>
                      </div>
                      <div class="commentContent">
                        <p class="commentText">There is just…something about a mother tongue. I am not fluent in the obscure European language my mother spoke to me as a baby, but when I hear it to this day I “feel” like my senses become engaged in ways that no other language can do. Bright primal smells and colors come to mind and then linger. I can’t help but think that this is what they were trying to evoke my resurrecting the Hebrew tongue.</p>
                      </div>
                    </div>
                    <div class="rowReverse">
                      <div class="seeMoreButton">
                        see more comments
                      </div>
                    </div>
                  </div>
                  <div class="commentBlock disagreeBlock">
                    <h3 class="white-text commentHeader">{{s.disagree*100}}% IN DISAGREEMENT</h3>
                    <div class="commentSection">
                      <div class="commentName">
                        <b class="commentText">bobby</b>
                      </div>
                      <div class="commentContent">
                        <p class="commentText">There is just…something about a mother tongue. I am not fluent in the obscure European language my mother spoke to me as a baby, but when I hear it to this day I “feel” like my senses become engaged in ways that no other language can do. Bright primal smells and colors come to mind and then linger. I can’t help but think that this is what they were trying to evoke my resurrecting the Hebrew tongue.</p>
                      </div>
                    </div>
                    <div class="rowReverse">
                      <div class="seeMoreButton">
                        see more comments
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
import headerComp from './components/header-comp.vue';
import signinComp from './components/signin-comp.vue';
import introComp from './components/intro-comp.vue';
import mapComp from './components/map-comp.vue';
import cardsComp from './components/cards-comp.vue';
import textComp from './components/text-comp.vue';
import commentsComp from './components/comments-comp.vue';
import mixin from '../assets/mixins/article.js';

export default {
  mixins: [mixin],
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
