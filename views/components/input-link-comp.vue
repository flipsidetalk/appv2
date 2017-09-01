<template>
  <div class="row section section-first-text">
    <div class="col-md-offset-1 col-md-8">
      <div class="bumpDown">
        <h1>Flipside</h1>
        <h2 class="u-lighter">Share stories for better discourse</h2>
      </div>
      <form class="submitForm center-heading bumpDown" v-on:submit="checkValidLink($event)">
        <label for="" class="submitButton">URL:</label>
        <input class="mainInput" id="link-input" type="text" name="" value="" placeholder="https://www.nytimes.com/opinion" autocomplete="off">
        <p id="invalid-link-msg" class="form-error">
          Please check your link and try again.
        </p>
        <p id="error-msg" class="form-error">
          Sorry, there was an error. Please try again.
        </p>
        <p id="loading-msg" class="form-error">
          Loading
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import mixin from '../assets/mixins/inputLinkComp.js';
export default {
  mixins: [mixin],
  data: function() {
    return {}
  }
}
</script>

<style lang="css">

</style>
