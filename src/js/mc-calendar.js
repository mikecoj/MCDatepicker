import defaultOptions from './defaults';
import createInstance from './instance';
import { writeTemplate } from './render';
import { validateOptions } from './validators';
import { dispatchCalendarShow, dispatchCalendarHide } from './emiters';
import { applyOnFocusListener, removeOnFocusListener } from './listeners';

import '../scss/main.scss';

const MCDatepicker = (() => {
	let datepickers = [];
	let calendarNodes = null;

	const initCalendar = () => {
		if (calendarNodes) return;
		calendarNodes = writeTemplate(datepickers);
	};

	const open = (instance) => {
		const { calendar } = calendarNodes;
		dispatchCalendarShow(calendar, instance);
	};

	const close = () => {
		const { calendar } = calendarNodes;
		dispatchCalendarHide(calendar);
	};

	const create = (options = {}) => {
		// initiate the calendar instance once
		initCalendar();
		// validate options and merge them with de default Options
		const instanceOptions = validateOptions(options, defaultOptions);
		// create instance
		const instance = createInstance(MCDatepicker, calendarNodes, instanceOptions);
		// push fresh created instance to instances array
		datepickers.push(instance);
		// add event listener to the linked input
		applyOnFocusListener(calendarNodes.calendar, instance);

		return instance;
	};
	const remove = (instance) => {
		if (!datepickers.length) return;
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
