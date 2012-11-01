var width = 960,
    height = 960,
    format = d3.format(",d");

var pack = d3.layout.pack()
    .size([width - 4, height - 4])
    .padding(15)
    .value(function(d) { 
		return d.size; 
	});

var radius = 25;

var links = [
	{
	source: "1",
	target: "5",
	strength: 10
	},
	{
	source: "5",
	target: "10",
	strength: 10
	},
	{
	source: "10",
	target: "12",
	strength: 10
	},
	{
	source: "10",
	target: "13",
	strength: 10
	},
	{
	source: "10",
	target: "14",
	strength: 10
	},
	{
	source: "12",
	target: "29",
	strength: 10
	},
	{
	source: "29",
	target: "34",
	strength: 10
	}
	];

var d3line2 = d3.svg.line()
	.x(function(d){return d.x;})
	.y(function(d){return d.y;})
	.interpolate("linear");

var vis = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "pack")
	.append("g")
    .attr("transform", "translate(2, 2)");

d3.json("../data/flare2.json", function(json) {
	var node = vis.data([json]).selectAll("g.node")
		.data(pack.nodes)
		.enter().append("g")
		.attr("class", function(d) { 
			//console.log(d); 
			return d.children ? "node" : "leaf node"; 
		})
		.attr("transform", function(d) { 
			return "translate(" + d.x + "," + d.y + ")";
		})
		.attr("id",function(d){
			return d.children ? "g_" + d.name : "g_" + d.id; 
		})
		.on("click", function(){
			d3.select(this)
				.style("fill","lightcoral")
				.style("stroke","red");
		})
		;

		node.append("title")
			.text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

		node.append("circle")
			.attr("r", function(d) { 
				  return d.r; 
			})
			.attr("id",function(d){
				return "circle_" + d.id; 
			})
			;

		node.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", ".3em")
			.text(function(d) { 
				return d.name.substring(0, d.r / 3);
			})
			.attr("transform", function(d) {
				position = 10 - d.r;
				return d.children ? "translate(" + 0 + "," + position + ")" : "translate(" + 0 + "," + 0 + ")";
			})
			;


		var g_lines = vis.append("svg");
	
		g_lines.selectAll(".link_line").data(links).enter().append("path")
			.attr("class", "link_line")
			.attr("id", function(i, d) {
				return "link_line_" + i.source + "_" + i.target;
			})
			.attr("d", function(d) {
				pathinfo = [
					{ x: d3.select('#g_' + d.source).property("__data__").x,y: d3.select('#g_' + d.source).property("__data__").y},
					{ x: d3.select('#g_' + d.target).property("__data__").x, y: d3.select('#g_' + d.target).property("__data__").y}
				];
				return d3line2(pathinfo)
			})
			.style("stroke-width", 2)
			.style("stroke", "red")
			.style("fill", "none")
			.style("opacity", 0.9)
			;

});
