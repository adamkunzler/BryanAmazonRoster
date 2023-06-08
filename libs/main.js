let CURRENT_ID = 1;

let employeeLib = undefined;
let stationLib = undefined;

$(document).ready(function () {
	console.log('POC - Roster Board Loaded...');

	employeeLib = libEmployee();
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
	return getAllElementsWithJsonDataByClass('station');
}

function getAllEmployees() {
	return getAllElementsWithJsonDataByClass('employee');
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
		stations: getAllStations().map(x => x.data),
		employees: getAllEmployees().map(x => x.data)
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

	$('.employee').remove();
	$('.station').remove();

	let maxId = -1;

	if (data.employees) {
		data.employees.forEach(x => {
			employeeLib.createEmployeeFromImport(x)

			if (x.id > maxId) maxId = x.id;
		});
	}

	if (data.stations) {
		data.stations.forEach(x => {
			stationLib.createStationFromImport(x)

			if (x.id > maxId) maxId = x.id;
		});
	}

	CURRENT_ID = maxId + 1;
}