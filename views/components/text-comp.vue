<template>
  <div>
    {{textcomp.tooldisplay}}

    commentDatA: {{textcomp.commentData}}

    <br><br><br>
    disagreeComment: {{textcomp.displayDisagreeComments}}
    <br><br><br>
    agreeComments: {{textcomp.displayAgreeComments}}
    <br><br><br>
    lastReferenced: {{textcomp.lastReferenced}}



    <h2 class="section-heading center-heading margin-top-0 montserratLight" name="main">{{textcomp.article.title.title}}</h2>
    <p class="center-heading">by {{textcomp.article.authors[0].name}} of {{textcomp.article.publication.name}} on {{textcomp.article.formattedDate}}</p>
    <div class="u-marginAuto">
      <span v-for="(m, mindex) in textcomp.article.sentences">
        <span class="load-text" v-bind:class="{'highlightable':m.mainClaim}">
          <span v-if="m.mainClaim">
            <span v-on:click="showTool(mindex, m.seen, textcomp)">
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
    <div id="tooltip" v-bind:style="{display: textcomp.tooldisplay, top: textcomp.tooltop, left: textcomp.toolleft}">

      <span v-if="textcomp.user == undefined">
        <span href="#sign-in-modal" data-toggle="modal">
          <i class="fa fa-smile-o u-iconem" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock"><span class="u-agreeButton">agree</span></span>
        </span>

        <span href="#sign-in-modal" data-toggle="modal">
          <i class="fa fa-frown-o u-iconem" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock"><span class="u-agreeButton">disagree</span></span>
        </span>

        <span href="#sign-in-modal" data-toggle="modal">
          <i class="fa fa-meh-o u-iconem" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-lastAgreeButton"><span class="u-agreeButton">unsure</span></span>
        </span>
      </span>


      <span v-else>
        <span v-on:click="submitResponse(1, 2, textcomp)">
          <i class="fa fa-smile-o u-iconem" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock">
            <span class="u-agreeButton">agree</span>
          </span>
        </span>
        <span v-on:click="submitResponse(-1, 3, textcomp)" class="u-button">
          <i class="fa fa-frown-o u-iconem" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock">
            <span class="u-agreeButton">disagree</span>
          </span>
        </span>
        <span v-on:click="submitResponse(0, 4, textcomp)" class="u-button">
          <i class="fa fa-meh-o u-iconem" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-lastAgreeButton">
            <span class="u-agreeButton">unsure</span>
          </span>
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
