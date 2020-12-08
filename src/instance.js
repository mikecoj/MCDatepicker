import defaultOptions from './defaults.js';

export default function createInstance(customOptions) {
	if (!validOptions(instanceOptions)) throw new Error();
	const instanceOptions = { ...defaultOptions, ...customOptions };
	const instance = {
		el: instanceOptions.el,

		options: instanceOptions,

		open: () => {},
		close: () => {},
		destroy: () => {},
		// Event Calbacks
		onOpen: () => {},
		onClose: () => {},
		onSelect: () => {},
		onMonthChange: () => {},
		onYearChange: () => {},
		// Getters
		getDay: () => {},
		getDate: () => {},
		getMonth: () => {},
		getYear: () => {},
		getFullDate: () => {},
		getEvents: () => {},
		//  Setter
		setEventType: () => {},
		addEvents: () => {}
	};
	return instance;
}
