var width = $(window).width();
var height = $(window).height()-20;

var svg = d3.select('#maingraph');
d3.select('svg')
		.attr('width',width)
		.attr('height',height)

var map = svg.append('g');


//Define projection
/*
var projection = d3.geo.orthographic()
		.scale(150)
		.clipAngle(90)
		.rotate([100,0,0])
		.translate([width / 2, height / 2])
		*/

var projection = d3.geo.mercator()
    .scale((width + 1) / 2 / Math.PI)
    .translate([width / 2, height / 2])
    .precision(.1);

//Define path
var path = d3.geo.path()
		.projection(projection);

//Graticule
var graticule = d3.geo.graticule();

var colors = d3.scale.linear()
		.domain([0, 32])
		.range(['#FFF8B7', '#9B3600']);

$(function() {
	renderMap();
});

function dispError(error){
	$("#errorText").show();
	$("#errorText").text(error);
}

