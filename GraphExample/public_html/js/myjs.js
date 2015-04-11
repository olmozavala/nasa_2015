/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var width = 400;
var height = 400;
var bardata =  d3.range(0,20) ;

var barWidth = 40;
var barHeight = 100;
var barOffset = 5;


d3.select('svg')
		.attr('width',width)
		.attr('height',height)

var mysvg = d3.select('svg');
addRectangle(mysvg);
appendBarchar(mysvg);

function addRectangle(obj){
	obj.append("rect")
			.attr('x',100)
			.attr('y',100)
			.attr('width',100)
			.attr('height',100)
			.style('fill','green');
}


function appendBarchar(obj){
	// Scale examples
	var yScale = d3.scale.linear()
			.domain([0, d3.max(bardata)])
			.range([0, barHeight]);
	
	var colors = d3.scale.linear()
			.domain([0, d3.max(bardata)*.55, d3.max(bardata)])
			.range(['#0000FF', '#FFFF00', '#FF0000']);

	var xScale = d3.scale.ordinal()
			.domain(d3.range(0,bardata.length))
			.rangeBands([0, width]);
	
	//The frist 3 lines are the weird ones. You first select
	// all the rectangles that doesn't exist and then you append
	// them on the svg object
	obj.selectAll('rect')
			.data(bardata)
			.enter().append('rect')
			.style('fill', function(d){
				return colors(d);
				})
			.attr('width', xScale.rangeBand())
			.attr('height', function(d){
				return yScale(d);
				})
			.attr('x', function(d,i){
				console.log(d);
				console.log(xScale(i));
				return xScale(i);
				})
			.attr('y', function(d,i){
				return 200 + barHeight - yScale(d);
				})
            .on('mouseover', function(d){
                d3.select(this)
                    .style('opacity',.5);
            })
            .on('mouseout', function(d){
                d3.select(this)
                    .style('opacity',1);
            })

}
