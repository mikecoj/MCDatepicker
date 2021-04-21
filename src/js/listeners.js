import { spanTemplate } from './template';
import { dateFormatParser, Animation } from './utils';
import {
	CALENDAR_HIDE,
	CALENDAR_SHOW,
	CALENDAR_UPDATE,
	DISPLAY_UPDATE,
	PREVIEW_UPDATE,
	HEADER_UPDATE,
	CHANGE_MONTH,
	CHANGE_YEAR,
	DATE_PICK,
	PREVIEW_PICK
} from './events';
import {
	dispatchCalendarShow,
	dispatchCalendarHide,
	dispatchDatePick,
	dispatchChangeMonth,
	dispatchChangeYear,
	dispatchPreviewCellPick
} from './emiters';

import {
	updateCalendarTable,
	updateCalendarHeader,
	updateMonthYearPreview,
	updateCalendarUI,
	updateDisplay,
	getTargetDate,
	getNewMonth,
	getNewYear
} from './handlers';

export const applyListeners = (calendarNodes, datepickers) => {
	let activeInstance = null;
	let clickable = true;
	const {
		calendar,
		calendarDisplay,
		calendarHeader,
		currentMonthSelect,
		currentYearSelect,
		monthYearPreview,
		monthNavPrev,
		monthNavNext,
		yearNavPrev,
		yearNavNext,
		dateCells,
		previewCells,
		cancelButton,
		okButton,
		clearButton
	} = calendarNodes;

	// listen for custom events

	calendar.addEventListener(CALENDAR_SHOW, (e) => {
		// get the instance of the input that fired CALENDAR_SHOW event
		activeInstance = datepickers.find(
			(datepicker) => JSON.stringify(datepicker) === JSON.stringify(e.detail.instance)
		);
		// update the calendar display
		updateCalendarUI(calendarNodes, activeInstance);
		// show the calendar
		calendar.classList.add('mc-calendar--opened');
		// run all custom onOpen callbacks added by the user
		activeInstance.onOpenCallbacks.forEach((callback) => callback.apply(null));
	});

	calendar.addEventListener(CALENDAR_HIDE, () => {
		const { store, options, onCloseCallbacks } = activeInstance;
		// hide the calendar
		calendar.classList.remove('mc-calendar--opened');
		// delete the style attribute for inline calendar
		if (options.bodyType == 'inline') calendar.removeAttribute('style');
		// wait for animation to end and remove the --opened class
		Promise.all(
			calendar.getAnimations({ subtree: true }).map((animation) => animation.finished)
		).then(() => {
			store.preview.setTarget = 'calendar';
			// reset the active instance
			activeInstance = null;
		});
		// run all custom onClose callbacks added by the user
		onCloseCallbacks.forEach((callback) => callback.apply(null));
	});
	calendar.addEventListener(DATE_PICK, (e) => {
		if (e.target.classList.contains('mc-date--inactive')) return;
		// update the instance picked date
		activeInstance.pickedDate = e.detail.date;
		// update display store data
		activeInstance.store.display.setDate = e.detail.date;
		// update the classlist of the picked cell
		dateCells.forEach((cell) => cell.classList.remove('mc-date--picked'));
		e.target.classList.add('mc-date--picked');
	});

	calendar.addEventListener(PREVIEW_PICK, (e) => {
		const { data } = e.detail;
		const { store, options, viewLayers } = activeInstance;
		const { customMonths } = options;
		const { target } = store.preview;

		if (e.target.classList.contains('mc-month-year__cell--inactive')) return;

		previewCells.forEach((cell) => cell.classList.remove('mc-month-year__cell--picked'));
		e.target.classList.add('mc-month-year__cell--picked');

		let targetYear = store.preview.year;
		let targetMonth = customMonths[store.header.month];

		if (viewLayers[0] === 'year') targetMonth = customMonths[0];
		if (target === 'month') targetMonth = data;
		if (target === 'year') targetYear = Number(data);

		const targetMonthIndex = customMonths.findIndex((month) => month.includes(targetMonth));
		const nextCalendarDate = getTargetDate(activeInstance, new Date(targetYear, targetMonthIndex));

		store.header.month = nextCalendarDate.getMonth();
		store.preview.year = nextCalendarDate.getFullYear();
		if (viewLayers[0] !== 'year') store.header.year = nextCalendarDate.getFullYear();
		store.preview.month = nextCalendarDate.getMonth();
		store.display.setDate = nextCalendarDate;
		store.preview.setTarget = viewLayers[0];
		store.header.setTarget = viewLayers[0];

		if (viewLayers[0] !== 'calendar') activeInstance.pickedDate = nextCalendarDate;
		if (viewLayers[0] === 'calendar') store.calendar.setDate = nextCalendarDate;
	});

	calendar.addEventListener(CALENDAR_UPDATE, (e) =>
		updateCalendarTable(calendarNodes, activeInstance)
	);

	calendarDisplay.addEventListener(DISPLAY_UPDATE, (e) => {
		updateDisplay(calendarNodes, activeInstance);
	});

	calendarHeader.addEventListener(HEADER_UPDATE, (e) =>
		updateCalendarHeader(calendarNodes, activeInstance)
	);

	monthYearPreview.addEventListener(PREVIEW_UPDATE, (e) =>
		updateMonthYearPreview(calendarNodes, activeInstance)
	);

	currentMonthSelect.addEventListener(CHANGE_MONTH, function (e) {
		// check if the button is clickable
		if (!clickable) return;
		clickable = !clickable;
		const slider = Animation();
		const {
			store,
			viewLayers,
			options,
			onMonthChangeCallbacks,
			onYearChangeCallbacks
		} = activeInstance;
		const { customMonths } = options;
		const { direction } = e.detail;
		// get the value of active month
		const selectedMonth = customMonths[store.header.month];
		// get the value of active Year
		let selectedYear = store.header.year;
		// get the next ot prev month and the overlap value
		const { newMonth, overlap } = getNewMonth(activeInstance, selectedMonth, direction);
		const newYear = overlap !== 0 ? getNewYear(options, selectedYear, direction) : selectedYear;
		const newCalendarDate = new Date(newYear, newMonth.index, 1);
		// add a new span tah with the new month to the months div
		if (overlap !== 0) {
			// add a new span with the new year to the years div
			currentYearSelect.innerHTML += spanTemplate(direction, newYear);
			// apply slide animation to years span tags
			slider.slide(currentYearSelect.children[0], currentYearSelect.children[1], direction);
			onYearChangeCallbacks.forEach((callback) => callback.apply(null));
		}

		e.target.innerHTML += spanTemplate(direction, newMonth.name);
		// apply slide animation to months span tags
		slider.slide(e.target.children[0], e.target.children[1], direction);

		slider.onFinish(() => {
			// update the calendar table
			if (viewLayers[0] === 'calendar') store.calendar.setDate = newCalendarDate;
			if (viewLayers[0] !== 'calendar') store.display.setDate = newCalendarDate;
			if (viewLayers[0] === 'month') activeInstance.pickedDate = newCalendarDate;
			store.header.year = newCalendarDate.getFullYear();
			store.header.setMonth = newCalendarDate.getMonth();
			store.preview.year = newCalendarDate.getFullYear();
			store.preview.setMonth = newCalendarDate.getMonth();
			// run all custom onMonthChangeCallbacks added by the user
			onMonthChangeCallbacks.forEach((callback) => callback.apply(null));

			clickable = !clickable;
		});
	});

	currentYearSelect.addEventListener(CHANGE_YEAR, function (e) {
		if (!clickable) return;
		clickable = !clickable;
		const { direction } = e.detail;
		const {
			store,
			viewLayers,
			options,
			onMonthChangeCallbacks,
			onYearChangeCallbacks,
			prevLimitDate,
			nextLimitDate
		} = activeInstance;
		const { customMonths } = options;
		const slider = Animation();
		const next = direction === 'next' ? true : false;
		const selectedYear = store.header.year;
		const currentMonthIndex = store.header.month;
		const viewTarget = store.header.target;
		const newYear = getNewYear(options, selectedYear, direction);

		let newMonth = null;
		let newCalendarDate =
			newYear && getTargetDate(activeInstance, new Date(newYear, currentMonthIndex, 1));
		if (!newYear) newCalendarDate = next ? nextLimitDate : prevLimitDate;
		if (newCalendarDate.getMonth() !== currentMonthIndex)
			newMonth = customMonths[newCalendarDate.getMonth()];

		if (viewTarget === 'year') {
			const firstTableYear = store.header.year;
			const targetYear = next ? firstTableYear + 12 : firstTableYear - 12;
			store.header.setYear = targetYear;
			store.preview.setTarget = 'year';
			clickable = !clickable;
			return;
		}

		if (newMonth) {
			currentMonthSelect.innerHTML += spanTemplate(direction, newMonth);
			slider.slide(currentMonthSelect.children[0], currentMonthSelect.children[1], direction);
			onMonthChangeCallbacks.forEach((callback) => callback.apply(null));
		}
		if (newYear) {
			e.target.innerHTML += spanTemplate(direction, newYear);
			slider.slide(e.target.children[0], e.target.children[1], direction);
			onYearChangeCallbacks.forEach((callback) => callback.apply(null));
		}
		slider.onFinish(() => {
			if (viewLayers[0] === 'calendar') store.calendar.setDate = newCalendarDate;
			if (viewLayers[0] !== 'calendar') store.display.setDate = newCalendarDate;
			if (viewLayers[0] !== 'calendar') activeInstance.pickedDate = newCalendarDate;
			store.preview.year = newCalendarDate.getFullYear();
			store.preview.setMonth = newCalendarDate.getMonth();
			store.header.year = newCalendarDate.getFullYear();
			store.header.setMonth = newCalendarDate.getMonth();
			clickable = !clickable;
		});
	});

	currentMonthSelect.onclick = () => {
		const { store, viewLayers } = activeInstance;
		if (viewLayers[0] === 'month') return;
		const isOpened = monthYearPreview.classList.contains('mc-month-year__preview--opened');
		const isMonthTarget = store.preview.target === 'month' ? true : false;
		if (isOpened && isMonthTarget) {
			store.preview.setTarget = viewLayers[0];
		}
		store.header.setTarget = 'month';
		store.preview.setTarget = 'month';
	};

	currentYearSelect.onclick = () => {
		const { store, viewLayers } = activeInstance;
		if (viewLayers[0] === 'year') return;
		const isOpened = monthYearPreview.classList.contains('mc-month-year__preview--opened');
		const currentTarget = store.preview.target;
		const isYearTarget = currentTarget === 'year' ? true : false;
		if (isOpened && isYearTarget) {
			store.header.year = store.preview.year;
			store.preview.setTarget = viewLayers[0];
			store.header.setTarget = viewLayers[0];
			return;
		}
		store.header.year = store.preview.year - 4;
		store.header.setTarget = 'year';
		store.preview.setTarget = 'year';
	};

	// Dispatch custom events

	previewCells.forEach((cell) =>
		cell.addEventListener('click', (e) => dispatchPreviewCellPick(e.currentTarget))
	);
	// add click event that dispatch a custom DATE_PICK event, to every calendar cell
	dateCells.forEach((cell) => cell.addEventListener('click', (e) => dispatchDatePick(e.target)));

	monthNavPrev.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('mc-select__nav--inactive')) return;
		dispatchChangeMonth(currentMonthSelect, 'prev');
	});

	monthNavNext.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('mc-select__nav--inactive')) return;
		dispatchChangeMonth(currentMonthSelect, 'next');
	});

	yearNavPrev.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('mc-select__nav--inactive')) return;
		dispatchChangeYear(currentYearSelect, 'prev');
	});

	yearNavNext.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('mc-select__nav--inactive')) return;
		dispatchChangeYear(currentYearSelect, 'next');
	});

	cancelButton.addEventListener('click', (e) => {
		const { onCancelCallbacks } = activeInstance;
		dispatchCalendarHide(e.target);
		onCancelCallbacks.forEach((callback) => callback.apply(null));
	});

	okButton.addEventListener('click', (e) => {
		const { linkedElement, pickedDate, onSelectCallbacks, options } = activeInstance;
		const { dateFormat } = options;
		// if the value of picked date is not null then get formated date
		let pickedDateValue = pickedDate ? dateFormatParser(pickedDate, options, dateFormat) : null;
		// set the value of the picked date to the linked input
		if (linkedElement) linkedElement.value = pickedDateValue;
		// dispatch DATEPICKER_HIDE event
		dispatchCalendarHide(e.target);
		// run all custom onSelect callbacks added by the user
		onSelectCallbacks.forEach((callback) => callback.apply(null, [pickedDate, pickedDateValue]));
	});

	clearButton.addEventListener('click', () => {
		const { linkedElement } = activeInstance;
		dateCells.forEach((cell) => cell.classList.remove('mc-date--picked'));
		activeInstance.pickedDate = null;
		if (linkedElement) linkedElement.value = null;
	});
};

export const applyOnFocusListener = (calendarDiv, instance) => {
	instance.linkedElement.onfocus = (e) => {
		e.preventDefault();
		dispatchCalendarShow(calendarDiv, instance);
	};
};
export const removeOnFocusListener = ({ linkedElement }) => {
	linkedElement.onfocus = null;
};
