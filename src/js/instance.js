import { validateRequired, eventSchema, eventColorTypeSchema } from './validators';
import { getActiveMonths, getLimitDates, getViewLayers } from './handlers';
import { dateFormatParser, Store } from './utils';

export default function createInstance(datepicker, calendarNodes, instanceOptions) {
	instanceOptions.allowedYears.sort((first, next) => first - next);
	const linkedElement =
		instanceOptions.el !== null ? document.querySelector(instanceOptions.el) : null;
	const activeMonths = getActiveMonths(instanceOptions);
	const { prevLimitDate, nextLimitDate } = getLimitDates(instanceOptions);
	const viewLayers = getViewLayers(instanceOptions);
	const store = Store(calendarNodes, viewLayers[0]);

	const instance = {
		datepicker: datepicker,
		el: instanceOptions.el,
		linkedElement: linkedElement,
		pickedDate: instanceOptions.selectedDate,
		viewLayers: viewLayers,
		activeMonths: activeMonths,
		prevLimitDate: prevLimitDate,
		nextLimitDate: nextLimitDate,
		options: instanceOptions,
		onOpenCallbacks: [],
		onCloseCallbacks: [],
		onSelectCallbacks: [],
		onCancelCallbacks: [],
		onMonthChangeCallbacks: [],
		onYearChangeCallbacks: [],
		markCustomCallbacks: [],
		store: store,
		// Methods
		open: () => {
			datepicker.open(instance);
		},
		close: () => {
			datepicker.close();
		},
		reset: () => {
			instance.pickedDate = null;
			if (instance.linkedElement) instance.linkedElement.value = null;
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
		onCancel: (callback) => {
			instance.onCancelCallbacks.push(callback);
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
