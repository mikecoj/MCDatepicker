import defaultOptions from './defaults';
import createInstance from './instance';
import { writeTemplate } from './render';
import { validateOptions } from './validators';
import { applyOnFocusListener, removeOnFocusListener } from './listeners';

import '../scss/main.scss';

const MCDatepicker = (() => {
	let datepickers = [];
	let calendarNodes = null;

	const initCalendar = (instanceOptions) => {
		if (calendarNodes) return;
		calendarNodes = writeTemplate(instanceOptions);
	};

	const open = (uid) => {
		// find the instance based on it's unique id
		const activeInstance = datepickers.find(({ _id }) => _id === uid);
		if (!activeInstance && !calendarNodes) return;
		calendarNodes.calendarStates.open(activeInstance);
	};

	const close = () => {
		if (!calendarNodes) return;
		const { calendarStates } = calendarNodes;
		calendarStates.close();
	};

	const create = (options = {}) => {
		// validate options and merge them with de default Options
		const instanceOptions = validateOptions(options, defaultOptions);
		// initiate the calendar instance once
		initCalendar(instanceOptions);
		// create instance
		const instance = createInstance(MCDatepicker, calendarNodes, instanceOptions);
		// push fresh created instance to instances array
		datepickers.push(instance);
		// add event listener to the linked input
		applyOnFocusListener(instance);

		return instance;
	};
	const remove = (uid) => {
		// find the instance based on it's unique id
		const instance = datepickers.find(({ _id }) => _id === uid);
		if (!datepickers.length || !instance) return;
		// remove the onFocus listener
		removeOnFocusListener(instance);
		// Remove the instance from the datepickers array
		datepickers.splice(datepickers.indexOf(instance), 1);

		if (!datepickers.length) {
			const { calendar } = calendarNodes;
			calendar.parentNode.removeChild(calendar);
			calendarNodes = null;
		}
	};
	return { create, remove, open, close };
})();
export default MCDatepicker;
