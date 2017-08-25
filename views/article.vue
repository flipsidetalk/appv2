<template>
<div>
  <header-comp :headercomp="headercomp"></header-comp>
  <signin-comp></signin-comp>
  <div class="container content article-top">
    <div class="section-content u-maxWidth1200 u-paddingRight20 u-paddingLeft20">
      <intro-comp></intro-comp>
      <div class="row">
        <map-comp :mapcomp="mapcomp"></map-comp>
        <cards-comp></cards-comp>
      </div>
    </div>
  </div>
  <div id="root">
    <div class="container content textcomp.article">
      <div class="section-content u-maxWidth1000">
        <div class="row white">
          <div class="col-sm-offset-1 col-sm-10">
            <text-comp :textcomp="textcomp"></text-comp>
            <comments-comp :commentscomp="commentscomp"></comments-comp>
          </div>
        </div>
      </div>
    </div>
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

export default {
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
