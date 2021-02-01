import defaultOptions from './defaults.js';
import { validateRequired, eventSchema, eventColorTypeSchema } from './validators.js';

export default function createInstance(instanceOptions, datepicker) {
	// const instanceOptions = validateOptions(defaultOptions, customOptions);
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

		open: () => {
			datepicker.open(instance.el);
		},
		close: () => {
			datepicker.close(instance.el);
		},
		destroy: () => {
			datepicker.remove(instance.el);
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
		getFullDate: () => {},
		getEvents: () => {
			return instance.options.events;
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

//     customizeEvents: (eventsType) => {
// 			if (!validateRequired(eventsType, eventColorTypeSchema)) return;
// 			const requestedParameters = ['type', 'color'];
// 			const validFormat = eventsType.every((event) => {
// 				Object.keys(event).every((key) => requestedParameters.includes(key));
// 			});
// 			if (validFormat) {
// 				this.eventColorScheme.concat(eventsType);
// 			} else throw new Error('Invalid Event Color Scheme Format');
// 		},
// 		addEvents: ([...events]) => {
// 			const requestedParameters = ['date', 'title', 'description'];
// 			const validFormat = events.every((event) => {
// 				Object.keys(event).every((key) => requestedParameters.includes(key));
// 			});
// 			if (validFormat) {
// 				this.events.concat(events);
// 			} else throw new Error('Invalid Event Format');
// 		}
