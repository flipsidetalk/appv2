<template>
  <div>
    <h2 class="section-heading center-heading margin-top-0 montserratLight" name="main">{{textcomp.article.title}}</h2>
    <p class="center-heading">by {{textcomp.article.author}} of {{textcomp.article.publication}} on {{textcomp.article.date}}</p>
    <div class="u-paddingLeft90 u-paddingRight90 u-marginAuto">
      <span v-for="(m, mindex) in textcomp.article.text.main">
        <span class="load-text" v-bind:class="{'highlightable':m.agreeable}">
          <span v-if="m.agreeable && !m.seen">
            <span v-on:mouseover="popMenu(m, textcomp)">
              <div v-if="!textcomp.bottomBar">
                <transition name="slide-fade">
                  <div v-if="textcomp.form && m.sentenceId==textcomp.lastReferenced" class="u-agreeForm">
                    <div v-on:click="submitResponse(m, 1, 2, textcomp)" class=" u-button u-greenBackgroundButton">AGREE</div>
                    <div v-on:click="submitResponse(m, -1, 3, textcomp)" class=" u-button u-redBackgroundButton">DISAGREE </div>
                    <div v-on:click="submitResponse(m, 0, 4, textcomp)" class=" u-button">NOT SURE</div>
                  </div>
                </transition>
              </div>
              <mark>{{m.text}}</mark>
            </span>
          </span>
          <span v-else-if="m.seen">
            <span v-on:mouseover="popWhyMenu(m, textcomp)">
              <div v-if="!textcomp.bottomBar">
                <transition name="slide-fade">
                  <div v-if="textcomp.why && m.sentenceId==textcomp.lastReferenced" class="u-agreeForm">
                    <div v-on:click="popResponseForm(m, textcomp)" class=" u-button tealBackground">CONTRIBUTE</div>
                    <div v-on:click="m.seen=false, popMenu(m, textcomp)" class="u-fontSize11 u-button u-purpleBackground">CHANGE VOTE</div>
                  </div>
                </transition>
              </div>
              <mark>{{m.text}}</mark>
            </span>
          </span>
          <span v-else-if="m.seen == 2"> <!--VOTED AGREE-->
            <span v-on:mouseover.once="textcomp.popWhyMenu(m, textcomp)">
              <div v-if="!textcomp.bottomBar">
                <transition name="slide-fade">
                  <div v-if="textcomp.why && m.sentenceId==textcomp.lastReferenced" class="u-agreeForm">
                    <div v-on:click="popResponseForm(m, textcomp)" class=" u-button tealBackground">CONTRIBUTE</div>
                    <div v-on:click="m.seen=false, popMenu(m, textcomp)" class="u-fontSize11 u-button u-purpleBackground">CHANGE VOTE</div>
                  </div>
                </transition>
              </div>
              <mark class="u-greenBackground" v-bind:id="m.sentenceId">{{m.text}}</mark>
            </span>
          </span>
          <span v-else-if="m.seen == 3">
            <span v-on:mouseover="popWhyMenu(m, textcomp)">
              <div v-if="!textcomp.bottomBar">
                <transition name="slide-fade">
                  <div v-if="textcomp.why && m.sentenceId==textcomp.lastReferenced" class="u-agreeForm">
                    <div v-on:click="popResponseForm(m, textcomp)" class=" u-button tealBackground">CONTRIBUTE</div>
                    <div v-on:click="m.seen=false, popMenu(m, textcomp)" class="u-fontSize11 u-button u-purpleBackground">CHANGE VOTE</div>
                  </div>
                </transition>
              </div>
              <mark class="u-redBackground" v-bind:id="m.sentenceId">{{m.text}}</mark>
            </span>
          </span>
          <span v-else-if="m.seen == 4">
            <span v-on:mouseover="popWhyMenu(m, textcomp)">
              <div v-if="!textcomp.bottomBar">
                <transition name="slide-fade">
                  <div v-if="textcomp.why && m.sentenceId==textcomp.lastReferenced" class="u-agreeForm">
                    <div v-on:click="popResponseForm(m, textcomp)" class=" u-button tealBackground">CONTRIBUTE</div>
                    <div v-on:click="m.seen=false, popMenu(m, textcomp)" class="u-fontSize11 u-button u-purpleBackground">CHANGE VOTE</div>
                  </div>
                </transition>
              </div>
              <mark class="u-purpleBackground" v-bind:id="m.sentenceId">{{m.text}}</mark>
            </span>
          </span>
          <span v-else>
            <span class="regularText" v-bind:id="m.sentenceId" v-on:click="showTool(m.sentenceId, textcomp)" v-bind:class="{regularTextActive: textcomp.isHighlighted==m.sentenceId}">
              {{m.text}}
            </span>
          </span>

          <span v-if="m.agreeable">
            <div v-if="textcomp.responseForm && m.sentenceId == textcomp.lastReferencedResponseForm" class="u-paddingTop5 u-paddingBottom5">
              <div class="mdc-card">
                <section class="mdc-card__primary u-inline">
                  <div v-if="textcomp.user !== undefined">
                    <div class="mdc-textfield u-fontSize14 u-marginTop0" style="width:70%!important">
                      <input type="text" class="form-control mdc-textfield__input montserrat" placeholder="Share your thoughts" v-model="textcomp.whyResponse.input">
                    </div>
                    <div class="u-floatRight montserratLight u-fontSize11 u-pointer u-verticalAlignMiddle" v-on:click = "submitWhy(m, textcomp)">
                      SUBMIT
                    </div>
                  </div>
                  <div v-else>
                    <div class="u-inlineBlock"v-if="textcomp.why">
                      <p class="montserratLight"><a href="#sign-in-modal" data-toggle="modal">Sign In</a> to share your thoughts about this idea.</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
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
    <div id="tooltip" v-bind:style="{display: textcomp.tooldisplay, top: textcomp.tooltop, left: textcomp.toolleft,}">agree disagree not sure
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
