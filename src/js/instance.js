// import { validateRequired, eventSchema, eventColorTypeSchema } from './validators';
import { Is } from './validators';
import { dispatchSetDate } from './emiters';
import { defaultTheme } from './defaults';
import { dateFormatParser, Store, uniqueId, themeParser } from './utils';
import { getActiveMonths, getLimitDates, getViewLayers } from './handlers';

export default function createInstance(datepicker, calendarNodes, instanceOptions) {
	instanceOptions.allowedYears.sort((first, next) => first - next);
	const linkedElement =
		instanceOptions.el !== null ? instanceOptions.context.querySelector(instanceOptions.el) : null;
	const activeMonths = getActiveMonths(instanceOptions);
	const { prevLimitDate, nextLimitDate } = getLimitDates(instanceOptions);
	const viewLayers = getViewLayers(instanceOptions);
	const store = Store(calendarNodes, viewLayers[0]);
	const parsedTheme = themeParser(defaultTheme, instanceOptions.theme);
	instanceOptions.theme = parsedTheme;

	return {
		_id: uniqueId(),
		datepicker: datepicker,
		el: instanceOptions.el,
		context: instanceOptions.context,
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
		onClearCallbacks: [],
		onMonthChangeCallbacks: [],
		onYearChangeCallbacks: [],
		markCustomCallbacks: [],
		store: store,
		// Methods
		open() {
			datepicker.open(this._id);
		},
		close() {
			datepicker.close();
		},
		reset() {
			this.pickedDate = null;
			if (this.linkedElement) this.linkedElement.value = null;
		},
		destroy() {
			datepicker.remove(this._id);
		},
		// Event callbacks
		onOpen(callback = () => {}) {
			this.onOpenCallbacks.push(callback);
		},
		onClose(callback = () => {}) {
			this.onCloseCallbacks.push(callback);
		},
		onSelect(callback) {
			this.onSelectCallbacks.push(callback);
		},
		onCancel(callback) {
			this.onCancelCallbacks.push(callback);
		},
		onClear(callback) {
			this.onClearCallbacks.push(callback);
		},
		onMonthChange(callback) {
			this.onMonthChangeCallbacks.push(callback);
		},
		onYearChange(callback) {
			this.onYearChangeCallbacks.push(callback);
		},
		// Getters
		getDay() {
			return this.pickedDate ? this.pickedDate.getDay() : null;
		},
		getDate() {
			return this.pickedDate ? this.pickedDate.getDate() : null;
		},
		getMonth() {
			return this.pickedDate ? this.pickedDate.getMonth() : null;
		},
		getYear() {
			return this.pickedDate ? this.pickedDate.getFullYear() : null;
		},
		getFullDate() {
			return this.pickedDate;
		},
		getFormatedDate() {
			return this.pickedDate
				? dateFormatParser(this.pickedDate, this.options, this.options.dateFormat)
				: null;
		},
		markDatesCustom(callback) {
			this.markCustomCallbacks.push(callback);
		},
		// getEvents: () => {
		// 	return instance.options.events;
		// },

		//  Setters
		setFullDate(date) {
			if (!Is(date).date()) throw new TypeError('Parameter of setFullDate() is not of type date');
			dispatchSetDate(calendarNodes.calendar, { instance: this, date });
		},
		setDate(date) {
			if (!Is(date).number())
				throw new TypeError(`Parameter 'date' of setDate() is not of type number`);
			const newDate = this.pickedDate ? new Date(this.pickedDate) : new Date();
			newDate.setDate(date);
			dispatchSetDate(calendarNodes.calendar, { instance: this, date: newDate });
		},
		setMonth(month) {
			if (!Is(month).number())
				throw new TypeError(`Parameter 'month' of setMonth() is not of type number`);
			const newDate = this.pickedDate ? new Date(this.pickedDate) : new Date();
			newDate.setMonth(month);
			dispatchSetDate(calendarNodes.calendar, { instance: this, date: newDate });
		},
		setYear(year) {
			if (!Is(year).number())
				throw new TypeError(`Parameter 'year' of setYear() is not of type number`);
			const newDate = this.pickedDate ? new Date(this.pickedDate) : new Date();
			newDate.setFullYear(year);
			dispatchSetDate(calendarNodes.calendar, { instance: this, date: newDate });
		}

		// TODO: Add Events Integration
		// customizeEvents: (eventsType) => {
		// 	if (!validateRequired(eventsType, eventColorTypeSchema)) return;
		// 	instance.options.eventColorScheme.push(...eventsType);
		// },
		// addEvents: (events) => {
		// 	if (!validateRequired(events, eventSchema)) return;
		// 	instance.options.events.push(...events);
		// }
	};
}
