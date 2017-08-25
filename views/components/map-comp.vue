<template>
<div class="col-md-5">
  <div class="clusterMapOutput">
    <div class="d3stuff" v-on:click="render(mapcomp)">
      <div class="weight-lighter">Opinion Map</div>
      <p class="u-lighter">People who vote similarly are grouped. Click a group to see which viewpoints they share</p>
      <svg class="clusterMap" viewBox="0 0 750 500" preserveAspectRatio="xMidYMid meet" origin="375 250" style="background-color: white;">
          <line x1="375" y1="20" x2="375" y2="480" stroke="rgba(85, 58, 111, 0.6)" />
          <line x1="20" y1="250" x2="730" y2="250" stroke="rgba(85, 58, 111, 0.6)" />
        </svg>
    </div>
    <div class="opinion-result">
      <div v-for="(group, mindex) in mapcomp.clusterData">
        <div v-if="mapcomp.clusterShowing == mindex">
          <h4>Group {{group[0].cluster}}'s opinions:</h4>
          <div v-for="(citem, cindex) in group">
            <div v-if="cindex < 3">
              <p class="montserratLight u-fontSize14">{{Math.abs(citem.average*100).toFixed(2)}}% of Group {{group[0].cluster}} {{citem.decision}} with the statement: <br>"{{citem.text}}"</p>
              <hr>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
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
