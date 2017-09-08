<template>
  <div>
    <div class="modal talkModal" id="talkModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-content talkDialogue">
            <div class="close">&times;</div><br>
        <div class="content-section">
          <h3 class="quoteSection">this here is the quote and the main argument as well this is all there is to argue about</h3>
          <textarea type="text" placeholder="What do you think?" name="" value="" class="talkInput u-sizeFullWidth" v-model="textcomp.whyResponse.input" style="background-color: white;"></textarea>
          <p class="talkButton montserratLight u-floatRight" v-on:click="submitWhy(textcomp)">Share</p>
          <br> <br><br><br>

          <div class="commentBlock agreeBlock">
            <h3 class="white-text commentHeader">41% IN AGREEMENT</h3>
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
            <h3 class="white-text commentHeader">59% IN DISAGREEMENT</h3>
          </div>

        </div>
        </div>
    </div>

    <h2 class="section-heading center-heading margin-top-0 montserratLight" name="main">{{textcomp.article.title.title}}</h2>
    <p class="center-heading">by {{textcomp.article.authors[0].name}} of {{textcomp.article.publication.name}} on {{textcomp.article.formattedDate}}</p>
    <div class="u-marginAuto">
      <span v-for="(m, mindex) in textcomp.article.sentences">
        <span class="load-text" v-bind:class="{'highlightable':m.mainClaim}">
          <span v-if="m.mainClaim">
            <span v-on:click="showTool(mindex, m.seen, textcomp)">
              <mark v-bind:id="mindex">{{m.text}}</mark>
            </span>
          </span>
          <span v-else>
            <span class="regularText" v-bind:id="mindex" v-on:click="showTool(mindex, m.seen, textcomp)" v-bind:class="{regularTextActive: textcomp.isHighlighted==mindex}">
              {{m.text}}
            </span>
          </span>

          <span v-if="m.endParagraph">
            <br><br>
          </span>
        </span>
      </span>
      <!--END OF STORY CONTENT-->
    </div>
    <div id="cal1">&nbsp;</div>
    <div id="cal2">&nbsp;</div>
    <!--TO DO: V-BIND BACKGROUND COLOR OR CLASS DEPENDING ON M.SEEN-->
    <div id="tooltip" v-bind:style="{display: textcomp.tooldisplay, top: textcomp.tooltop, left: textcomp.toolleft, background: textcomp.toolcolor}">
      <span v-on:click="submitResponse(1, 2, textcomp)" v-on:mouseover="textcomp.toolcolor = 'rgba(69, 196, 173, 1)'" class="u-button">AGREE</span>
      <span v-on:click="submitResponse(-1, 3, textcomp)" v-on:mouseover="textcomp.toolcolor = 'rgba(235, 112, 107, 1)'" class="u-button">DISAGREE</span>
      <span v-on:click="submitResponse(0, 4, textcomp)" v-on:mouseover="textcomp.toolcolor = 'rgba(131, 101, 158, 1)'" class="u-button">NOT SURE</span>
      <div class="highlightMenu-arrowClip">
        <span class="highlightMenu-arrow" v-bind:style="{background: textcomp.toolcolor}"></span>
      </div>
    </div> <!--end tooltip -->

    <div id="tooltip" v-bind:style="{display: textcomp.talkdisplay, top: textcomp.tooltop, left: textcomp.toolleft, background: textcomp.toolcolor}">
      <span href="#talkModal" data-toggle="modal" class="u-button tealBackground">CONTRIBUTE</span>
      <span v-on:click="textcomp.talkdisplay = 'none', textcomp.tooldisplay = 'block'" class="u-fontSize11 u-button u-purpleBackground">CHANGE VOTE</span>
      <div class="highlightMenu-arrowClip">
        <span class="highlightMenu-arrow" v-bind:style="{background: textcomp.toolcolor}"></span>
      </div>
    </div>

  </div>
</template>

<script>
import mixin from '../assets/mixins/textComp.js';
export default {
  mixins: [mixin],
  data: function() {
    return {}
  },
  props: ['textcomp']
}
</script>

<style lang="css">

</style>
