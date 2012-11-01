var width = 1400,
    height = 1400,
    r = 1100,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    node,
    root,
    format = d3.format(",d");

var pack = d3.layout.pack()
    //.size([width - 4, height - 4])
    .size([r, r])
    .padding(20)
    .value(function(d) { 
		return d.size; 
	});

var radius = 25;

function toHeirarchy(obj) {

  // Get the organisms array
  var orgName, orgNames = obj.FDP;

  // Make root object
  var root = {name:'Fondation des parkings', children:[]};

  // For each organism, get the name parts
  for (var i=0, iLen=orgNames.length; i<iLen; i++) {
    orgName = orgNames[i].name.split('.');
	used = orgNames[i].used;

    // Start from root.children
    children = root.children;

    // For each part of name, get child if already have it
    // or add new object and child if not
    for (var j=0, jLen=orgName.length; j<jLen; j++) {
		if (j < jLen-1){
			children = addChild(children, orgName[j]);
		}else if (j = jLen-1){
			children = addLeaf(children, orgName[j], orgNames[i].name.replace(/\./g, "_").replace(/[^a-zA-Z0-9_]/g, ""),used);
		}      
		//children = addDummy(children);
    }
  }
    
  return root;


  function addDummy(children) {

    children ? children.push({"id" : "dummy", "size": 200, "dummy": 1, "name" : "dummy"}) : null;
    return children;

  }

  // Helper function, iterates over children looking for 
  // name. If found, returns its child array, otherwise adds a new
  // child object and child array and returns it.
  function addChild(children, name) {

    // Look for name in children
    for (var i=0, iLen=children.length; i<iLen; i++) {

      // If find name, return its child array
      if (children[i].name == name) {
        return children[i].children;   
      }
    }
    // If didn't find name, add a new object and 
    // return its child array
    children.push({'name': name, 'children':[]});
    return children[children.length - 1].children;
  }

  function addLeaf(children, name, id) {

    // Look for name in children
    for (var i=0, iLen=children.length; i<iLen; i++) {

      // If find name, return its child array
      if (children[i].name == name) {
        return children[i].children;   
      }
      
    }
    // If didn't find name, add a new object and 
    // return its child array
    children.push({'id' : id, 'name': name, 'size': 500, 'used': used});
    return children[children.length - 1].children;
  }
};


var d3line2 = d3.svg.line()
	.x(function(d){return d.x;})
	.y(function(d){return d.y;})
	.interpolate("linear");

var vis = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "pack")
	.append("svg:g")
    //.attr("transform", "translate(2, 2)");
	.attr("transform", "translate(" + (width - r) / 2 + "," + (height - r) / 2 + ")");

  
d3.json("../data/flare2.json", function(json) {

// vérifier : http://stackoverflow.com/questions/10098450/how-do-i-translate-d3-js-nodes

// pour résoudre le problème des cercles de même taille qui se superposent lorsque l'on a qu'un seul port :
// cf https://groups.google.com/forum/#!msg/d3-js/8yS0DidsLJI/_UqDNjEsCsEJ
// cf http://bl.ocks.org/3315318

	json2 = toHeirarchy(json);

	node = root = json2;

	var nodes = pack.nodes(json2).filter(function(d) { return !d.dummy; });

  var node = vis.data([json2]).selectAll("g.node")
      .data(pack.nodes(json2).filter(function(d) { return !d.dummy; }))
	  .enter()
	  .append("g")
      .attr("class", function(d) { 
		  //console.log(d.depth);
		  //console.log(d.children);
		  return d.children ? (d.depth == 1 ? "parking node" : "node") : "leaf node"; 
		})
      .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")";
		})
	  .attr("id",function(d){
		  //console.log("id");
		  //console.log(d);
		  //return "g_" + d.name; 
		  return d.children ? "g_" + d.name : "g_" + d.id;
		})
	.on("click", function(d){
		console.log("click " + d.name);
		if ( d3.selectAll(".p_" + d.id)[0].length > 0 && d.used == 'Y'){
			//console.log(d3.selectAll(".p_" + d.id)[0].length);
			//console.log(d3.selectAll(".p_" + d.id).style("opacity"));
			var selection = d3.selectAll(".p_" + d.id);
			//For min value
			var min = d3.min(selection[0], function(d){
				/*console.log("d");
				console.log(d);
				console.log("this");
				console.log(this);*/ 
				return	d3.select(d).style("opacity");
			});
			
			//if (d3.selectAll(".p_" + d.id).style("opacity") == 0){
			if (min == 0){	
				d3.selectAll(".p_" + d.id)
					.style("opacity", "1");
			} else {
				d3.selectAll(".p_" + d.id)
					.style("opacity", "0");
			}
		} else {
			if (d.used != 'Y' && d.used != 'N' ) {
				console.log("zoom "+ d.name);
				return zoom(node == d ? root : d);
			}	
		}
	})	;

  node.append("title")
	.text(function(d) { return d.children ?  d.name : d.name + " _ id : " + d.id; });

  node.append("svg:circle")
      .attr("r", function(d) { 
		  //console.log(d);
		  return d.r; 
		})
      .attr("id",function(d){ 
		  return "circle_" + d.id; })
	  .style("fill", function(d){
		  if (!d.children) {
			return d.used == "Y" ? "#ff7f0e" : "#eeeeee";
		}
	  });

  node.append("svg:text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
	  .text(function(d) { 
		  return d.name.substring(0, d.r / 3);
		})
	  .attr("transform", function(d) {
		  position = 10 - d.r;
		  //return d.children ? "translate(" + 0 + "," + position + ")" : "translate(" + 0 + "," + 0 + ")";
		  return "translate(" + 0 + "," + position + ")";
		})
	  .style("font-size",function(d){
		  return 10;
	   })
	  //.attr("x", function(d) { return d.x; })
      //.attr("y", function(d) { return d.y; })
		;


	var g_lines = vis.append("svg");
	
	d3.json("../data/links.json", function(links_) {
		//console.log(links_);
		
		g_lines.selectAll(".link_line")
			.data(links_)
			.enter()
			.append("path")
			//.attr("class", "link_line")
			.style("stroke", function(d) {
				var color = 'black';
				if (d.type === "patch"){
					color = 'red';
				} else if (d.type === "fibre"){
					color = 'blue';
				} else if (d.type === "octopus"){
					color = 'green';
				} 
			    return color;
			})
			.attr("id", function(i, d) {
				return "link_line" + d;
			})
			.attr("class", function(d) { 
			  return "p_" + d.source + " " + "p_" + d.target + " link_line"; 
			})
			.attr("d", function(d) {
				//console.log("___");
				//console.log(d.source + " " + d.target);
				//console.log(d3.select('#g_' + d.source).property("__data__"));
				//console.log(d3.select('#g_' + d.target).property("__data__"));
				pathinfo = [
				{ x: d3.select('#g_' + d.source).property("__data__").x,y: d3.select('#g_' + d.source).property("__data__").y},
				{ x: d3.select('#g_' + d.target).property("__data__").x, y: d3.select('#g_' + d.target).property("__data__").y}
				];
				return d3line2(pathinfo)
			})
			.style("stroke-width", 5)
			.style("fill", "none")
			.style("opacity", 0)
			.append("svg:title")
				.text(function(d, i) { return d.type + " : from " + d.source + " to " + d.target ; })
			;
	});


  //d3.select(window).on("click", function() { zoom(root); });


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



function zoom(d, i) {
  var k = r / d.r / 2;
  console.log(k);
  //console.log("r " + r);
  //console.log("d.r " + d.r);
  
  x.domain([d.x - d.r, d.x + d.r]);
  y.domain([d.y - d.r, d.y + d.r]);

  var t = vis.transition()
      .duration(d3.event.altKey ? 7500 : 750);

  t.selectAll("circle")
      //.attr("cx", function(d) { return x(d.x); })
      //.attr("cy", function(d) { return y(d.y); })
      .attr("r", function(d) { 
		  //console.log(d.r);
		  //console.log(k);
		  return k * d.r; 
	});
	
	t.selectAll("text")
      .attr("transform", function(d) {
		  position = 15 - (k * d.r);
		  //return d.children ? "translate(" + 0 + "," + position + ")" : "translate(" + 0 + "," + 0 + ")";
		  return "translate(" + 0 + "," + position + ")";
		})
	.style("font-size",10 + k);
		
  t.selectAll("g.node")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      //.style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });
      .attr("transform", function(d) {
		  //console.log(d); 
		  return "translate(" + x(d.x) + "," + y(d.y) + ")";
		});
	//.append("title")
	//	.text(function(d) { return d.children ?  d.name : d.name + " _ id : " + d.id; });


	t.selectAll(".link_line")
		.attr("d", function(d) {
				//console.log(d.source);
				//console.log(d.target);
				//console.log(d3.select('#g_' + d.source).property("__data__").x + "," + d3.select('#g_' + d.source).property("__data__").y);
				//console.log(d3.select('#g_' + d.target).property("__data__").x + "," + d3.select('#g_' + d.target).property("__data__").y);
				
				//console.log(x(d3.select('#g_' + d.source).property("__data__").x) + "," + y(d3.select('#g_' + d.source).property("__data__").y));
				//console.log(x(d3.select('#g_' + d.target).property("__data__").x) + "," + y(d3.select('#g_' + d.target).property("__data__").y));
				
				pathinfo = [
				{ x: x(d3.select('#g_' + d.source).property("__data__").x),y: y(d3.select('#g_' + d.source).property("__data__").y)},
				{ x: x(d3.select('#g_' + d.target).property("__data__").x), y: y(d3.select('#g_' + d.target).property("__data__").y)}
				];
				return d3line2(pathinfo)
			})
		.style("stroke-width", 5 + k);
  node = d;
  d3.event.stopPropagation();
}
