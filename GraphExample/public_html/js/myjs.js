/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var product        = "Product";
var date           = "Date Text";
var clickedCountry = "LastClickedCountry" 
var tradeType      = "TradeType"; //fill this string with "imports" or "Exports" depending on dropdown UI 

document.getElementById("graphTitle").innerHTML = product+ ": " + clickedCountry+ ": " + tradeType;
document.getElementById("graphDate").innerHTML  = date;

var yMaxText = document.getElementById("yMaxText"); 
var y1       = document.getElementById("y1");
var y2       = document.getElementById("y2");
var y3       = document.getElementById("y3");
var y4       = document.getElementById("y4");
var yUnit    = "k"; //change this to whatever the unit for Y-axis amounts is

var ctry1  = document.getElementById("ctry1");
var ctry2  = document.getElementById("ctry2");
var ctry3  = document.getElementById("ctry3");
var ctry4  = document.getElementById("ctry4");
var ctry5  = document.getElementById("ctry5");
var ctry6  = document.getElementById("ctry6");
var ctry7  = document.getElementById("ctry7");
var ctry8  = document.getElementById("ctry8");
var ctry9  = document.getElementById("ctry9");
var ctry10 = document.getElementById("ctry10");

var obj = {
  a:ctry1, b:ctry2, c:ctry3, 
   d:ctry4, e:ctry5, f:ctry6, 
    g:ctry7, h:ctry8, i:ctry9, 
     j:ctry10
};

var yFloats = [10,30,50,69,45,13,57,42]; //pull data from JSON obj into this array
yOrigin     = 0;
yMax        = Math.max.apply( Math, yFloats ); //69
yMin        = Math.min.apply( Math, yFloats ); //10
yScaleRaw   = (yMax - yMin)/6; //  59/6 = 9.83 = scale

document.getElementById("origin").innerHTML = yOrigin + yUnit;

var yScale = Math.round(yScaleRaw); // =10

var trueMax = yScale + yMax; // =79
var trueY1  = Math.round(trueMax/5) + yUnit; 
var trueY2  = Math.round(trueMax/4) + yUnit; 
var trueY3  = Math.round(trueMax/3) + yUnit; 
var trueY4  = Math.round(trueMax/2) + yUnit; 

y4.innerHTML       = trueY1;
y3.innerHTML       = trueY2;
y2.innerHTML       = trueY3;
y1.innerHTML       = trueY4;
yMaxText.innerHTML = trueMax + yUnit;

//CODE Below is starting to pull from vars that aren't local to this JS file.. unless you've already merged this file with another??

//this section of code belongs in the click-listener functions
/*countriesNames[0]*/

for (var prop in obj) {
  
  console.log("o." + prop + " = " + obj[prop]);
  obj[prop].innerHTML = "land";
  
}

/*if(countriesNames) {

  for(i=0, i<10, i++) {
		
	}
  
}*/

// Output:
// "o.a = 1"
// "o.b = 2"
// "o.c = 3"






 

//Math.max.apply( Math, amountFloats );
//Math.min.apply( Math, amountFloats );








/*age > 18 ? (
    alert("OK, you can go."),
    location.assign("continue.html")
) : (
    stop = true,
    alert("Sorry, you are much too young!")
);*/

//STARTING OTHER GRAPH CODE



var width = 1290;
var height = 400;
var bardata =  d3.range(0,11) ;

var barWidth = 80;
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
			.attr('width',90)
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
				}).attr("class", "rectStyle")
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
