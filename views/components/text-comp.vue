<template>
  <div>
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
    <div id="tooltip" v-bind:style="{display: textcomp.tooldisplay, top: textcomp.tooltop, left: textcomp.toolleft}">
      <span v-on:click="submitResponse(1, 2, textcomp)" class="u-button">agree</span>
      <span v-on:click="submitResponse(-1, 3, textcomp)" class="u-button">disagree</span>
      <span v-on:click="submitResponse(0, 4, textcomp)" class="u-button">unsure</span>
      <div class="highlightMenu-arrowClip">
        <span class="highlightMenu-arrow"></span>
      </div>
    </div> <!--end tooltip -->

    <div id="tooltip" v-bind:style="{display: textcomp.talkdisplay, top: textcomp.tooltop, left: textcomp.toolleft}">
      <span href="#talkModal" data-toggle="modal" class="u-button u-border">contribute</span>
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
  props: ['textcomp']
}
</script>

<style lang="css">

</style>
