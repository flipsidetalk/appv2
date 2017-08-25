var mixin = {
  methods: {
    render: function(data) {
      if (data.xlength > data.ylength) {
        data.multiplier = 500 / data.xlength;
      } else {
        data.multiplier = 334 / data.ylength;
      }
      for (var value in data.pointData) {
        data.pointData[value].x *= data.multiplier;
        data.pointData[value].y *= data.multiplier;
      }
      for (var cluster in data.shadeData) {
        for (var s in data.shadeData[cluster].shading) {
          var obj = data.shadeData[cluster].shading[s]
          obj.x *= data.multiplier;
          obj.y *= data.multiplier;
        }
      }

      for (var group in data.clusterData) { //length is 4
        for (var item in data.clusterData[group]) {
          var object = data.clusterData[group][item]; // object of clusterData - 32 total objects
          if (object.average > 0) {
            object.decision = "agree";
          } else {
            object.decision = "disagree";
          }
          for (var key in data.contentData) {
            var mainGroup = data.contentData[key];
            for (key1 in data.mainGroup) {
              var mainobj = data.mainGroup[key1];
              if (mainobj.sentenceId == object.sentenceId) {
                object.text = mainobj.text;
              }
            }
          }
        }
      }

      var xMid = (data.extremeData.xMax + data.extremeData.xMin) / 2;
      var yMid = (data.extremeData.yMax + data.extremeData.yMin) / 2;
      //Cluster Map
      var pointPlot = [];
      for (var user in data.pointData) {
        pointPlot.push(data.pointData[user]);
      }

      var lineFunction = d3.line()
        .x(function(d) {
          return d.x + 375 - xMid;
        })
        .y(function(d) {
          return 250 - d.y - yMid;
        })
        .curve(d3.curveLinear);

      for (var i = 0; i < data.shadeData.length; i++) {
        d3.select('.clusterMap')
          .append("path")
          .attr("d", lineFunction(data.shadeData[i].shading))
          .attr("id", data.shadeData[i].cluster)
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

        if (data.user !== 'undefined') {
          var userPlot = data.pointData[data.user.id];
          var userX = data.pointData[data.user.id].x + 375 - xMid;
          var userY = 250 - data.pointData[data.user.id].y - yMid;
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
