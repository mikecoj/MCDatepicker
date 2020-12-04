export const methods = {
	// methods
	open() {},
	close() {},
	destroy() {},
	// Event Calbacks
	onOpen() {},
	onClose() {},
	onSelect() {},
	onMonthChange() {},
	onYearChange() {},
	// Getters
	getDay() {},
	getDate() {},
	getMonth() {},
	getYear() {},
	getFullDate() {},
	getEvents() {},
	//  Setter
	setEventType() {},
	addEvents() {},
	// ex: function togglePicker() { picker.disabled = !picker.disabled }
	disabled() {}
};

export const eventImportanceDefault = [
	{ type: 'high', color: '#f03048' },
	{ type: 'medium', color: '#008E84' },
	{ type: 'low', color: '#f0d818' },
	{ type: 'slight', color: '#00DDFF' }
];
