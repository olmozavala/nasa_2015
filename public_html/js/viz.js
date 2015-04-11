var fileName = "data/world-countries.json";
var highlight_color = "#A01E1E";

var zoom = d3.geo.zoom().projection(projection)
            .scaleExtent([projection.scale() * .7, projection.scale() * 10])
		.on("zoom.redraw", function() {
			refreshMap(); });

function refreshMap(){
	svg.selectAll("path").attr("d", path);
	svg.selectAll("circle")
			.attr("cx",function(d){return projection(d.geometry.coordinates)[0]})
			.attr("cy",function(d){return projection(d.geometry.coordinates)[1]});
	
}

//jquery init function
function renderMap(){
	
	//Adds the graticule
	map.append("path")
			.datum(graticule)
			.attr("d", path)
			.classed("grid",true);
	
	var renderWorld = new Promise(function(resolve, reject) {
		d3.json(fileName, function(err, data) {
			if (err){
				reject(Error("Not able to render the world"));
			}else{
				var world = svg.append("g");
				world.selectAll("path")
						.data(data.features)
						.enter()
						.append("path")
						.attr("d",path)
						.attr("id",function(d,i){return "country"+i;})
						.classed("land",true)
						.on("click", function(d,i){
							$("#country"+i).css("fill","green");
							dispCountryName(d,i);
						})
						.on("mouseenter", function(d,i){ 
							$("#country"+i).css("fill","blue");
						})
						.on("mouseout", function(d,i){
							d3.select("#tooltip").style("opacity",0);
					$("#country"+i).css("fill","black");
				});
				
				resolve("Countries loaded correctly");
			}
		});
	});
	
}//RenderMap

function resizeMap(){
	width = $(window).width();
	height = $(window).height()-20;
	
	d3.select('svg')
			.attr('width',width)
			.attr('height',height)
	
	//Define projection
	projection.translate([width / 2, height / 2])
	
	refreshMap();
}

function dispCountryName(d,i){
	d3.select("#tooltip")
			.text(d.properties.name)
			.classed("tooltip",false)
			.classed("tooltipInst",true)
			.style("opacity",1)
			.style("left", (d3.event.pageX + 20) + "px")
			.style("top", (d3.event.pageY - 10) + "px");
}
