<template>
<div class="col-md-5">
  <div class="clusterMapOutput">
    <div class="d3stuff" v-on:click="render(mapcomp)">
      <div class="weight-lighter">Opinion Map</div>
      <p class="u-lighter">People who vote similarly are grouped. Click a group to see which viewpoints they share</p>
      <div class="bubbleMap"></div>
    </div>
  </div>

  <div class="">
    <span class="u-fontSize25">passages:</span>
    <span v-for="(m, mindex) in mapcomp.bubbleData[0].sentences">
      <a class="u-paddingLeft12 u-fontSize25" v-on:click="changeBubbles(m, mindex, mapcomp)">{{mindex}}</a>
    </span>
  </div>

</div>
</template>

<script>
import * as d3 from 'd3';
import mixin from '../assets/mixins/mapComp.js';
export default {
  mixins: [mixin],
  data: function() {
    return ['mapcomp']
  },
  props: ['mapcomp']
}
</script>

<style lang="css">

</style>
