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

		open: () => {
			datepicker.open(this.el);
		},
		close: () => {
			datepicker.close(this.el);
		},
		destroy: () => {
			datepicker.remove(this.el);
		},
		// Event Calbacks
		onOpen: () => {},
		onClose: () => {},
		onSelect: () => {},
		onMonthChange: () => {},
		onYearChange: () => {},
		// Getters
		getDay: () => {
			return this.pickedDate.getDay();
		},
		getDate: () => {
			return this.pickedDate.getDate();
		},
		getMonth: () => {
			return this.pickedDate.getMonth();
		},
		getYear: () => {
			return this.pickedDate.getFullYear();
		},
		getFullDate: () => {},
		getEvents: () => {
			return this.options.events;
		},
		//  Setters
		customizeEvents: (eventsType) => {
			if (!validateRequired(eventsType, eventColorTypeSchema)) return;
			this.eventColorScheme.push(...eventsType);
		},
		addEvents: (events) => {
			if (!validateRequired(events, eventSchema)) return;
			this.events.push(...events);
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
