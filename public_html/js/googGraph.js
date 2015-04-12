google.load('visualization', '1', {packages: ['corechart', 'bar']});

function drawChart(countriesNames, countriesValues, 
		currentCategory, currentMovement, currentlySelected){

	$("#googgraphcontainer").show();
	$("#people").css("bottom","300px");
	var merged = new Array();

	countriesValues.forEach(function(d,i){
		merged.push({"name":countriesNames[i], "value":countriesValues[i]});
		console.log(countriesNames);
	})

	console.log(merged);
	merged.sort(function(a, b){
		if( a.value > b.value){
			return -1;
		}
		if( a.value < b.value){
			return 1;
		}
		return 0;
	});
	console.log(merged);

	console.log("Drawing graph");

	var title = currentMovement+" for "+ currentlySelected+" "+currentCategory;
	var vlabel = 'Amount in tousands of dollars';
	var xlabel = 'Top countries'

	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Countries');
	data.addColumn('number', 'Amounts');

	merged.forEach(function(d,i){
		if(i < 48){
			data.addRow( [d.name, d.value]);
		}
	})

	var options = {
		title: title,
		hAxis: {
			title: xlabel,
		},
		vAxis: {
			title: vlabel
		}
	};

	var chart = new google.visualization.ColumnChart(
						document.getElementById('googgraph'));

	chart.draw(data, options);
}