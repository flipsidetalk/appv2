<template>
  <div>







    <header-comp :headercomp="headercomp"></header-comp>
    <signin-comp></signin-comp>
    <input-link-comp></input-link-comp>

    <div class="row section">
      <div class="col-md-offset-1 col-md-10">
        <div class="u-borderBox u-maxWidth1000 u-marginAuto u-clearfix">
          <header class="u-borderBox u-marginBottom25 u-xs-flexWrap u-borderBottomLighter">
            <div class="u-flex1 u-flexTop u-justifyContentSpaceBetween">
              <span class="heading-title heading-title--lineHeightTight u-uiDisplayBold u-fontSize20 u-textColorDarker u-block u-paddingBottom20 u-xs-fontSize18 u-borderBottomNormal u-marginBottomNegative1">
                Recently Submitted
              </span>
              <!--  <a href="#" class="u-flexCenter">read more</a> -->
            </div>
          </header>

          <div v-for="(m, mindex) in thumbnailcomp">
            <div class="u-borderBox u-size6of12 u-paddingRight10 u-xs-paddingLeft0 u-xs-paddingRight0 u-xs-size12of12 u-floatLeft">
              <div class="u-flex u-sizeFullWidth u-height260 u-sm-flexWrap u-xs-heightAuto u-borderBox u-marginBottom20 u-backgroundColorWhite u-overflowHidden u-relative u-borderRadius2 u-borderBlackLightest">
                <div class="u-flex0 u-sizeFullHeight u-width200 u-sm-height100 u-sm-sizeFullWidth u-xs-height170 red">
                  okay here's a picture
                </div>
                <div class="u-padding20">
                  <div class="u-flex0 u-sizeFullWidth">
                    <h4>{{m.title}}</h4>
                  </div>
                  <div class="u-flex u-paddingTop10 u-flex0">
                    <div class="u-flex1 u-noWrapTextEllipsis u-xs-paddingTop5">
                      <div class="byLine u-paddingLeft0 u-noWrapWithEllipsis">
                        {{m.publication}}
                      </div>
                      <div class="subHeading u-noWrapWithEllipsis u-paddingTop2">
                        {{m.publicationDate}} &middot; {{m.author}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> <!--END Thumbnail -->
          </div>




        </div>
      </div>
    </div>
  </div>
</template>



<script>
import headerComp from './components/header-comp.vue';
import signinComp from './components/signin-comp.vue';
import inputLinkComp from './components/input-link-comp.vue'

export default {
  data: function() {
    return {}
  },
  components: {
    headerComp: headerComp,
    signinComp: signinComp,
    inputLinkComp: inputLinkComp
  }
}
</script>

<style lang="css">
/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: absolute; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: none; /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #52aefb;
  margin-right: 0px;
  top: 300px;
  max-width: 500px;
  float: right;
  padding: 20px;
  border: 0;
  width: 40%;
}
/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
.purpleBackground{
  /*background-color: rgba(184, 139, 208); */
  background-color: rgba(91, 59, 122, 0.80);
}

.submitForm{
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding-left: 70px;
}

input{
  background: none;
  border: 0;
}

input:focus{
  outline: none;
}

.mainInput{
  width: 100%;
  height: 44px;
  font-size: 20px;
  border-bottom: 2px solid;
}
.submitButton{
  position: absolute;
  left: 0;
  top: 15px;
  background: white;
  z-index: 500;
  font-size: 20px;
}

.bumpDown{
  padding-bottom: 50px;
}
</style>
