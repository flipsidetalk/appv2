<template>
  <div>
    <div class="col-md-6">
      <div class="clusterMapOutput">
        <div class="d3stuff">
          <div class="weight-lighter">Opinion Map</div>
          <p class="u-lighter">People who vote similarly are grouped. Click a group to see which viewpoints they share</p>
          <div class="">
            <svg class="bubbleMap">
              <defs>
                  <pattern id="group1" x="0%" y="0%" height="100%" width="100%"
                           viewBox="0 0 512 512">
                    <image x="0%" y="0%" width="512" height="512" xlink:href="https://cdn3.iconfinder.com/data/icons/people-professions/512/Baby-512.png"></image>
                  </pattern>
                  <pattern id="group2" x="0%" y="0%" height="100%" width="100%"
                           viewBox="0 0 512 512">
                    <image x="0%" y="0%" width="512" height="512" xlink:href="https://i.imgur.com/sQGz9wq.jpg"></image>
                  </pattern>
                  <pattern id="group3" x="0%" y="0%" height="100%" width="100%"
                           viewBox="0 0 512 512">
                    <image x="0%" y="0%" width="512" height="512" xlink:href="https://i.imgur.com/sQGz9wq.jpg"></image>
                  </pattern>
                  <pattern id="group4" x="0%" y="0%" height="100%" width="100%"
                           viewBox="0 0 512 512">
                    <image x="0%" y="0%" width="512" height="512" xlink:href="https://i.imgur.com/sQGz9wq.jpg"></image>
                  </pattern>
                  <pattern id="group5" x="0%" y="0%" height="100%" width="100%"
                           viewBox="0 0 512 512">
                    <image x="0%" y="0%" width="512" height="512" xlink:href="https://i.imgur.com/sQGz9wq.jpg"></image>
                  </pattern>
                </defs>


            </svg>



          </div>
        </div>
      </div>
      <!--  <div class="">
      <span class="u-fontSize25">passages:</span>
      <span v-for="(m, mindex) in mapcomp.bubbleData[0].sentences">
      <a :id="m.sentenceId" class="u-paddingLeft12 u-fontSize25" v-on:click="changeBubbles(m.sentenceId, mapcomp)">{{mindex}}</a>
    </span>
    <span>{{mapcomp.groupSimple}}</span>
  </div> -->

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
  props: ['mapcomp'],
}
</script>

<style lang="css">

</style>
