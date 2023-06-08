let libEmployee = () => {
	let form = $('#form-employee');
	let name = $('#txtEmployeeName');
	let hasTenure = $('#chkEmployeeTenure');
	let isTraining = $('#chkEmployeeTraining');

	let skillPICK = $('#chkEmployee_PICK');
	let skillPACK = $('#chkEmployee_PACK');
	let skillIB_PS = $('#chkEmployee_IB_PS');
	let skillOB_PS = $('#chkEmployee_OB_PS');
	let skillUTR_STOW = $('#chkEmployee_UTR_STOW');
	let skillDISPATCH_STOW = $('#chkEmployee_DISPATCH_STOW');
	let skillBUFF = $('#chkEmployee_BUFF');
	let skillSTAGE = $('#chkEmployee_STAGE');
	let skillINDUCT = $('#chkEmployee_INDUCT');
	let skillVNA = $('#chkEmployee_VNA');
	let skillIB_OB_DOCK = $('#chkEmployee_IB_OB_DOCK');
	let skillAFM = $('#chkEmployee_AFM');

	// -------------------------------------------------------------------------------------------------------------

	let dialog = undefined;
	createCreateDialog();

	// -------------------------------------------------------------------------------------------------------------

	function createEmployee() {
		if (isNullOrWhiteSpace(name.val())) {
			alert('Name is required')
			return;
		}

		let employee = getEmployeeData();
		employee.id = CURRENT_ID++;

		// create a div element to represent the employee and make it droppable
		let id = `employee${employee.id}`;
		let json = toDataAttributeJson(employee);
		var element = $(`<div id="${id}" class="employee" data-json="${json}"><p>${employee.name}</p></div>`);
		element.css('top', '200px');
		element.css('left', '100px');
		$('body').append(element);

		$('#' + id).resizable();

		$('#' + id).draggable({
			start: function (event, ui) {
				toggleQualifiedStations(employee);
			},
			stop: function (event, ui) {
				resetStations();
			}
		});

		$('#' + id).on('dblclick', function () {
			createEditDialog('#' + id);
			mapEmployeeToDialog('#' + id);
			dialog.dialog('open');
		});

		dialog.dialog('close');
	}

	// -------------------------------------------------------------------------------------------------------------

	function editEmployee(elementId) {
		// refresh json data
		let employee = getEmployeeData();
		let json = toDataAttributeJson(employee);
		$(elementId).attr('data-json', json);

		// update name
		$(elementId + '>p').text(employee.name);

		// update draggable functions
		$(elementId).draggable({
			start: function (event, ui) {
				toggleQualifiedStations(employee);
			},
			stop: function (event, ui) {
				resetStations();
			}
		});

		dialog.dialog('close');
	}

	// -------------------------------------------------------------------------------------------------------------

	function mapEmployeeToDialog(elementId) {
		// get the data
		let json = $(elementId).attr('data-json');
		let data = parseDataAttributeJson(json);

		// map the data
		name.val(data.name);

		hasTenure.prop('checked', data.hasTenure);
		isTraining.prop('checked', data.isTraining);

		skillPICK.prop('checked', data.skillPICK);
		skillPACK.prop('checked', data.skillPACK);
		skillIB_PS.prop('checked', data.skillIB_PS);
		skillOB_PS.prop('checked', data.skillOB_PS);
		skillUTR_STOW.prop('checked', data.skillUTR_STOW);
		skillDISPATCH_STOW.prop('checked', data.skillDISPATCH_STOW);
		skillBUFF.prop('checked', data.skillBUFF);
		skillSTAGE.prop('checked', data.skillSTAGE);
		skillINDUCT.prop('checked', data.skillINDUCT);
		skillVNA.prop('checked', data.skillVNA);
		skillIB_OB_DOCK.prop('checked', data.skillIB_OB_DOCK);
		skillAFM.prop('checked', data.skillAFM);
	}

	// -------------------------------------------------------------------------------------------------------------

	function getEmployeeData() {
		let employee = {
			name: name.val(),
			hasTenure: hasTenure.is(':checked'),
			isTraining: isTraining.is(':checked'),

			skillPICK: skillPICK.is(':checked'),
			skillPACK: skillPACK.is(':checked'),
			skillIB_PS: skillIB_PS.is(':checked'),
			skillOB_PS: skillOB_PS.is(':checked'),
			skillUTR_STOW: skillUTR_STOW.is(':checked'),
			skillDISPATCH_STOW: skillDISPATCH_STOW.is(':checked'),
			skillBUFF: skillBUFF.is(':checked'),
			skillSTAGE: skillSTAGE.is(':checked'),
			skillINDUCT: skillINDUCT.is(':checked'),
			skillVNA: skillVNA.is(':checked'),
			skillIB_OB_DOCK: skillIB_OB_DOCK.is(':checked'),
			skillAFM: skillAFM.is(':checked')
		};
		return employee;
	}

	// -------------------------------------------------------------------------------------------------------------

	$('#create-employee').button().on('click', function () {
		createCreateDialog();
		dialog.dialog('open');
	});

	// -------------------------------------------------------------------------------------------------------------

	function toggleQualifiedStations(employee) {

		let stations = getAllStations();
		stations.forEach(x => {
			let isMatch = isStationMatchForEmployee(employee, x);
			if (isMatch) {
				$(x.element).addClass('station-highlight')
			}
		});
	}

	function isStationMatchForEmployee(employee, station) {
		if (station.data.isTenureRequired && !employee.hasTenure) return false;
		if (!station.data.isTrainingAllowed && employee.isTraining) return false;

		if (station.data.skillPICK && !employee.skillPICK) return false;
		if (station.data.skillPACK && !employee.skillPACK) return false;
		if (station.data.skillIB_PS && !employee.skillIB_PS) return false;
		if (station.data.skillOB_PS && !employee.skillOB_PS) return false;
		if (station.data.skillUTR_STOW && !employee.skillUTR_STOW) return false;
		if (station.data.skillDISPATCH_STOW && !employee.skillDISPATCH_STOW) return false;
		if (station.data.skillBUFF && !employee.skillBUFF) return false;
		if (station.data.skillSTAGE && !employee.skillSTAGE) return false;
		if (station.data.skillINDUCT && !employee.skillINDUCT) return false;
		if (station.data.skillVNA && !employee.skillVNA) return false;
		if (station.data.skillIB_OB_DOCK && !employee.skillIB_OB_DOCK) return false;
		if (station.data.skillAFM && !employee.skillAFM) return false;

		return true;
	}

	// -------------------------------------------------------------------------------------------------------------

	function createCreateDialog() {
		dialog = $('#dialog-employee').dialog({
			autoOpen: false,
			height: 600,
			width: 350,
			modal: true,
			buttons: {
				'Save': createEmployee,
				Cancel: function () {
					dialog.dialog('close');
				}
			},
			close: function () {
				form[0].reset();
			}
		});
	}

	function createEditDialog(employeeElementId) {
		dialog = $('#dialog-employee').dialog({
			autoOpen: false,
			height: 600,
			width: 350,
			modal: true,
			buttons: {
				'Save': () => { editEmployee(employeeElementId) },
				Cancel: function () {
					dialog.dialog('close');
				}
			},
			close: function () {
				form[0].reset();
			}
		});
	}

	// -------------------------------------------------------------------------------------------------------------

	function resetStations() {

		let stations = getAllStations();
		stations.forEach(x =>
			$(x.element).removeClass('station-highlight')
		);
	}

	// -------------------------------------------------------------------------------------------------------------

	return {
		createEmployeeFromImport: function (employee) {
			if (!employee) return;

			// create a div element to represent the employee and make it droppable
			let id = `employee${employee.id}`;
			let json = toDataAttributeJson(employee);
			var element = $(`<div id="${id}" class="employee" data-json="${json}"><p>${employee.name}</p></div>`);

			if (employee.position) {
				if (employee.position.top) element.css('top', employee.position.top);
				if (employee.position.left) element.css('left', employee.position.left);
				if (employee.position.width) element.css('width', employee.position.width);
				if (employee.position.height) element.css('height', employee.position.height);
			}

			$('body').append(element);

			$('#' + id).resizable();

			$('#' + id).draggable({
				start: function (event, ui) {
					toggleQualifiedStations(employee);
				},
				stop: function (event, ui) {
					resetStations();
				}
			});

			$('#' + id).on('dblclick', function () {
				createEditDialog('#' + id);
				mapEmployeeToDialog('#' + id);
				dialog.dialog('open');
			});
		}
	};
	//});
};

