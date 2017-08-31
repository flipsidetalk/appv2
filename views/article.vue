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
            <div class="col-sm-7">
              <p>{{textcomp.lastReferenced}}</p>

              <p>{{textcomp.whyResponse}}</p>
              <p>{{textcomp.whyResponses}}</p>
              <text-comp :textcomp="textcomp"></text-comp>
              <comments-comp :commentscomp="commentscomp"></comments-comp>
            </div>
            <div class="col-sm-5">
              <div id="talkbox" v-bind:style="{display: textcomp.talkdisplay, top: textcomp.tooltop}">
                <div class="mdc-card" style="background-color: #efefef;">
                  <section class="mdc-card__primary">
                    <div class="talkSection quoteSection">
                      <h4 class=" mdc-card__title mdc-card__title--large georgia lineheight123 u-paddingBottom10" style="font-size: 16px;">
                        "{{textcomp.article2.text.main2[textcomp.lastReferenced].text}}"
                      </h4>
                    </div>
                    <div class="talkSection">
                      <div class="u-paddingBottom5">
                        I disagree because:
                      </div>
                    <!--  <div v-if="textcomp.user !== undefined"> -->
                        <textarea type="text" name="" value="" class="talkInput u-sizeFullWidth" v-model="textcomp.whyResponse.input"></textarea>
                        <a class="talkButton montserratLight u-floatRight" v-on:click="submitWhy(textcomp)">Share</a>
                    <!--  </div> -->
                    <!--  <div v-else>
                        <p class="montserratLight"><a href="#sign-in-modal" data-toggle="modal">Sign In</a> to share your thoughts about this idea.</p>
                      </div> -->
                    </div>
                    <div class="talkSection readSection">
                      <div class="u-paddingTop10 u-paddingBottom10">
                        read what others think:
                      </div>
                      <span class="flexWrap">
                        <span class="u-margin2">
                          <a class="talkButton montserratLight">all</a>
                        </span>
                        <span class="u-margin2">
                          <a class="talkButton montserratLight">agree</a>
                        </span>
                        <span class="u-margin2">
                          <a class="talkButton montserratLight">disagree</a>
                        </span>
                        <span class="u-margin2">
                          <a class="talkButton montserratLight">not sure</a>
                        </span>
                        <span class="u-margin2">
                          <a class="talkButton montserratLight">MAP</a>
                        </span>
                      </span>
                    </div>

                  </section>
                </div>
              </div>

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
