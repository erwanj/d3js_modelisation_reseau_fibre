var width = 960,
    height = 960,
    format = d3.format(",d");

var pack = d3.layout.pack()
    .size([width - 4, height - 4])
    .padding(15)
    .value(function(d) { 
		//console.log("pack");
		//console.log(d.name + " " + d.size);
		return d.size; 
	});

var radius = 25;

var links = [
	{
	source: "1",
	target: "5",
	//strength: Math.round(Math.random() * 10)},
	strength: 10
	},
	{
	source: "5",
	target: "10",
	//strength: Math.round(Math.random() * 10)
	strength: 10
	},
	{
	source: "10",
	target: "12",
	//strength: Math.round(Math.random() * 10)
	strength: 10
	},
	{
	source: "10",
	target: "13",
	//strength: Math.round(Math.random() * 10)
	strength: 10
	},
	{
	source: "10",
	target: "14",
	//strength: Math.round(Math.random() * 10)
	strength: 10
	},
	{
	source: "12",
	target: "29",
	//strength: Math.round(Math.random() * 10)
	strength: 10
	},
	{
	source: "29",
	target: "34",
	//strength: Math.round(Math.random() * 10)
	strength: 10
	}
	];

//var d3LineLinear = d3.svg.line().interpolate("linear");

var d3line2 = d3.svg.line()
	.x(function(d){return d.x;})
	.y(function(d){return d.y;})
	.interpolate("linear");



var drag = d3.behavior.drag().origin(Object).on("drag", function() {
	dragmove_(this);
});    

function dragmove_(dragged) {

	if (d3.select(dragged).property("__data__").depth == 1 )          // on est dans le cas d'un parking
	{
		

		var x = 0;
		var y = 0;
		
		
		d3.selectAll("circle").filter(function(d) { 
			if (d.depth == 1){
				return d === d3.select(dragged).property("__data__"); 
			} else if (d.depth == 2){
				return d.parent === d3.select(dragged).property("__data__") || d === d3.select(dragged).property("__data__"); 
			} else if (d.depth == 3){
				return d.parent.parent === d3.select(dragged).property("__data__") || d === d3.select(dragged).property("__data__"); 
			} 
			})
			//.attr("x", Math.max(radius, Math.min(width - radius, +d.x + d3.event.dx)))
			//.attr("y", Math.max(radius, Math.min(height - radius, +d.y + d3.event.dy)))
			/*.text(function(d){
				var a = 0;
				x = d.x;
				y = d.y;
				console.log("____________");		
				console.log(x);
				console.log(y);		
				})*/
			.attr("transform", function(d) { 
				//console.log(d.name);
				//console.log(x);
				//console.log(y);
				console.log("transform");
				console.log(d);
				console.log(d.currentTranslate);
				//console.log(d.name + " " + d.x + " " + d.y);	
				//console.log("translate(" + Math.max(radius, Math.min(width - radius, +d.x + d3.event.dx)) + "," + Math.max(radius, Math.min(height - radius, +d.y + d3.event.dy)) + ")");
				return "translate(" + Math.max(radius, Math.min(width - radius, +x + d3.event.dx)) + "," + Math.max(radius, Math.min(height - radius, +y + d3.event.dy)) + ")";
			})
			.attr("x", function(d) {
				//console.log(Math.max(radius, Math.min(width - radius, +d.x + d3.event.dx)));
				//console.log("x");
				//console.log(d.name + " " + d.x + " " + d.y);			
				return Math.max(radius, Math.min(width - radius, +d.x + d3.event.dx));
			})
			.attr("y", function(d) { 
				//console.log(Math.max(radius, Math.min(height - radius, +d.y + d3.event.dy)));
				//console.log("y");
				//console.log(d.name + " " + d.x + " " + d.y);
				return Math.max(radius, Math.min(height - radius, +d.y + d3.event.dy));
			});
			//.property("__data__", function(){ return "x" : Math.max(radius, Math.min(width - radius, +x + d3.event.dx));});
		//d3.selectAll("circle")
		//	.property("__data__").x = Math.max(radius, Math.min(width - radius, +d3.select(this).property("__data__").x + d3.event.dx));
		//d3.selectAll("circle")
		//	.property("__data__").y = Math.max(radius, Math.min(height - radius, +d3.select(this).property("__data__").y + d3.event.dy));
		//console.log("x1 : " + d3.select(dragged).property("__data__").x);
		//console.log("y1 : " + d3.select(dragged).property("__data__").y);
		
	}
}

function dragmove(dragged) {
	/*var x = d3.select(dragged).attr("cx");
	var y = d3.select(dragged).attr("cy");
	d3.select(dragged).attr("cx", Math.max(radius, Math.min(width - radius, +x + d3.event.dx))).attr("cy", Math.max(radius, Math.min(height - radius, +y + d3.event.dy)));
	$.each(links, function(i, link) {
		if (link.source == dragged.id.match(/\d+/)[0] || link.target == dragged.id.match(/\d+/)[0]) {
			d3.select('#link_line' + i).attr("d", function(d) {
				return drawCurve(d);
			});
		}
	});*/
	if (d3.select(dragged).property("__data__").depth == 1 )          // on est dans le cas d'un parking
	{
		//console.log(d3.select(dragged).property("__data__").depth);
		//var x = d3.select(dragged).attr("x");
		//var y = d3.select(dragged).attr("y");
		
		var x = d3.select(dragged).property("__data__").x;
		var y = d3.select(dragged).property("__data__").y;
		
		
		//d3.select(dragged)
		//	.attr("x", Math.max(radius, Math.min(width - radius, +x + d3.event.dx)))
		//	.attr("y", Math.max(radius, Math.min(height - radius, +y + d3.event.dy)))
		//	.attr("transform", function(d) { 
		//	  return "translate(" + Math.max(radius, Math.min(width - radius, +x + d3.event.dx)) + "," + Math.max(radius, Math.min(height - radius, +y + d3.event.dy)) + ")";
		//	});
		//console.log(d3.select(dragged).selectAll("g"));
		console.log("x : " + x);
		console.log("y : " + y);
		console.log("d3.event.dx : " + d3.event.dx);
		console.log("d3.event.dy : " + d3.event.dy);

		//console.log(d3.select("#g_Etoile"));
		//console.log(d3.select("#g_Etoile").selectAll("g"));
		d3.select(dragged)//.selectAll("g")
			//.attr("x", Math.max(radius, Math.min(width - radius, +x + d3.event.dx)))
			//.attr("y", Math.max(radius, Math.min(height - radius, +y + d3.event.dy)))
			.attr("transform", function(d) { 
				//console.log(dragged);
				//console.log("translate(" + Math.max(radius, Math.min(width - radius, +x + d3.event.dx)) + "," + Math.max(radius, Math.min(height - radius, +y + d3.event.dy)) + ")");

				console.log(d);
				console.log(d.currentTranslate);
				return "translate(" + Math.max(radius, Math.min(width - radius, +x + d3.event.dx)) + "," + Math.max(radius, Math.min(height - radius, +y + d3.event.dy)) + ")";
				//console.log("translate(100,100)");
				//return "translate(100,100)";
			});
			//.property("__data__", function(){ return "x" : Math.max(radius, Math.min(width - radius, +x + d3.event.dx));});
			
		d3.select(dragged).property("__data__").x = Math.max(radius, Math.min(width - radius, +x + d3.event.dx));
		d3.select(dragged).property("__data__").y = Math.max(radius, Math.min(height - radius, +y + d3.event.dy));
		console.log("x1 : " + d3.select(dragged).property("__data__").x);
		console.log("y1 : " + d3.select(dragged).property("__data__").y);
		
	}
	
	//d3.json("../data/flare2.json", function(json) {
	//	console.log(json);
	//	var node = vis.data([json]);
	//});
}


var vis = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "pack")
	.append("g")
    .attr("transform", "translate(2, 2)");

//console.log(pack);        

d3.json("../data/flare2.json", function(json) {

// vérifier : http://stackoverflow.com/questions/10098450/how-do-i-translate-d3-js-nodes

  var node = vis.data([json]).selectAll("g.node")
      .data(pack.nodes)
	.enter()
	  .append("g")
      .attr("class", function(d) { 
		  console.log(d.depth); 
		  return d.children ? (d.depth == 1 ? "parking node" : "node") : "leaf node"; 
		})
      .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")";
		})
	  .attr("id",function(d){
		  //console.log(d);
		  //return "g_" + d.name; 
		  return d.children ? "g_" + d.name : "g_" + d.id;
		})
	  /*.attr("x", function(d) { 
		  return d.x;
		})
	  .attr("y", function(d) { 
		  return d.y;
		})*/
	  .call(drag);

  node.append("title")
      .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

  node.append("circle")
      .attr("r", function(d) { 
		  return d.r; 
		})
      .attr("id",function(d){ 
		  return "circle_" + d.id; })
      ;

  //node.filter(function(d) { return !d.children; }).append("text")
  node.append("text")
      .attr("text-anchor", "middle")
      //.attr("text-anchor", function(d) { return d.children ? "start" : "middle";})
      .attr("dy", ".3em")
      //.attr("dx", function(d){
		//  console.log(d);
		//  return 100;
		// })
      .text(function(d) { 
		  return d.name.substring(0, d.r / 3);
		})
	  .attr("transform", function(d) {
		  position = 10 - d.r;
		  return d.children ? "translate(" + 0 + "," + position + ")" : "translate(" + 0 + "," + 0 + ")";
		})
		;


	//var g_lines = svg.append("g").attr("class", "lines");
	//var g_lines = d3.select("#chart").append("svg").attr("class", "lines");
	//var g_lines = d3.select("#chart").select("#pack").append("svg");
	var g_lines = vis.append("svg");
	
	g_lines.selectAll(".link_line").data(links).enter().append("path").attr("class", "link_line")
		//.attr("fill", function(d) {
		//    return d3color(color_scale(d.strength));
		//})
		.attr("id", function(i, d) {
			//console.log(d);
			return "link_line" + d;
		})
		.attr("d", function(d) {
			//return drawCurve(d);
			/*pathinfo = [
			{ x: d3.select('#g_' + d.source).attr("x"),y: d3.select('#g_' + d.source).attr("y")},
			{ x: d3.select('#g_' + d.target).attr("x"), y: d3.select('#g_' + d.target).attr("y")}
			];*/
			pathinfo = [
			{ x: d3.select('#g_' + d.source).property("__data__").x,y: d3.select('#g_' + d.source).property("__data__").y},
			{ x: d3.select('#g_' + d.target).property("__data__").x, y: d3.select('#g_' + d.target).property("__data__").y}
			];
			//this.append("svg:path")
			return d3line2(pathinfo)
		})
		.style("stroke-width", 2)
		.style("stroke", "red")
		.style("fill", "none")
		.style("opacity", 0.9)
		;


	/*function drawCurve(d) {
			
			//console.log("d3.select('#g_' + d.source).attr(x) " + d3.select('#g_' + d.source).attr("x"));
			//console.log("d3.select('#g_' + d.source).attr(y) " + d3.select('#g_' + d.source).attr("y"));
			//console.log("d3.select('#g_' + d.target).attr(x) " + d3.select('#g_' + d.target).attr("x"));
			//console.log("d3.select('#g_' + d.target).attr(y) " + d3.select('#g_' + d.target).attr("y"));
			
			var slope = Math.atan2((+d3.select('#g_' + d.target).attr("y") - d3.select('#g_' + d.source).attr("y")), (+d3.select('#g_' + d.target).attr("x") - d3.select('#g_' + d.source).attr("x")));
			var slopePlus90 = Math.atan2((+d3.select('#g_' + d.target).attr("y") - d3.select('#g_' + d.source).attr("y")), (+d3.select('#g_' + d.target).attr("x") - d3.select('#g_' + d.source).attr("x"))) + (Math.PI / 2);

			var sourceX = +d3.select('#g_' + d.source).attr("x");
			var sourceY = +d3.select('#g_' + d.source).attr("y");
			var targetX = +d3.select('#g_' + d.target).attr("x");
			var targetY = +d3.select('#g_' + d.target).attr("y");

			var arrowOffset = 20;
			var points = [];

			points.push([sourceX + radius * Math.cos(slope) - strength_scale(d.strength) * Math.cos(slopePlus90), sourceY + radius * Math.sin(slope) - strength_scale(d.strength) * Math.sin(slopePlus90)]);
			points.push([sourceX + radius * Math.cos(slope), sourceY + radius * Math.sin(slope)]);
			points.push([targetX - radius * Math.cos(slope), targetY - radius * Math.sin(slope)]);
			points.push([targetX - (radius + arrowOffset) * Math.cos(slope) - strength_scale(d.strength + (arrowOffset / 2)) * Math.cos(slopePlus90), targetY - (radius + arrowOffset) * Math.sin(slope) - strength_scale(d.strength + (arrowOffset / 2)) * Math.sin(slopePlus90)]);
			points.push([targetX - (radius + arrowOffset) * Math.cos(slope) - strength_scale(d.strength) * Math.cos(slopePlus90), targetY - (radius + arrowOffset) * Math.sin(slope) - strength_scale(d.strength) * Math.sin(slopePlus90)]);

			points.push([sourceX + radius * Math.cos(slope) - strength_scale(d.strength) * Math.cos(slopePlus90), sourceY + radius * Math.sin(slope) - strength_scale(d.strength) * Math.sin(slopePlus90)]);
			points.push([sourceX + radius * Math.cos(slope), sourceY + radius * Math.sin(slope)]);
			points.push([targetX - radius * Math.cos(slope), targetY - radius * Math.sin(slope)]);
			//points.push([targetX - (radius + arrowOffset) * Math.cos(slope) - strength_scale(d.strength + (arrowOffset / 2)) * Math.cos(slopePlus90), targetY - (radius + arrowOffset) * Math.sin(slope) - strength_scale(d.strength + (arrowOffset / 2)) * Math.sin(slopePlus90)]);
			points.push([targetX - radius * Math.cos(slope) - strength_scale(d.strength) * Math.cos(slopePlus90), targetY - (radius + arrowOffset) * Math.sin(slope) - strength_scale(d.strength) * Math.sin(slopePlus90)]);

			return d3LineLinear(points) + "Z";
		}*/


/*
 * 	Parking
 * 		Local
 * 			Armoire
 * 				Rack
 * 					Module / Switch
 * 						Port
 * 			
 * 
 * 
 * 
 * 
 */


});
