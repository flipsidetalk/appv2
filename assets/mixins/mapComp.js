var mixin = {
  methods: {
    render: function(mapcomp) {
      if (mapcomp.xlength > mapcomp.ylength) {
        mapcomp.multiplier = 500 / mapcomp.xlength;
      } else {
        mapcomp.multiplier = 334 / mapcomp.ylength;
      }
      for (var value in mapcomp.pointData) {
        mapcomp.pointData[value].x *= mapcomp.multiplier;
        mapcomp.pointData[value].y *= mapcomp.multiplier;
      }
      for (var cluster in mapcomp.shadeData) {
        for (var s in mapcomp.shadeData[cluster].shading) {
          var obj = mapcomp.shadeData[cluster].shading[s]
          obj.x *= mapcomp.multiplier;
          obj.y *= mapcomp.multiplier;
        }
      }

      for (var group in mapcomp.clusterData) { //length is 4
        for (var item in mapcomp.clusterData[group]) {
          var object = mapcomp.clusterData[group][item]; // object of clusterData - 32 total objects
          if (object.average > 0) {
            object.decision = "agree";
          } else {
            object.decision = "disagree";
          }
          for (var key in mapcomp.contentData) {
            var mainGroup = mapcomp.contentData[key];
            for (key1 in mapcomp.mainGroup) {
              var mainobj = mapcomp.mainGroup[key1];
              if (mainobj.sentenceId == object.sentenceId) {
                object.text = mainobj.text;
              }
            }
          }
        }
      }

      var xMid = (mapcomp.extremeData.xMax + mapcomp.extremeData.xMin) / 2;
      var yMid = (mapcomp.extremeData.yMax + mapcomp.extremeData.yMin) / 2;
      //Cluster Map
      var pointPlot = [];
      for (var user in mapcomp.pointData) {
        pointPlot.push(mapcomp.pointData[user]);
      }

      var lineFunction = d3.line()
        .x(function(d) {
          return d.x + 375 - xMid;
        })
        .y(function(d) {
          return 250 - d.y - yMid;
        })
        .curve(d3.curveLinear);

      for (var i = 0; i < mapcomp.shadeData.length; i++) {
        d3.select('.clusterMap')
          .append("path")
          .attr("d", lineFunction(mapcomp.shadeData[i].shading))
          .attr("id", mapcomp.shadeData[i].cluster)
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

        if (mapcomp.user !== 'undefined') {
          var userPlot = mapcomp.pointData[mapcomp.user.id];
          var userX = mapcomp.pointData[mapcomp.user.id].x + 375 - xMid;
          var userY = 250 - mapcomp.pointData[mapcomp.user.id].y - yMid;
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
};

module.exports = mixin;
