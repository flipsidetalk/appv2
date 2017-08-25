<template>
<div>
  <!-- BEGIN # MODAL LOGIN -->
  <div class="modal fade" id="sign-in-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" align="center">
          <img src="img/logo-no-text.png" alt="Logo" style="height:60px;" class="u-paddingTop10">
          <h2>Flipside</h2>
          <h3 class="weight-lighter">Sign up to interact with and learn about different perspectives</h3>
        </div>
        <!-- Begin # Login Form -->
        <form id="facebook-form">
          <div class="modal-body">
            <div class="overlay-content">
              <a href="/auth/facebook" style="white-space: normal;" class="btn btn-primary facebookSign u-sizeFullWidth u-lighter u-fontSize20 u-maxHeight350"><span class="fa fa-facebook"></span> Sign in through Facebook
                  <p class="u-lighter u-fontSize12">We won't post anything without asking</p>
                </a>
              <div class="u-marginAuto u-inline-block u-paddingTop10 center">
                <a href="#email-signup-modal" id="switch-to-email" class="u-lighter u-fontSize14">or sign in with email</a>
              </div>
            </div>
          </div>
        </form>
        <!-- End # Login Form -->
      </div>
    </div>
  </div>
  <!-- END # MODAL LOGIN -->


  <div class="modal fade" id="email-signup-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" align="center">
          <img src="img/logo-no-text.png" alt="Logo" style="height:60px;" class="u-paddingTop10">
          <h2>Flipside</h2>
          <h3 class="weight-lighter">Sign up to interact and learn about different perspectives</h3>
          <h3 class="weight-lighter">or <a id="switch-email-login" class="underline">sign in if you already have an account</a>.</h3>
        </div>
        <!-- Begin # Login Form -->
        <form id="signup-form">
          <div class="modal-body">
            <div class="overlay-content">
              <div class="u-inlineBlock">
                <div class="u-floatLeft u-width50 u-inlineBlock u-paddingRight12">
                  <div class="input-group">
                    <input type="text" name="firstName" placeholder="First name" class="input-email" id="signup-fn" value="">
                  </div>
                </div>
                <div class="u-floatLeft u-width50 u-inlineBlock">
                  <div class="input-group">
                    <input type="text" name="lastName" placeholder="Last name" class="input-email" id="signup-ln" value="">
                  </div>
                </div>
              </div>
              <div class="input-group">
                <input type="email" name="email" placeholder="yourname@example.com" class="input-email u-sizeFullWidth" id="signup-email" value="">
              </div>
              <div class="input-group">
                <input type="password" name="password" placeholder="Password" class="input-email u-sizeFullWidth" id="signup-password" value="">
              </div>
              <p id="blank-fields" class="form-error">
                Please do not leave any fields blank.
              </p>
              <p id="valid-email-signup" class="form-error">
                Please enter a valid email.
              </p>
              <p id="email-already-signedup" class="form-error">
                You already have an account. Please sign in.
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <div>
              <button type="submit" class="btn btn-primary btn-lg btn-block" id="signup-btn">Sign Up</button>
            </div>
          </div>
        </form>
        <!-- End # Login Form -->
      </div>
    </div>
  </div>
  <!-- END # MODAL LOGIN -->

  <div class="modal fade" id="email-login-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" align="center">
          <img src="img/logo-no-text.png" alt="Logo" style="height:60px;" class="u-paddingTop10">
          <h2>Flipside</h2>
          <h3 class="weight-lighter">Sign in to interact and learn about different perspectives</h3>
        </div>
        <!-- Begin # Login Form -->
        <form id="signin-form">
          <div class="modal-body">
            <div class="overlay-content">
              <div class="input-group">
                <input type="email" name="email" placeholder="yourname@example.com" class="input-email u-sizeFullWidth" id=signin-email>
              </div>
              <div class="input-group">
                <input type="password" name="password" placeholder="Password" class="input-email u-sizeFullWidth" id=signin-password>
              </div>
              <p id="incorrect-password" class="form-error">
                Incorrect username or password.
              </p>
              <p id="valid-email-signin" class="form-error">
                Please enter a valid email.
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <div>
              <button type="submit" class="btn btn-primary btn-lg btn-block" id=signin-btn>Sign In</button>
            </div>
            <div>
              <button id="login_lost_btn" type="button" class="btn btn-link u-floatRight">Forgot Password?</button>
            </div>
          </div>
        </form>


        <!-- End # Login Form -->
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
  props: ['signincomp']
}
</script>

<style lang="css">

</style>
