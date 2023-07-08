let libStation = () => {

	let form = $('#form-station');

	let name = $('#txtStationName');

	let employeeName1 = $('#txtEmployeeName1');
	let employeeUsername1 = $('#txtEmployeeUsername1');

	let employeeName2 = $('#txtEmployeeName2');
	let employeeUsername2 = $('#txtEmployeeUsername2');

	const dialogHeight = 500;
	const dialogWidth = 600;

	// -------------------------------------------------------------------------------------------------------------

	let dialog = undefined;
	createCreateDialog();

	// -------------------------------------------------------------------------------------------------------------

	function createStation() {
		if (isNullOrWhiteSpace(name.val())) {
			alert('Name is required')
			return;
		}

		let station = getStationData();
		console.log('station', station);
		station.id = CURRENT_ID++;

		// create a div element to represent the station and make it draggable
		let id = `station${station.id}`;
		let json = toDataAttributeJson(station);
		var element = $(`
			<div id="${id}" class="station" data-json="${json}">
				<p class="station-name">${station.name}</p>
				<p style="margin-top: 5px;">
					<span class="station-employee employeeName1">${station.employeeName1} (<span class="station-username username1">${station.employeeUsername1}</span>)</span>
					<br />					
					<span class="station-employee employeeName2">${station.employeeName2} (<span class="station-username username2">${station.employeeUsername2}</span>)</span>
				</p>
			</div>`);
		element.css('top', '200px');
		element.css('left', '500px');
		$('body').append(element);

		$('#' + id).resizable();

		$('#' + id).draggable();

		$('#' + id).on('dblclick', function () {
			createEditDialog('#' + id);
			mapStationToDialog('#' + id);
			dialog.dialog('open');
		});

		dialog.dialog('close');
	}

	// -------------------------------------------------------------------------------------------------------------

	//
	// called when modal is saved
	//
	function editStation(elementId) {
		// refresh json data
		let station = getStationData();
		let json = toDataAttributeJson(station);
		$(elementId).attr('data-json', json);

		// update name
		$(elementId + ' .station-name').text(station.name);

		let employee1 = `<span class="station-employee employeeName1">${station.employeeName1} <span class="station-username username1">${station.employeeUsername1}</span></span>`;
		$(elementId + ' .employeeName1').html(employee1);

		let employee2 = `<span class="station-employee employeeName2">${station.employeeName2} <span class="station-username username2">${station.employeeUsername2}</span></span>`;
		$(elementId + ' .employeeName2').html(employee2);

		dialog.dialog('close');
	}

	// -------------------------------------------------------------------------------------------------------------

	//
	// called when modal is opened for edit
	//
	function mapStationToDialog(elementId) {
		// get the data
		let json = $(elementId).attr('data-json');
		let data = parseDataAttributeJson(json);

		// map the data
		name.val(data.name);

		employeeName1.val(data.employeeName1);
		employeeUsername1.val(data.employeeUsername1);

		employeeName2.val(data.employeeName2);
		employeeUsername2.val(data.employeeUsername2);
	}

	// -------------------------------------------------------------------------------------------------------------

	function getStationData() {
		let station = {
			name: name.val(),

			employeeName1: employeeName1.val(),
			employeeUsername1: employeeUsername1.val(),

			employeeName2: employeeName2.val(),
			employeeUsername2: employeeUsername2.val()
		};

		return station;
	}


	// -------------------------------------------------------------------------------------------------------------

	$('#create-station').button().on('click', function () {
		createCreateDialog();
		dialog.dialog('open');
	});

	// -------------------------------------------------------------------------------------------------------------

	function createCreateDialog() {
		dialog = $('#dialog-station').dialog({
			autoOpen: false,
			height: dialogHeight,
			width: dialogWidth,
			modal: true,
			buttons: {
				'Create Station': createStation,
				Cancel: function () {
					dialog.dialog('close');
				}
			},
			close: function () {
				form[0].reset();
			},
			open: function () {
				$(this).keydown(function (event) {
					if (event.keyCode === 13) { // Enter key
						$(this).parent().find(".ui-dialog-buttonpane button:eq(0)").trigger("click");
						return false; // Prevent default Enter key behavior
					}
				});
			}
		});
	}

	function createEditDialog(stationElementId) {
		dialog = $('#dialog-station').dialog({
			autoOpen: false,
			height: dialogHeight,
			width: dialogWidth,
			modal: true,
			buttons: {
				'Save': () => { editStation(stationElementId) },
				Cancel: function () {
					dialog.dialog('close');
				}
			},
			close: function () {
				form[0].reset();
			},
			open: function () {
				$(this).keydown(function (event) {
					if (event.keyCode === 13) { // Enter key
						$(this).parent().find(".ui-dialog-buttonpane button:eq(0)").trigger("click");
						return false; // Prevent default Enter key behavior
					}
				});
			}
		});
	}

	// -------------------------------------------------------------------------------------------------------------

	return {
		createStationFromImport: function (station) {
			if (!station) return;

			// create a div element to represent the station and make it draggable
			let id = `station${station.id}`;
			let json = toDataAttributeJson(station);

			var element = $(`
			<div id="${id}" class="station" data-json="${json}">
				<p class="station-name">${station.name}</p>
				<p style="margin-top: 5px;">
					<span class="station-employee employeeName1"><span class="station-username username1"></span></span>
					<br />					
					<span class="station-employee employeeName2"><span class="station-username username2"></span></span>
				</p>
			</div>`);

			if (station.position) {
				if (station.position.top) element.css('top', station.position.top);
				if (station.position.left) element.css('left', station.position.left);
				if (station.position.width) element.css('width', station.position.width);
				if (station.position.height) element.css('height', station.position.height);
			}

			$('body').append(element);

			$('#' + id).resizable();

			$('#' + id).draggable();

			$('#' + id).on('dblclick', function () {
				createEditDialog('#' + id);
				mapStationToDialog('#' + id);
				dialog.dialog('open');
			});
		}
	};

	// -------------------------------------------------------------------------------------------------------------



	// -------------------------------------------------------------------------------------------------------------
};

