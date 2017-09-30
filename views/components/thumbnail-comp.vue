<template>
  <div>

    <div class="row section">
      <div class="col-md-offset-1 col-md-10">
        <div class="u-borderBox u-maxWidth1200 u-marginAuto u-clearfix">
          <header class="u-borderBox u-marginBottom25 u-xs-flexWrap u-borderBottomLighter">
            <div class="u-flex1 u-flexTop u-justifyContentSpaceBetween">
              <span class="heading-title heading-title--lineHeightTight u-uiDisplayBold u-fontSize20 u-textColorDarker u-block u-paddingBottom20 u-xs-fontSize18 u-borderBottomNormal u-marginBottomNegative1">
                Submitted Stories
              </span>
            </div>
          </header>
          <div v-for="(m, mindex) in thumbnailcomp">
            <div class="u-borderBox u-size6of12 u-paddingRight20 u-xs-paddingLeft0 u-xs-paddingRight0 u-xs-size12of12 u-floatLeft">
              <a v-bind:href="'/article/' + m.slug" class="u-flex u-sizeFullWidth u-height260 u-sm-flexWrap u-xs-heightAuto u-borderBox u-marginBottom20 u-backgroundColorWhite u-overflowHidden u-relative u-borderRadius2 u-borderBlackLightest">
                <div class="u-flex0 u-sizeFullHeight u-width200 u-sm-height100 u-sm-sizeFullWidth u-xs-height170">
                  <a v-bind:href="'/article/' + m.slug" v-bind:style="'background-image: url(' + m.image+ ')'" class="thumbImage"></a>
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
              </a>
            </div> <!--END Thumbnail -->
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
  props: ['thumbnailcomp']
}
</script>

<style lang="css">

</style>
