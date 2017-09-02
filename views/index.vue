<template>
  <div>
    <header-comp :headercomp="headercomp"></header-comp>
    <signin-comp></signin-comp>
    <input-link-comp></input-link-comp>
    <thumbnail-comp :thumbnailcomp="thumbnailcomp"></thumbnail-comp>

  </div>
</template>



<script>
import headerComp from './components/header-comp.vue';
import signinComp from './components/signin-comp.vue';
import inputLinkComp from './components/input-link-comp.vue';
import thumbnailComp from './components/thumbnail-comp.vue';

export default {
  data: function() {
    return {}
  },
  components: {
    headerComp: headerComp,
    signinComp: signinComp,
    inputLinkComp: inputLinkComp,
    thumbnailComp: thumbnailComp
  }
}
</script>

<style lang="css">
</style>
