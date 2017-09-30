var mixin = {
  methods: {

    changeBubbles: function(inputSentenceId, mapcomp) {
      //m = object that is the sentence dictionary
      //mindex = index of sentence dict within the list of sentences
      //sentenceId = sentenceId
      var a = 0.3;
      var testgroup = document.getElementById('group1');
      testgroup.style.fill = "rgba(82, 174, 251, 0.4)";

      mapcomp.groupSimple = [];
      for (var index in mapcomp.bubbleData) { //for every bubble group
        var groupObj = mapcomp.bubbleData[index]
        mapcomp.groupInfo.label = groupObj.group;
        mapcomp.groupInfo.size = groupObj.size;
        mapcomp.groupInfo.sentenceId = inputSentenceId;

        for (var passages in groupObj.sentences) {
          var passageObj = groupObj.sentences[passages];
          if (passageObj.sentenceId == inputSentenceId) {
            mapcomp.groupInfo.average = passageObj.average;
            mapcomp.groupInfo.agree = passageObj.agree;
            mapcomp.groupInfo.disagree = passageObj.disagree;
            mapcomp.groupInfo.unsure = passageObj.unsure;
          }
        }
        mapcomp.groupSimple.push(mapcomp.groupInfo)
        mapcomp.groupInfo = {
          label: "",
          size: "",
          sentenceId: "",
          average: "",
          agree: "",
          disagree: "",
          unsure: ""
        };
      }
    }
  },
  mounted: function() {
    if (this.mapcomp.bubbleData.length > 2) {

      var diameter = 400; //max size of the bubbles
      var color = d3.scaleOrdinal(d3.schemeCategory20c);

      var bubbleData = this.mapcomp.bubbleData.slice(1);

      var svg = d3.select(".bubbleMap")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble")
      .append("g")
      .attr("transform", "translate(0,0)");


      var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "white")
      .style("padding", "8px")
      .style("background-color", "rgba(0, 0, 0, 0.75)")
      .style("border-radius", "6px")
      .style("font", "15px sans-serif")
      .text("tooltip");

      var radiusScale = d3.scaleSqrt().domain([1, 60]).range([30, 75]);

      var simulation = d3.forceSimulation()
      .force("x", d3.forceX(diameter / 2).strength(0.05))
      .force("y", d3.forceY(diameter / 2).strength(0.05))
      .force("collide", d3.forceCollide(function(d) {
        return radiusScale(d.size + 5);
      }));

      var circles = svg.selectAll("circle")
      .data(bubbleData)
      .enter().append("circle")
      .attr("id", function(d) {
        return d.group;
      })
      .attr("r", function(d) {
        return radiusScale(d.size)
      })
      .attr("class", "aBubble")
      .attr("fill", "rgba(91, 59, 122, 0.41)")
      .on("mouseover", function(d) {
        tooltip.text("group " + d.group + '\n' + d.size + "people");
        tooltip.style("visibility", "visible");
      })
      .on("mousemove", function() {
        return tooltip.style("top", (d3.event.pageY + 24) + "px").style("left", (d3.event.pageX - 10) + "px");
      })
      .on("mouseout", function() {
        return tooltip.style("visibility", "hidden");
      })
      ;

      simulation.nodes(bubbleData)
      .on("tick", ticked)

      function ticked() {
        circles
        .attr("cx", function(d) {
          return d.x
        })
        .attr("cy", function(d) {
          return d.y
        })
      }


      for (var eachBubble in this.mapcomp.bubbleData.slice(1)) {
        if (true) {

        }
      }

    };



  }
}

module.exports = mixin;
