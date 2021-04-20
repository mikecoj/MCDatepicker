import { noop } from './utils';
import defaultOptions from './defaults';
import { applyOnFocusListener, removeOnFocusListener } from './listeners';
import createInstance from './instance';
import { validateOptions } from './validators';
import { writeTemplate } from './render';
import { dispatchCalendarShow, dispatchCalendarHide } from './emiters';

import '../scss/main.scss';

const MCDatepicker = (() => {
	let datepickers = [];
	let calendarNodes = null;

	let initCalendar = () => {
		initCalendar = noop;
		calendarNodes = writeTemplate(datepickers);
	};

	const open = (el) => {
		const { calendar } = calendarNodes;
		dispatchCalendarShow(calendar, el);
	};

	const close = () => {
		const { calendar } = calendarNodes;
		dispatchCalendarHide(calendar);
	};

	const create = (options = {}) => {
		// initiate the calendar instance once
		initCalendar();
		const { calendar } = calendarNodes;
		// validate options and merge them with de default Options
		const instanceOptions = validateOptions(options, defaultOptions);
		// create instance
		const instance = createInstance(MCDatepicker, calendarNodes, instanceOptions);
		// push fresh created instance to instances array
		datepickers.push(instance);
		// add event listener to the linked input
		if (options.hasOwnProperty('el')) {
			applyOnFocusListener(calendar, instance);
		}

		return instance;
	};
	const remove = (instance) => {
		// remove the onFocus listener
		if (options.hasOwnProperty('el')) {
			removeOnFocusListener(instance);
		}
		// Remove the instance from the datepickers array
		datepickers.splice(datepickers.indexOf(instance), 1);
	};
	return { create, remove, open, close };
})();
export default MCDatepicker;
