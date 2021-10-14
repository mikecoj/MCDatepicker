import { spanTemplate } from './template';
import { Animation } from './utils';
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
	PREVIEW_PICK,
	SET_DATE,
	CANCEL
} from './events';
import {
	dispatchDatePick,
	dispatchChangeMonth,
	dispatchChangeYear,
	dispatchPreviewCellPick,
	dispatchCancel
} from './emiters';

import {
	updateCalendarTable,
	updateCalendarHeader,
	updateMonthYearPreview,
	updateCalendarUI,
	updateDisplay,
	updatePickedDateValue,
	updateLinkedInputValue,
	updateMonthSelect,
	updateYearSelect,
	getTargetDate,
	getNewMonth,
	getNewYear
} from './handlers';

export const applyListeners = (calendarNodes) => {
	let activeInstance = null;
	let clickable = true;
	const {
		calendarStates,
		calendar,
		calendarDisplay,
		calendarPicker,
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

	calendar.addEventListener(CALENDAR_SHOW, (e) => {
		activeInstance = e.detail.instance;
		// update the calendar UI
		updateCalendarUI(calendarNodes, activeInstance);
		// show the calendar
		calendar.classList.add('mc-calendar--opened');

		// calendar.focus();
		// run all custom onOpen callbacks added by the user
		activeInstance.onOpenCallbacks.forEach((callback) => callback.apply(null));
	});

	calendar.addEventListener(CALENDAR_HIDE, () => {
		// calendar.removeEventListener(CALENDAR_SHOW, showFunction);
		const { options, onCloseCallbacks } = activeInstance;
		// hide the calendar
		calendar.classList.remove('mc-calendar--opened');
		// delete the style attribute for inline calendar
		if (options.bodyType == 'inline') calendar.removeAttribute('style');
		// wait for animation to end and remove the --opened class
		// getAnimations(calendar).then(() => {
		// 	store.preview.setTarget = 'calendar';
		// });
		// reset the active instance
		activeInstance = null;
		// run all custom onClose callbacks added by the user
		onCloseCallbacks.forEach((callback) => callback.apply(null));
	});
	calendar.addEventListener(DATE_PICK, (e) => {
		if (!activeInstance) return;
		const { options } = activeInstance;
		const { autoClose, closeOndblclick } = options;

		if (e.target.classList.contains('mc-date--inactive')) return;

		if (e.detail.dblclick) {
			if (!closeOndblclick) return;
			return updatePickedDateValue(activeInstance, calendarStates);
		}

		// update the instance picked date
		activeInstance.pickedDate = e.detail.date;
		// update display store data
		activeInstance.store.display.setDate = e.detail.date;
		// update the classlist of the picked cell
		dateCells.forEach((cell) => cell.classList.remove('mc-date--picked'));
		e.target.classList.add('mc-date--picked');

		if (autoClose) updatePickedDateValue(activeInstance, calendarStates);
	});

	calendar.addEventListener(PREVIEW_PICK, (e) => {
		if (!activeInstance) return;
		const { data, dblclick } = e.detail;
		const { store, options, viewLayers } = activeInstance;
		const { customMonths, autoClose, closeOndblclick } = options;
		const { target } = store.preview;

		if (e.target.classList.contains('mc-month-year__cell--inactive')) return;

		previewCells.forEach((cell) => cell.classList.remove('mc-month-year__cell--picked'));
		e.target.classList.add('mc-month-year__cell--picked');

		if (dblclick && store.preview.target === viewLayers[0]) {
			if (!closeOndblclick) return;
			return updatePickedDateValue(activeInstance, calendarStates);
		}

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

		if (viewLayers[0] !== 'calendar') activeInstance.pickedDate = nextCalendarDate;
		if (viewLayers[0] !== 'calendar') store.display.setDate = nextCalendarDate;
		if (viewLayers[0] === 'calendar') store.calendar.setDate = nextCalendarDate;

		if (autoClose && store.preview.target === viewLayers[0]) {
			return updatePickedDateValue(activeInstance, calendarStates);
		}
		store.preview.setTarget = viewLayers[0];
		store.header.setTarget = viewLayers[0];

		currentMonthSelect.setAttribute('aria-expanded', false);
		currentYearSelect.setAttribute('aria-expanded', false);

		// Return focus to correct location
		if (target == 'month') currentMonthSelect.focus();
		if (target == 'year') currentYearSelect.focus();
	});

	calendar.addEventListener(SET_DATE, (e) => {
		const { instance, date } = e.detail;
		instance.pickedDate = date;
		updateLinkedInputValue(instance);
		if (activeInstance?._id !== instance._id) return;
		const { store } = activeInstance;
		store.display.setDate = date;
		store.calendar.setDate = store.calendar.date;
		if (store.preview.target !== 'calendar') {
			store.preview.month = date.getMonth();
			store.preview.year = date.getFullYear();
			store.preview.setTarget = store.preview.target;
		}
		if (store.header.target === 'month') {
			store.header.month = date.getMonth();
			store.header.year = date.getFullYear();
			store.header.setTarget = store.header.target;
		}
	});

	calendar.addEventListener(
		CALENDAR_UPDATE,
		(e) => activeInstance && updateCalendarTable(calendarNodes, activeInstance)
	);

	document.addEventListener('click', (e) => {
		const targetElement = e.target;
		const isTargetCalendar = calendar.contains(targetElement);
		const isTargetInput = activeInstance?.linkedElement === targetElement;
		if (!isTargetCalendar && !isTargetInput && activeInstance) calendarStates.blur();
	});

	calendar.addEventListener(CANCEL, (e) => {
		if (!activeInstance) return;
		const { onCancelCallbacks } = activeInstance;
		onCancelCallbacks.forEach((callback) => callback.apply(null));
		calendarStates.close();
	});

	calendarDisplay.addEventListener(DISPLAY_UPDATE, (e) => {
		activeInstance && updateDisplay(calendarNodes, activeInstance);
	});

	calendarHeader.addEventListener(
		HEADER_UPDATE,
		(e) => activeInstance && updateCalendarHeader(calendarNodes, activeInstance)
	);

	monthYearPreview.addEventListener(
		PREVIEW_UPDATE,
		(e) => activeInstance && updateMonthYearPreview(calendarNodes, activeInstance)
	);

	currentMonthSelect.addEventListener(CHANGE_MONTH, function (e) {
		// check if the button is clickable
		if (!clickable || !activeInstance) return;
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
		if (!clickable || !activeInstance) return;
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

	currentMonthSelect.addEventListener(
		'click',
		() => activeInstance && updateMonthSelect(activeInstance, calendarNodes)
	);

	currentYearSelect.addEventListener('keydown', (e) => {
		if (e.key == 'Enter') updateMonthSelect(activeInstance, calendarNodes, 'keyboard');
		if (e.key == 'Tab' && !e.shiftKey) {
			// Correct focus order
			e.preventDefault();
			currentYearSelect.focus();
		}
	});

	currentYearSelect.addEventListener(
		'click',
		() => activeInstance && updateYearSelect(activeInstance, calendarNodes)
	);

	currentYearSelect.addEventListener('keydown', (e) => {
		if (e.key == 'Enter') updateYearSelect(activeInstance, calendarNodes, 'keyboard');
		if (e.key == 'Tab') {
			// Correct focus order
			e.preventDefault();
			if (e.shiftKey) return currentMonthSelect.focus();
			monthNavNext.focus();
		}
	});

	// Dispatch custom events
	previewCells.forEach((cell) => {
		cell.addEventListener(
			'click',
			(e) => e.detail === 1 && dispatchPreviewCellPick(e.currentTarget)
		);
		cell.addEventListener(
			'dblclick',
			(e) => e.detail === 2 && dispatchPreviewCellPick(e.currentTarget, true)
		);
		cell.addEventListener(
			'keydown',
			(e) => e.key === 'Enter' && dispatchPreviewCellPick(e.currentTarget)
		);
	});

	// add click event that dispatch a custom DATE_PICK event, to every calendar cell
	dateCells.forEach((cell) => {
		cell.addEventListener('click', (e) => e.detail === 1 && dispatchDatePick(e.target));
		cell.addEventListener('dblclick', (e) => e.detail === 2 && dispatchDatePick(e.target, true));
		cell.addEventListener('keydown', (e) => {
			e.key === 'Enter' && dispatchDatePick(e.target);
			e.key === 'End' && clearButton.focus();
		});
	});

	monthNavPrev.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('mc-select__nav--inactive')) return;
		dispatchChangeMonth(currentMonthSelect, 'prev');
	});

	monthNavNext.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('mc-select__nav--inactive')) return;
		dispatchChangeMonth(currentMonthSelect, 'next');
	});
	monthNavNext.addEventListener('keydown', (e) => {
		// correct focus order
		if (e.key == 'Tab') {
			e.preventDefault();
			if (e.shiftKey) return currentYearSelect.focus();
			calendarHeader.nextElementSibling.querySelector('[tabindex="0"]').focus();
		}
	});

	yearNavPrev.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('mc-select__nav--inactive')) return;
		dispatchChangeYear(currentYearSelect, 'prev');
	});

	yearNavNext.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('mc-select__nav--inactive')) return;
		dispatchChangeYear(currentYearSelect, 'next');
	});

	cancelButton.addEventListener('click', (e) => dispatchCancel(calendar));

	calendarPicker.addEventListener('keyup', (e) => e.key == 'Escape' && dispatchCancel(calendar));

	okButton.addEventListener(
		'click',
		(e) => activeInstance && updatePickedDateValue(activeInstance, calendarStates)
	);

	clearButton.addEventListener('click', (e) => {
		if (!activeInstance) return;
		const { linkedElement, onClearCallbacks } = activeInstance;
		dateCells.forEach((cell) => cell.classList.remove('mc-date--picked'));
		activeInstance.pickedDate = null;
		if (linkedElement) linkedElement.value = null;
		onClearCallbacks.forEach((callback) => callback.apply(null));
	});
};

export const applyOnFocusListener = (instance) => {
	if (!instance.linkedElement) return;
	instance.linkedElement.onfocus = (e) => {
		instance.open();
	};
};
export const removeOnFocusListener = ({ linkedElement }) => {
	if (linkedElement) linkedElement.onfocus = null;
};
