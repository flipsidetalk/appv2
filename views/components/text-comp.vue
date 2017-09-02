<template>
  <div>
    <h2 class="section-heading center-heading margin-top-0 montserratLight" name="main">{{textcomp.article.title.title}}</h2>
    <p class="center-heading">by {{textcomp.article.authors[0].name}} of {{textcomp.article.publication.name}} on {{textcomp.article.formattedDate}}</p>
    <div class="u-marginAuto">
      <span v-for="(m, mindex) in textcomp.article.sentences">
        <span v-for="(value, key) in m">
          <span class="load-text" v-bind:class="{'highlightable':value.mainClaim}">
            <span v-if="value.mainClain">
              <span v-on:click="showTool(key, value.seen, textcomp)">
                <mark v-bind:id="key">{{value.text}}</mark>
              </span>
            </span>
            <span v-else>
              <span class="regularText" v-bind:id="key" v-on:click="showTool(key, value.seen, textcomp)" v-bind:class="{regularTextActive: textcomp.isHighlighted==key}">
                {{value.text}}
              </span>
            </span>
          </span>

          <span v-if="value.endParagraph">
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
      <div v-if="!textcomp.tempseen">
        <span v-on:click="submitResponse(1, 2, textcomp)" class=" u-button u-greenBackgroundButton">AGREE</span>
        <span v-on:click="submitResponse(-1, 3, textcomp)" class=" u-button u-redBackgroundButton">DISAGREE </span>
        <span v-on:click="submitResponse(0, 4, textcomp)" class=" u-button">NOT SURE</span>
      </div>
      <div v-else>
        <span v-on:click="textcomp.tooldisplay ='none', textcomp.talkdisplay = 'block'" class="u-button tealBackground">CONTRIBUTE</span>
        <span v-on:click="textcomp.tempseen=false" class="u-fontSize11 u-button u-purpleBackground">CHANGE VOTE</span>
      </div>
      <div class="highlightMenu-arrowClip">
        <span class="highlightMenu-arrow"></span>
      </div>
    </div> <!--end tooltip -->
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
