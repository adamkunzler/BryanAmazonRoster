let libStation = () => {

	let form = $('#form-station');
	let name = $('#txtStationName');
	let tenure = $('#chkStationTenure');
	let training = $('#chkStationTraining');

	let skillPICK = $('#chkStation_PICK');
	let skillPACK = $('#chkStation_PACK');
	let skillIB_PS = $('#chkStation_IB_PS');
	let skillOB_PS = $('#chkStation_OB_PS');
	let skillUTR_STOW = $('#chkStation_UTR_STOW');
	let skillDISPATCH_STOW = $('#chkStation_DISPATCH_STOW');
	let skillBUFF = $('#chkStation_BUFF');
	let skillSTAGE = $('#chkStation_STAGE');
	let skillINDUCT = $('#chkStation_INDUCT');
	let skillVNA = $('#chkStation_VNA');
	let skillIB_OB_DOCK = $('#chkStation_IB_OB_DOCK');
	let skillAFM = $('#chkStation_AFM');

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
		station.id = CURRENT_ID++;

		// create a div element to represent the station and make it draggable
		let id = `station${station.id}`;
		let json = toDataAttributeJson(station);
		var element = $(`<div id="${id}" class="station" data-json="${json}"><p>${station.name}</p></div>`);
		element.css('top', '200px');
		element.css('left', '500px');
		$('body').append(element);

		$('#' + id).resizable();

		$('#' + id).draggable();

		$('#' + id).droppable(
			{
				drop: function () {
					//alert("I am dropped");
				}
			});

		$('#' + id).on('dblclick', function () {
			createEditDialog('#' + id);
			mapStationToDialog('#' + id);
			dialog.dialog('open');
		});

		dialog.dialog('close');
	}

	// -------------------------------------------------------------------------------------------------------------

	function editStation(elementId) {
		// refresh json data
		let station = getStationData();
		let json = toDataAttributeJson(station);
		$(elementId).attr('data-json', json);

		// update name
		$(elementId + '>p').text(station.name);

		dialog.dialog('close');
	}

	// -------------------------------------------------------------------------------------------------------------

	function mapStationToDialog(elementId) {
		// get the data
		let json = $(elementId).attr('data-json');
		let data = parseDataAttributeJson(json);

		// map the data
		name.val(data.name);

		tenure.prop('checked', data.isTenureRequired);
		training.prop('checked', data.isTrainingAllowed);

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

	function getStationData() {
		let station = {
			name: name.val(),
			isTenureRequired: tenure.is(':checked'),
			isTrainingAllowed: training.is(':checked'),

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
			height: 600,
			width: 350,
			modal: true,
			buttons: {
				'Create Station': createStation,
				Cancel: function () {
					dialog.dialog('close');
				}
			},
			close: function () {
				form[0].reset();
			}
		});
	}

	function createEditDialog(stationElementId) {
		dialog = $('#dialog-station').dialog({
			autoOpen: false,
			height: 600,
			width: 350,
			modal: true,
			buttons: {
				'Save': () => { editStation(stationElementId) },
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

	return {
		createStationFromImport: function (station) {
			if (!station) return;

			// create a div element to represent the station and make it draggable
			let id = `station${station.id}`;
			let json = toDataAttributeJson(station);
			var element = $(`<div id="${id}" class="station" data-json="${json}"><p>${station.name}</p></div>`);

			if (station.position) {
				if (station.position.top) element.css('top', station.position.top);
				if (station.position.left) element.css('left', station.position.left);
				if (station.position.width) element.css('width', station.position.width);
				if (station.position.height) element.css('height', station.position.height);
			}

			$('body').append(element);

			$('#' + id).resizable();

			$('#' + id).draggable();

			$('#' + id).droppable(
				{
					drop: function () {
						//alert("I am dropped");
					}
				});

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

