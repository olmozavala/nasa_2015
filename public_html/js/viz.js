var fileName = "data/world-countries.json";
var highlight_color = d3.rgb(0,255,0);
var def_color = d3.rgb(0,0,0);
var exportsData;

//These variables should be readed  from the interface
var currentYear = "2000";
var currentMovement = "exports";// It can be imports or exports
var currentCategory = "corn";

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
	
	var fileNameExports = "data/Exports.json";
	d3.json(fileNameExports, function(err, data) {
		exportsData = data;
	});
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
						.attr("id",function(d,i){return "country"+d.id;})
						.classed("land",true)
						.on("click", function(d,i){
//							clearColor();
							$("#country"+d.id).css("fill",highlight_color);
							dispCountryName(d,i);
							exportsByCountry(d,i);
						})
						.on("mouseenter", function(d,i){ 
							$("#country"+d.id).css("fill","blue");
						})
						.on("mouseout", function(d,i){
							d3.select("#tooltip").style("opacity",0);
						$("#country"+d.id).css("fill","black");
				});
				
				resolve("Countries loaded correctly");
			}
		});
	});
	
}//RenderMap

function clearColor(){
	svg.selectAll(".land")[0].css("fill" ,def_color);
}

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

function exportsByCountry(d,i){
	var  fromCountryId = d.id;
	var  fromCountryName = d.properties.name;
	var countriesNames = new Array();
	var countriesValues = new Array();
	var maxAmountExports = 0;

	//Finds the correct year
	var tempIdx = _.findIndex(exportsData.years,{year:currentYear});
	var countriesByYear = exportsData.years[tempIdx];
//	console.log(countriesByYear);

	//Finds the correct country
	tempIdx = _.findIndex(countriesByYear.countries,{name:fromCountryName});
	var selectedCountryData = countriesByYear.countries[tempIdx]; 
//	console.log(idFromName(fromCountryName));

	if(currentMovement === "exports"){// It can be imports or exports
		tempIdx = _.findIndex(selectedCountryData.exports, {product:currentCategory});
		var allExportCountries = selectedCountryData.exports[tempIdx];
		//		console.log(allExportCountries);
		allExportCountries.countries.forEach(
				function(d){
					countriesNames.push(d.name);
					countriesValues.push(parseFloat(d.amount));
		});

		maxAmountExports = _.max(countriesValues);
		//Obtain min and max
		allExportCountries.countries.forEach(
				function(d,i){
					var countryId = idFromName(d.name);
					var amountNorm = parseFloat(d.amount)/maxAmountExports;
					$("#country"+countryId).css("fill",highlight_color.darker(amountNorm));
		});

		//CALL JONATHAN FUNCTION WITH contriesNames and countriesValues
	}else{
		console.log("Missing code for imports");
	};
}

function idFromName(id){
	var conv = {"Mexico": "MEX",
		"Australia": "AUS",
		"Canada": "CAN"};
	return conv[id];
}