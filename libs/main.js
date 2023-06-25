let CURRENT_ID = 1;

let stationLib = undefined;

$(document).ready(function () {
	console.log('POC - Roster Board Loaded...');

	stationLib = libStation();

	$('#export-data').on('click', function () {
		exportData();
	});

	$('#import-data').on('click', function () {
		$('#fileImport').click();
		$('#fileImport').change(function (event) {
			var file = event.target.files[0];
			var reader = new FileReader();
			reader.onload = function (e) {
				var contents = e.target.result;

				let json = contents;
				let obj = JSON.parse(json);
				importData(obj);
			};
			reader.readAsText(file);
		});
	});
});

function isNullOrWhiteSpace(input) {
	return input === null || input.trim() === '';
}

function toDataAttributeJson(obj) {
	var json = JSON.stringify(obj).replaceAll('"', '\'');
	return json;
}

function parseDataAttributeJson(val) {
	let obj = JSON.parse(val.replaceAll('\'', '"'));
	return obj;
}

function getAllStations() {
	let stations = getAllElementsWithJsonDataByClass('station');

	// don't export employee names
	stations.forEach(x => {
		x.data.employeeName1 = undefined;
		x.data.employeeUsername1 = undefined;
		x.data.employeeName2 = undefined;
		x.data.employeeUsername2 = undefined;
	});
	return stations;
}

function getAllElementsWithJsonDataByClass(cssClass) {
	let elements = Array.from($('.' + cssClass));

	var objs = [];

	elements.forEach(element => {
		let json = $(element).attr('data-json');
		let data = parseDataAttributeJson(json);

		// for kicks...lets add position data to our object (used in export)
		data.position = {
			top: $(element).css('top'),
			left: $(element).css('left'),
			width: $(element).css('width'),
			height: $(element).css('height')
		};


		objs.push({
			element: element,
			data: data
		});
	});

	return objs;
}

function exportData() {
	let data = {
		stations: getAllStations().map(x => x.data)
	};

	let json = JSON.stringify(data);

	const link = document.createElement("a");

	const file = new Blob([json], { type: 'application/json' });
	link.href = URL.createObjectURL(file);
	link.download = "rosterBoard-export.json";
	link.click();
	URL.revokeObjectURL(link.href);
}

function importData(data) {
	if (!data) return;

	$('.station').remove();

	let currentId = 1;

	if (data.stations) {
		data.stations.forEach(x => {
			x.id = currentId++;
			stationLib.createStationFromImport(x);
		});
	}

	CURRENT_ID = currentId + 1;
}