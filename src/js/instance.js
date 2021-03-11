import { validateRequired, eventSchema, eventColorTypeSchema } from './validators';
import { dateFormatParser } from './utils';

export default function createInstance(instanceOptions, datepicker) {
	const instance = {
		datepicker: datepicker,
		el: instanceOptions.el,
		linkedElement: document.querySelector(instanceOptions.el),
		pickedDate: instanceOptions.selectedDate,
		options: instanceOptions,
		onOpenCallbacks: [],
		onCloseCallbacks: [],
		onSelectCallbacks: [],
		onMonthChangeCallbacks: [],
		onYearChangeCallbacks: [],
		markCustomCallbacks: [],
		// Methods
		open: () => {
			datepicker.open(instance.el);
		},
		close: () => {
			datepicker.close();
		},
		reset: () => {
			instance.linkedElement.value = null;
			instance.pickedDate = null;
		},
		destroy: () => {
			datepicker.remove(instance);
		},
		// Event callbacks
		onOpen: (callback = () => {}) => {
			instance.onOpenCallbacks.push(callback);
		},
		onClose: (callback = () => {}) => {
			instance.onCloseCallbacks.push(callback);
		},
		onSelect: (callback) => {
			instance.onSelectCallbacks.push(callback);
		},
		onMonthChange: (callback) => {
			instance.onMonthChangeCallbacks.push(callback);
		},
		onYearChange: (callback) => {
			instance.onYearChangeCallbacks.push(callback);
		},
		// Getters
		getDay: () => {
			return instance.pickedDate.getDay();
		},
		getDate: () => {
			return instance.pickedDate.getDate();
		},
		getMonth: () => {
			return instance.pickedDate.getMonth();
		},
		getYear: () => {
			return instance.pickedDate.getFullYear();
		},
		getFullDate: () => {
			return instance.pickedDate;
		},
		getFormatedDate: () => {
			return dateFormatParser(instance.pickedDate, instance.options, instance.options.dateFormat);
		},
		getEvents: () => {
			return instance.options.events;
		},
		markDatesCustom: (callback) => {
			instance.markCustomCallbacks.push(callback);
		},
		//  Setters
		customizeEvents: (eventsType) => {
			if (!validateRequired(eventsType, eventColorTypeSchema)) return;
			instance.options.eventColorScheme.push(...eventsType);
		},
		addEvents: (events) => {
			if (!validateRequired(events, eventSchema)) return;
			instance.options.events.push(...events);
		}
	};
	return instance;
}
