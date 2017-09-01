<template>
<div>
  <header-comp :headercomp="headercomp"></header-comp>
  <signin-comp></signin-comp>
</div>

</template>



<script>
import headerComp from './components/header-comp.vue';
import signinComp from './components/signin-comp.vue';



export default {
  data: function() {
    return {}
  },
  components: {
    headerComp: headerComp,
    signinComp: signinComp
  }
}
</script>

<style lang="css">

</style>
