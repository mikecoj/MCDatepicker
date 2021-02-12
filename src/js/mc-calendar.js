import { noop } from './utils';
import defaultOptions from './defaults';
import { applyOnFocusListener, removeOnFocusListener } from './handlers';
import createInstance from './instance';
import { validateOptions } from './validators';
import { writeTemplate } from './render';
import { dispatchCalendarShow, dispatchCalendarHide } from './emiters';

import '../scss/main.scss';

const MCDatepicker = (() => {
	let datepickers = [];
	let calendarDiv = null;

	let initCalendar = () => {
		initCalendar = noop;
		calendarDiv = writeTemplate(datepickers);
	};

	const open = (el) => {
		dispatchCalendarShow(calendarDiv, el);
	};

	const close = () => {
		dispatchCalendarHide(calendarDiv);
	};

	const create = (options = {}) => {
		// initiate the calendar instance once
		initCalendar();
		// validate options and merge them with de default Options
		const instanceOptions = validateOptions(options, defaultOptions);
		// create instance
		const instance = createInstance(instanceOptions, MCDatepicker);
		// push fresh created instance to instances array
		datepickers.push(instance);
		// add event listener to the linked input
		applyOnFocusListener(calendarDiv, instance);

		return instance;
	};
	const remove = (instance) => {
		// remove the onFocus listener
		removeOnFocusListener(instance);
		// Remove the instance from the datepickers array
		datepickers.splice(datepickers.indexOf(instance), 1);
	};
	return { create, remove, open, close };
})();
export default MCDatepicker;
