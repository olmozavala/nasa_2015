var fileName = "data/world-countries.json";
var highlight_color = d3.rgb(0,255,0);
//var selected_color= d3.rgb(16,76,39);
var selected_color= d3.rgb(170,105,17);
var def_color = d3.rgb(0,0,0);
var exportsData;

var currentlySelected = 0;

//These variables should be readed  from the interface
var currentYear = 0;
var currentMovement = "";// It can be imports or exports
var currentCategory = "";

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
	
	var readData = new Promise(function(resolve, reject) {
			d3.json(fileNameExports, function(err, data) {
				if (err){
					console.log(err);
					reject(Error("Can't load the trades data."));
				}else{
					// Filling the years dropdown
					var years = new Array();
					var products = new Array();
					data.years.forEach(function(d){
						 years.push(d.year);

						 d.countries.forEach(function(origin){
						 	origin.exports.forEach(function(singleExport){
						 		products.push(singleExport.product); })
							});
						 });

					products = _.uniq(products);
					years = _.uniq(years);
					fillYearsDropdown(years);
					fillImportDropdwon();
					fillProductsDropdown(products);
					//What to do when the dropdowns are modified 
					$("#dn_products").on("change", function(d){
						if(currentlySelected !== 0){
							clearColor();
							d = d3.select("#country"+currentlySelected);
							var currCountry = $("#country"+currentlySelected)
							currCountry.css("fill",selected_color);
							exportsByCountry(currCountry.attr("name")); 
						}
					});
					exportsData = data;
					resolve("Data loaded correctly");
				}
			});
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
						.attr("name",function(d,i){
							return d.properties.name; })
						.attr("id",function(d,i){
							return "country"+d.id; })
						.classed("land",true)
						.on("click", function(d,i){
							clearColor();
					currentlySelected = d.id;
					$("#country"+d.id).css("fill",selected_color);
					dispCountryName(d.properties.name);
					exportsByCountry(d.properties.name); 
					})
						.on("mouseenter", function(d,i){ 
							if(currentlySelected ===  0){ $("#country"+d.id).css("fill" ,"blue"); }
							})
						.on("mouseout", function(d,i){
							if(currentlySelected ===  0){
								d3.select("#tooltip").style("opacity",0);
								$("#country"+d.id).css("fill","black");
							}
						});
				resolve("Countries loaded correctly");
			}
		});
	});
}//RenderMap

function clearColor(){
	$("path[class=land]").css("fill","black")	
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

function dispCountryName(name){
	d3.select("#tooltip")
			.text(name)
			.classed("tooltip",false)
			.classed("tooltipInst",true)
			.style("opacity",1)
			.style("left", (d3.event.pageX + 20) + "px")
			.style("top", (d3.event.pageY - 10) + "px");
}

function exportsByCountry(name){
	var  fromCountryName = name;
	var countriesNames = new Array();
	var countriesValues = new Array();
	var maxAmountExports = 0;
	
	currentYear = $("#dn_years").val();
	currentMovement = $("#dn_import").val();
	currentCategory = $("#dn_products").val();
	
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
					var amountNorm = maxAmountExports/(5*parseFloat(d.amount));// TODO improve how the color is modified
					$("#country"+countryId).css("fill",highlight_color.darker(amountNorm));
		});
		
		//CALL JONATHAN FUNCTION WITH contriesNames and countriesValues
	}else{
		console.log("Missing code for imports");
	};
}