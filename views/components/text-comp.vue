<template>
  <div>
    <div class="u-marginAuto">
      <span v-for="(m, mindex) in textcomp.article.sentences">
        <span class="load-text" v-bind:class="{'highlightable':m.mainClaim}">
          <span v-if="m.mainClaim">
            <span v-on:click="showTool(mindex, m.seen, textcomp)" v-on:mouseover="showHelper(mindex, textcomp)">
              <mark class="highlightedText" v-bind:id="mindex">{{m.text}}</mark>
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

  <div id="tooltip" v-bind:style="{display: textcomp.helpdisplay, top: textcomp.helptop, left: textcomp.helpleft}">
    <span class="helpTool">We think this is an important line. Click to vote!</span>
    <div class="highlightMenu-arrowClip">
      <span class="highlightMenu-arrow"></span>
    </div>
  </div>


    <div id="tooltip" v-bind:style="{display: textcomp.tooldisplay, top: textcomp.tooltop, left: textcomp.toolleft}">

      <span v-if="textcomp.user == undefined">
        <span href="#sign-in-modal" data-toggle="modal" class="u-button u-pointer">
          <i class="fa fa-smile-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer"><span class="u-agreeButton u-pointer">agree</span></span>
        </span>

        <span href="#sign-in-modal" data-toggle="modal" class="u-button u-pointer">
          <i class="fa fa-frown-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer"><span class="u-agreeButton u-pointer">disagree</span></span>
        </span>

        <span href="#sign-in-modal" data-toggle="modal" class="u-button u-pointer">
          <i class="fa fa-meh-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer"><span class="u-agreeButton u-pointer">unsure</span></span>
        </span>
        <span>
          <i class="fa fa-flag-o u-iconem u-pointer" aria-hidden="true"></i>
        </span>
      </span>

      <span v-else>
        <span v-on:click="submitResponse(1, 2, textcomp)" class="u-button u-pointer">
          <i class="fa fa-smile-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer">
            <span class="u-agreeButton">agree</span>
          </span>
        </span>
        <span v-on:click="submitResponse(-1, 3, textcomp)" class="u-button u-pointer">
          <i class="fa fa-frown-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer">
            <span class="u-agreeButton">disagree</span>
          </span>
        </span>
        <span v-on:click="submitResponse(0, 4, textcomp)" class="u-button u-pointer">
          <i class="fa fa-meh-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer">
            <span class="u-agreeButton">unsure</span>
          </span>
        </span>
        <span>
          <i class="fa fa-flag-o u-iconem u-pointer" aria-hidden="true"></i>
        </span>


      </span>
      <div class="highlightMenu-arrowClip">
        <span class="highlightMenu-arrow"></span>
      </div>
    </div> <!--end tooltip -->

    <div id="tooltip" v-bind:style="{display: textcomp.talkdisplay, top: textcomp.tooltop, left: textcomp.toolleft}">
      <span href="#talkModal" data-toggle="modal" class="u-button u-border" v-on:click="fetchComments(textcomp), textcomp.showUserResponse ='none'">contribute</span>
      <span v-on:click="textcomp.talkdisplay = 'none', textcomp.tooldisplay = 'block'" class="u-fontSize11 u-button">change vote</span>
      <div class="highlightMenu-arrowClip">
        <span class="highlightMenu-arrow"></span>
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
  props: ['textcomp'] //list assigning variable names from article.vue, article.vue knows to pass it via server.js

}
</script>

<style lang="css">

</style>
