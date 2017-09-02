<template>
  <div>
    <header-comp :headercomp="headercomp"></header-comp>
    <signin-comp></signin-comp>

    <div class="row section section-first-text">
      <div class="col-md-offset-1 col-md-8 u-paddingTop50">
        <div class="u-maxWidth1000 u-marginAuto">
          <div class="bumpDown">
            <h1>Aiya !!</h1>
            <h2 class="u-lighter">We can't seem to find the page you're looking for.</h2>
            <h5>error code: 404</h5>
          </div>
          <div class="bumpDown">
          <a href=""><h3>get home</h3></a>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>

export default {
  data: function() {
    return {}
  },
  components: {
    headerComp: headerComp,
    signinComp: signinComp,
  }
}
</script>

<style lang="css">
</style>
