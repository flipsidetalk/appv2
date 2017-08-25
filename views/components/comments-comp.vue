<template>
<div class="commentSection u-paddingLeft90 u-paddingRight90 u-marginAuto u-paddingBottom100">
  <div v-if="!commentscomp.showComment">
    <button class="mdc-button mdc-button--raised tealBackground" v-on:click="commentscomp.showComment = 1">
        <h5 class="u-pointer white-text montserratLight">Show Responses</h5>
      </button>
  </div>
  <div v-if="commentscomp.showComment">
    <button class="mdc-button mdc-button--raised tealBackground" v-on:click="commentscomp.showComment = 0">
        <h5 class="u-pointer white-text montserratLight">Hide Responses</h5>
      </button>
  </div>
  <br>
  <div v-if="commentscomp.showComment">
    <div v-for="(m, mindex) in commentscomp.article.text.main">
      <div v-if="m.agreeable">
        <div class="mdc-card u-purpleBackground">
          <section class="mdc-card__primary">
            <h1 class="mdc-card__title mdc-card__title--large montserrat white-text lineheight123" style="font-size: 15px;">"{{m.text}}"</h1>
            <div v-for="c in commentscomp.commentData.comments">
              <div v-if="c.sentenceId == m.sentenceId">
                <h2 v-if="c.decision == 1" class="mdc-card__subtitle montserratLight white-text lineheight123 u-paddingBottom5" style="font-size: 12px; padding-top: 5px;">Agree &mdash; {{c.explanation}}</h2>
                <h2 v-else-if="c.decision == -1" class="mdc-card__subtitle montserratLight white-text lineheight123 u-paddingBottom5" style="font-size: 12px; padding-top: 5px;">Disagree &mdash; {{c.explanation}}</h2>
                <h2 v-else-if="c.decision == 0" class="mdc-card__subtitle montserratLight white-text lineheight123 u-paddingBottom5" style="font-size: 12px; padding-top: 5px;">Not Sure &mdash; {{c.explanation}}</h2>
              </div>
            </div>
          </section>
        </div>
        <br>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['commentscomp']
}
</script>

<style lang="css">

</style>
