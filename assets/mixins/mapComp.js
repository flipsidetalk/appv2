var mixin = {
  methods: {},
  mounted: function() {
    if (this.mapcomp.xlength > this.mapcomp.ylength) {
      this.mapcomp.multiplier = 500 / this.mapcomp.xlength;
    } else {
      this.mapcomp.multiplier = 334 / this.mapcomp.ylength;
    }
    for (var value in this.mapcomp.pointData) {
      this.mapcomp.pointData[value].x *= this.mapcomp.multiplier;
      this.mapcomp.pointData[value].y *= this.mapcomp.multiplier;
    }
    for (var cluster in this.mapcomp.shadeData) {
      for (var s in this.mapcomp.shadeData[cluster].shading) {
        var obj = this.mapcomp.shadeData[cluster].shading[s]
        obj.x *= this.mapcomp.multiplier;
        obj.y *= this.mapcomp.multiplier;
      }
    }

    for (var group in this.mapcomp.clusterData) { //length is 4
      for (var item in this.mapcomp.clusterData[group]) {
        var object = this.mapcomp.clusterData[group][item]; // object of clusterData - 32 total objects
        if (object.average > 0) {
          object.decision = "agree";
        } else {
          object.decision = "disagree";
        }
        for (var key in this.mapcomp.contentData) {
          var mainGroup = this.mapcomp.contentData[key];
          for (key1 in this.mapcomp.mainGroup) {
            var mainobj = this.mapcomp.mainGroup[key1];
            if (mainobj.sentenceId == object.sentenceId) {
              object.text = mainobj.text;
            }
          }
        }
      }
    }

    var xMid = (this.mapcomp.extremeData.xMax + this.mapcomp.extremeData.xMin) / 2;
    var yMid = (this.mapcomp.extremeData.yMax + this.mapcomp.extremeData.yMin) / 2;
    //Cluster Map
    var pointPlot = [];
    for (var user in this.mapcomp.pointData) {
      pointPlot.push(this.mapcomp.pointData[user]);
    }

    var lineFunction = d3.line()
      .x(function(d) {
        return d.x + 375 - xMid;
      })
      .y(function(d) {
        return 250 - d.y - yMid;
      })
      .curve(d3.curveLinear);

    for (var i = 0; i < this.mapcomp.shadeData.length; i++) {
      d3.select('.clusterMap')
        .append("path")
        .attr("d", lineFunction(this.mapcomp.shadeData[i].shading))
        .attr("id", this.mapcomp.shadeData[i].cluster)
        .attr("onclick", "results.selectFromMap(this.id)")
        .attr("stroke", "none")
        .attr("class", "shadedArea")
    }

    setTimeout(function() {
      $(".shadedArea").on("click", function() {
        $(".shadedArea").removeClass("selectedCluster");
        var content_id = $(this).attr('id');
        $(this).addClass("selectedCluster");
      });

      $(".shadedAreaModal").on("click", function() {
        $(".shadedAreaModal").removeClass("selectedClusterModal");
        var content_id = $(this).attr('id');
        $(this).addClass("selectedClusterModal");
      });

      if (this.mapcomp.user !== 'undefined') {
        var userPlot = this.mapcomp.pointData[this.mapcomp.user.id];
        var userX = this.mapcomp.pointData[this.mapcomp.user.id].x + 375 - xMid;
        var userY = 250 - this.mapcomp.pointData[this.mapcomp.user.id].y - yMid;
        var existingContent = $('.clusterMap').html();
        var toInsert = '<circle cx="' + userX + '" cy="' + userY + '" r="13" stroke="white" stroke-width="4" fill="#0097a7" />';
        $('.clusterMap').html(existingContent + toInsert);
      }

    }, 100);

    d3.select('.clusterMap').selectAll("circle")
      .data(pointPlot).enter().append("circle")
      .attr("cx", function(d) {
        return d.x + 375 - xMid
      })
      .attr("cy", function(d) {
        return 250 - d.y - yMid
      })
      .attr("r", 7).attr("fill", "rgba(91, 59, 122, 0.650)")
      .attr("class", "u-plots");
  }
}

module.exports = mixin;
