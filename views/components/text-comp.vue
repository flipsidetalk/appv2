<template>
  <div>
    <div class="u-marginAuto">
      <span v-for="(m, mindex) in textcomp.article.sentences">
        <span class="load-text" v-bind:class="{'highlightable':m.mainClaim}">



          <span v-if="m.mainClaim">
            <span>
              <a :id="mindex" :name="m.id+2" class="anchor"></a>
              <mark class="highlightedText">{{m.text}}</mark>
            </span>
            <br>

            <span class="u-sizeFullWidth u-inlineBlock">
              <span class="u-floatRight u-paddingTop10">
                <span v-if="textcomp.voteCounter < 3">
                  <span v-on:click="showTool(mindex, m.seen, textcomp), submitResponse(1, 2, textcomp), fetchComments(textcomp), textcomp.showUserResponse ='none'" class="talkButtonInverse greenButtonInverse u-marginLeft10">
                    <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock newGreen">Agree</span>
                  </span>
                  <span v-on:click="showTool(mindex, m.seen, textcomp), submitResponse(-1, 3, textcomp), fetchComments(textcomp), textcomp.showUserResponse ='none'" class="talkButtonInverse redButtonInverse u-marginLeft10">
                    <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock newRed">Disagree</span>
                  </span>
                  <span v-on:click="showTool(mindex, m.seen, textcomp), submitResponse(0, 4, textcomp), fetchComments(textcomp), textcomp.showUserResponse ='none'" class="talkButtonInverse grayButtonInverse u-marginLeft10">
                    <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock u-lastAgreeButton newGray">Unsure</span>
                  </span>
                </span>
                <span v-else>
                  <span v-if="textcomp.user == undefined">
                    <span href="#sign-in-modal" data-toggle="modal" class="talkButtonInverse greenButtonInverse u-marginLeft10">
                      <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock newGreen">Agree</span>
                    </span>
                    <span href="#sign-in-modal" data-toggle="modal" class="talkButtonInverse redButtonInverse u-marginLeft10">
                      <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock newRed">Disagree</span>
                    </span>
                    <span href="#sign-in-modal" data-toggle="modal" class="talkButtonInverse grayButtonInverse u-marginLeft10">
                      <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock u-lastAgreeButton newGray">Unsure</span>
                    </span>
                  </span>
                  <span v-else>
                    <span v-on:click="showTool(mindex, m.seen, textcomp), submitResponse(1, 2, textcomp), fetchComments(textcomp), textcomp.showUserResponse ='none'" class="talkButtonInverse greenButtonInverse u-marginLeft10">
                      <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock newGreen">Agree</span>
                    </span>
                    <span v-on:click="showTool(mindex, m.seen, textcomp), submitResponse(-1, 3, textcomp), fetchComments(textcomp), textcomp.showUserResponse ='none'" class="talkButtonInverse redButtonInverse u-marginLeft10">
                      <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock newRed">Disagree</span>
                    </span>
                    <span v-on:click="showTool(mindex, m.seen, textcomp), submitResponse(0, 4, textcomp), fetchComments(textcomp), textcomp.showUserResponse ='none'" class="talkButtonInverse grayButtonInverse u-marginLeft10">
                      <span class="u-cardButtonText u-verticalAlignTop u-inlineBlock u-lastAgreeButton newGray">Unsure</span>
                    </span>
                  </span>
                </span>
              </span>
            </span>


            <transition name="slide-fade">
              <div v-if="textcomp.lastReferenced == mindex" class="u-paddingLeft20 u-paddingRight20 montserratLight">
                <div>
                  <h4 class="u-lighter"> I
                    <span v-if="textcomp.lastVoteValue == 0">
                      am unsure because...
                    </span>
                    <span v-if="textcomp.lastVoteValue == 1">
                      agree because ...
                    </span>
                    <span v-if="textcomp.lastVoteValue == -1">
                      disagree because...
                    </span>
                  </h4>
                </div>

                <textarea type="text" placeholder="write a reason to help others understand your stance" name="" value="" class="talkInput u-sizeFullWidth" v-model="textcomp.whyResponse.input" style="background-color: white;"></textarea>
                <div class="u-sizeFullWidth u-inlineBlock">
                  <p class="talkButton montserratLight u-floatRight" v-on:click="submitWhy(textcomp), textcomp.showUserResponse = 'block'">Share</p>
                </div>
                <div v-for="(sentenceObj, sindex) in textcomp.arrayEveryone">
                  <div v-if="sentenceObj.sentenceId == mindex">
                    <div v-if="(sentenceObj.agree*100).toFixed(0) != 0 && (sentenceObj.disagree*100).toFixed(0) != 0 " class="u-inlineBlock u-sizeFullWidth">
                      <div class="col-xs-6 u-paddingRight0 grayBorderRB">
                        <h4 class="agreeTeal  u-paddingRight10 u-marginTop0 u-paddingBottom10">{{(sentenceObj.agree*100).toFixed(0)}}% agree</h4>
                        <div v-for="(commentObj, mindex) in textcomp.displayAgreeComments">
                          <div class="u-paddingRight10 grayBorderTop">
                            <p class="commentText u-paddingTop10 u-marginTop10 u-paddingBottom10 BorderRadius7">{{commentObj.text}}</p>
                          </div>
                        </div>
                      </div>
                      <div class="col-xs-6 u-paddingLeft0 grayBorderLB">
                        <h4 class="disagreeRed u-paddingLeft10 u-marginTop0 u-paddingBottom10">{{(sentenceObj.disagree*100).toFixed(0)}}% disagree</h4>
                        <div v-for="commentObj in textcomp.displayDisagreeComments">
                          <div class="u-paddingLeft10 grayBorderTop">
                            <p class="commentText u-paddingTop10 u-marginTop10 u-paddingBottom10 BorderRadius7">{{commentObj.text}}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
            <br><br>
          </span>



          <span v-else>
            <span v-bind:id="mindex">
              <a :id="mindex" :name="m.id+2" class="anchor"></a>

              {{m.text}}
            </span>
          </span>

          <span v-if="m.endParagraph">
            <br><br>
          </span>
        </span>
      </span>
      <!--END OF STORY CONTENT-->
    </div>
    <div id="cal1">&nbsp;</div>
    <div id="cal2">&nbsp;</div>
    <!--TO DO: V-BIND BACKGROUND COLOR OR CLASS DEPENDING ON M.SEEN-->

    <div id="tooltip" v-bind:style="{display: textcomp.helpdisplay, top: textcomp.helptop, left: textcomp.helpleft}">
      <span class="helpTool">We think this is an important line. Click to vote!</span>
      <div class="highlightMenu-arrowClip">
        <span class="highlightMenu-arrow"></span>
      </div>
    </div>


    <div id="tooltip" v-bind:style="{display: textcomp.tooldisplay, top: textcomp.tooltop, left: textcomp.toolleft}">

      <span v-if="textcomp.user == undefined">
        <span href="#sign-in-modal" data-toggle="modal" class="u-button u-pointer">
          <i class="fa fa-smile-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer"><span class="u-agreeButton u-pointer">agree</span></span>
        </span>
        <span href="#sign-in-modal" data-toggle="modal" class="u-button u-pointer">
          <i class="fa fa-frown-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer"><span class="u-agreeButton u-pointer">disagree</span></span>
        </span>
        <span href="#sign-in-modal" data-toggle="modal" class="u-button u-pointer">
          <i class="fa fa-meh-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer"><span class="u-agreeButton u-pointer">unsure</span></span>
        </span>
        <span>
          <i class="fa fa-flag-o u-iconem u-pointer" aria-hidden="true"></i>
        </span>
      </span>

      <span v-else>
        <span v-on:click="submitResponse(1, 2, textcomp), fetchComments(textcomp), textcomp.showUserResponse ='none'" class="u-button u-pointer">
          <i class="fa fa-smile-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer">
            <span class="u-agreeButton">agree</span>
          </span>
        </span>
        <span v-on:click="submitResponse(-1, 3, textcomp), fetchComments(textcomp), textcomp.showUserResponse ='none'" class="u-button u-pointer">
          <i class="fa fa-frown-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer">
            <span class="u-agreeButton">disagree</span>
          </span>
        </span>
        <span v-on:click="submitResponse(0, 4, textcomp), fetchComments(textcomp), textcomp.showUserResponse ='none'" class="u-button u-pointer">
          <i class="fa fa-meh-o u-iconem u-pointer" aria-hidden="true"></i>
          <span class="u-agreeButtons u-verticalAlignTop u-inlineBlock u-pointer">
            <span class="u-agreeButton">unsure</span>
          </span>
        </span>
        <span>
          <i class="fa fa-flag-o u-iconem u-pointer" aria-hidden="true"></i>
        </span>
      </span>
      <div class="highlightMenu-arrowClip">
        <span class="highlightMenu-arrow"></span>
      </div>
    </div> <!--end tooltip -->

    <div id="tooltip" v-bind:style="{display: textcomp.talkdisplay, top: textcomp.tooltop, left: textcomp.toolleft}">
      <span href="#talkModal" data-toggle="modal" class="u-button u-border" v-on:click="fetchComments(textcomp), textcomp.showUserResponse ='none'">contribute</span>
      <span v-on:click="textcomp.talkdisplay = 'none', textcomp.tooldisplay = 'block'" class="u-fontSize11 u-button">change vote</span>
      <div class="highlightMenu-arrowClip">
        <span class="highlightMenu-arrow"></span>
      </div>
    </div>

  </div>
</template>


<script src="jquery.localscroll.js" type="text/javascript"></script>
<script src="jquery.scrollTo.js" type="text/javascript"></script>
<script>

import mixin from '../assets/mixins/textComp.js';
export default {
  mixins: [mixin],
  data: function() {
    return {}
  },
  props: ['textcomp'] //list assigning variable names from article.vue, article.vue knows to pass it via server.js

}
</script>

<style lang="css">

</style>
