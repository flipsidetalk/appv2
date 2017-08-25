<template>
<div class="metabar u-boxShadow u-fixed u-backgroundTransparent">
  <div class="metabar-inner u-marginAuto u-maxWidth1200 u-paddingLeft20 u-paddingRight20">
    <div class="metabar-top u-height65">
      <div class="u-floatLeft">
        <a class="nav-brand" href="http://www.flipsidetalk.com">
          <img class="nav-brand-logo" src="img/logo.png" alt="Logo">
        </a>
        <div class="u-alignMiddle u-inlineBlock">
          <span class="u-inlineBlock u-height25 u-verticalAlignMiddle u-marginRight20 u-borderRightLighter"></span>
        </div>
        <div class="u-alignMiddle u-inlineBlock u-verticalAlignMiddle">
          <h3 class="topic u-marginTop0">Flipside</h3>
        </div>
      </div>
      <div class="u-floatRight">
        <div class="u-alignMiddle u-inlineBlock u-verticalAlignTop u-height65">
          <div class="u-alignBlock">
            <div class="buttonset">
              <div v-if="headercomp.user !== undefined">
                <span>Welcome, {{headercomp.user.name}} &bull;</span> <a class="logout-link" href="/logout">Logout</a>
              </div>
              <div v-else>
                <a class="button" href="#sign-in-modal" data-toggle="modal">Sign in / Sign up</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="metabar-inner u-marginAuto u-maxWidth1200">
  </div>
</div>
</template>

<script>
export default {
  props: ['headercomp']
}
</script>

<style lang="css">

</style>
