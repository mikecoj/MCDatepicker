import { spanTemplate } from './template';
import { arrayInfiniteLooper, slide, dateFormatParser, valueOfDate } from './utils';
import { renderMonthPreview, renderYearPreview } from './render';
import {
	CALENDAR_HIDE,
	CALENDAR_SHOW,
	CHANGE_MONTH,
	CHANGE_YEAR,
	DATE_PICK,
	PREVIEW_PICK
} from './events';
import {
	dispatchCalendarShow,
	dispatchCalendarHide,
	dispatchChangeMonth,
	dispatchChangeYear,
	dispatchDatePick,
	dispatchPreviewCellPick
} from './emiters';

import {
	updateCalendarPosition,
	updateDisplay,
	updateCalendarTable,
	updateCalendarHeader,
	updateMonthYearPreview,
	updateCalendarUI
	// getDOMNodes,
	// getActiveDate,
	// updateNavs,
	// updateButtons,
	// updateWeekdays,
} from './handlers';

export const applyOnFocusListener = (calendarDiv, instance) => {
	instance.linkedElement.onfocus = (e) => {
		e.preventDefault();
		dispatchCalendarShow(calendarDiv, instance);
	};
};
export const removeOnFocusListener = ({ linkedElement }) => {
	linkedElement.onfocus = null;
};

export const applyListeners = (calendarNodes, datepickers) => {
	const {
		calendar,
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

	let activeInstance = null;
	let clickable = true;

	currentMonthSelect.onclick = () => {
		const isOpened = monthYearPreview.classList.contains('mc-month-year__preview--opened');
		const isMonthTarget = monthYearPreview.getAttribute('data-preview') === 'month' ? true : false;
		const isYearTarget = monthYearPreview.getAttribute('data-preview') === 'year' ? true : false;
		renderMonthPreview(calendarNodes, activeInstance.options);
		if (!isOpened) {
			monthYearPreview.setAttribute('data-preview', 'month');
			monthYearPreview.classList.add('mc-month-year__preview--opened');
		}
		if (isOpened && isMonthTarget) {
			monthYearPreview.setAttribute('data-preview', null);
			monthYearPreview.classList.remove('mc-month-year__preview--opened');
		}
		if (isOpened && isYearTarget) monthYearPreview.setAttribute('data-preview', 'month');
	};

	currentYearSelect.onclick = () => {
		const isOpened = monthYearPreview.classList.contains('mc-month-year__preview--opened');
		const isMonthTarget = monthYearPreview.getAttribute('data-preview') === 'month' ? true : false;
		const isYearTarget = monthYearPreview.getAttribute('data-preview') === 'year' ? true : false;
		const currentYear = Number(currentYearSelect.children[0].innerText);
		renderYearPreview(calendarNodes, activeInstance.options, currentYear - 4);
		if (!isOpened) {
			// const { customMonths } = activeInstance.options;
			// const currentMonth = customMonths.indexOf(currentMonthSelect.children[0].innerHTML);
			// const newDate = new Date(currentYear - 4, currentMonth, 1);
			monthYearPreview.setAttribute('data-preview', 'year');
			monthYearPreview.classList.add('mc-month-year__preview--opened');
			// updateCalendarHeader(calendarNodes, activeInstance.options, newDate);
		}
		if (isOpened && isYearTarget) {
			monthYearPreview.setAttribute('data-preview', null);
			monthYearPreview.classList.remove('mc-month-year__preview--opened');
		}
		if (isOpened && isMonthTarget) monthYearPreview.setAttribute('data-preview', 'year');
	};

	// listen for custom events

	calendar.addEventListener(CALENDAR_SHOW, (e) => {
		// get the instance of the input that fired CALENDAR_SHOW event
		activeInstance = datepickers.find(
			(datepicker) => JSON.stringify(datepicker) === JSON.stringify(e.detail.instance)
		);
		// update the calendar display
		updateCalendarUI(calendarNodes, activeInstance);
		// update the calendar position based on calendar type
		updateCalendarPosition(calendarNodes, activeInstance);
		// run all custom onOpen callbacks added by the user
		activeInstance.onOpenCallbacks.forEach((callback) => callback.apply(null));
		// show the calendar
		calendar.classList.add('mc-calendar--opened');
	});
	calendar.addEventListener(CALENDAR_HIDE, () => {
		const { options, onCloseCallbacks } = activeInstance;
		// hide the calendar
		calendar.classList.remove('mc-calendar--opened');
		// delete the style attribute for inline calendar
		if (options.bodyType == 'inline') calendar.removeAttribute('style');
		// run all custom onClose callbacks added by the user
		onCloseCallbacks.forEach((callback) => callback.apply(null));
		// reset the active instance
		activeInstance = null;
		// wait for animation to end and remove the --opened class
		Promise.all(
			calendar.getAnimations({ subtree: true }).map((animation) => animation.finished)
		).then(() => monthYearPreview.classList.remove('mc-month-year__preview--opened'));
	});
	calendar.addEventListener(DATE_PICK, function (e) {
		const { options } = activeInstance;
		if (e.target.classList.contains('mc-date--inactive')) return;
		// update the instance picked date
		activeInstance.pickedDate = e.detail.date;
		// update the display
		updateDisplay(calendarNodes, options, activeInstance.pickedDate);
		// update the classlist of the picked cell
		dateCells.forEach((cell) => cell.classList.remove('mc-date--picked'));
		e.target.classList.add('mc-date--picked');
	});

	calendar.addEventListener(PREVIEW_PICK, (e) => {
		const { target, data } = e.detail;
		const { customMonths } = activeInstance.options;
		if (e.target.classList.contains('mc-month-year__cell--inactive')) return;
		previewCells.forEach((cell) => cell.classList.remove('mc-month-year__cell--picked'));
		e.target.classList.add('mc-month-year__cell--picked');
		const currentYear =
			target === 'month' ? Number(currentYearSelect.children[0].innerHTML) : Number(data);
		const currentMonth =
			target === 'year'
				? currentMonthSelect.children[0].innerHTML
				: customMonths.find((month) => month.includes(data));
		const nextCalendarDate = new Date(currentYear, customMonths.indexOf(currentMonth), 1);
		updateCalendarTable(calendarNodes, activeInstance, nextCalendarDate);
		updateCalendarHeader(calendarNodes, activeInstance.options, nextCalendarDate);
		monthYearPreview.classList.remove('mc-month-year__preview--opened');
	});

	currentMonthSelect.addEventListener(CHANGE_MONTH, function (e) {
		if (!clickable) return;
		clickable = !clickable;
		const { options, onMonthChangeCallbacks } = activeInstance;
		const { customMonths } = options;
		// check if the button is clickable
		const { direction } = e.detail;
		// get the value of active month
		const selectedMonth = e.target.children[0].innerText;
		// get the value of active Year
		const selectedYear = currentYearSelect.children[0].innerText;
		// get the next ot prev month and the overlap value
		const { newElement, overlap } = arrayInfiniteLooper(customMonths, selectedMonth, direction);
		// add a new span tah with the new month to the months div
		e.target.innerHTML += spanTemplate(direction, newElement);

		if (overlap !== 0) {
			// if the overlap is not 0 then calculate the new year
			const newYear = Number(selectedYear) + overlap;
			// add a new span with the new year to the years div
			currentYearSelect.innerHTML += spanTemplate(direction, newYear);
			// apply slide animation to years span tags
			slide(currentYearSelect.children[0], currentYearSelect.children[1], direction);
		}
		// apply slide animation to months span tags
		slide(e.target.children[0], e.target.children[1], direction).then(() => {
			// get new date for the new calendar array
			const nextCalendarDate = new Date(
				currentYearSelect.children[0].innerText,
				customMonths.indexOf(e.target.children[0].innerText),
				1
			);
			// update the calendar table
			updateCalendarTable(calendarNodes, activeInstance, nextCalendarDate);
			updateMonthYearPreview(calendarNodes, options);
			// run all custom onMonthChangeCallbacks added by the user
			onMonthChangeCallbacks.forEach((callback) => callback.apply(null));

			clickable = !clickable;
		});
	});

	currentYearSelect.addEventListener(CHANGE_YEAR, function (e) {
		if (!clickable) return;
		clickable = !clickable;
		const { direction } = e.detail;
		const { options, onMonthChangeCallbacks } = activeInstance;
		const { customMonths, minDate, maxDate } = options;
		const selectedMonth = currentMonthSelect.children[0].innerText;
		const selectedYear = e.target.children[0].innerText;
		const next = direction === 'next' ? true : false;
		const newYear = next ? Number(selectedYear) + 1 : Number(selectedYear) - 1;
		const currentMonthIndex = customMonths.indexOf(currentMonthSelect.children[0].innerHTML);
		const prevDateLastDay = new Date(Number(selectedYear) - 1, currentMonthIndex + 1, 0);
		const nextDateFirstDay = new Date(Number(selectedYear) + 1, currentMonthIndex);
		const lessThanMinDate =
			minDate !== null && !next && valueOfDate(prevDateLastDay) < valueOfDate(minDate);
		const moreThanMaxDate =
			maxDate !== null && next && valueOfDate(maxDate) < valueOfDate(nextDateFirstDay);

		if (lessThanMinDate || moreThanMaxDate) {
			const newActiveDate = (lessThanMinDate && minDate) || (moreThanMaxDate && maxDate);
			const newActiveMonth = newActiveDate.getMonth();
			const newActiveYear = newActiveDate.getFullYear();

			currentMonthSelect.innerHTML += spanTemplate(direction, customMonths[newActiveMonth]);

			if (newActiveYear !== Number(selectedYear)) {
				currentYearSelect.innerHTML += spanTemplate(direction, newActiveYear);
				slide(currentYearSelect.children[0], currentYearSelect.children[1], direction);
			}

			slide(currentMonthSelect.children[0], currentMonthSelect.children[1], direction).then(() => {
				// update the calendar table
				updateCalendarTable(calendarNodes, activeInstance, newActiveDate);
				// run all custom onMonthChangeCallbacks added by the user
				onMonthChangeCallbacks.forEach((callback) => callback.apply(null));

				clickable = !clickable;
			});
			return;
		}
		// append a new span tag to the targeted div

		e.target.innerHTML += spanTemplate(direction, newYear);
		// apply slide animation
		slide(e.target.children[0], e.target.children[1], direction).then(() => {
			// generate a new date based on the current month and new generated year
			const nextCalendarDate = new Date(
				e.target.children[0].innerText,
				customMonths.indexOf(selectedMonth),
				1
			);
			// update the calendar table
			updateCalendarTable(calendarNodes, activeInstance, nextCalendarDate);
			// updateMonthYearPreview(calendarNodes, activeInstance.options);
			// run every custom callback added by user
			activeInstance.onYearChangeCallbacks.forEach((callback) => callback.apply(null));

			clickable = !clickable;
		});
	});

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
		activeInstance.onCancelCallbacks.forEach((callback) => callback.apply(null));
		dispatchCalendarHide(e.target);
	});

	okButton.addEventListener('click', (e) => {
		const { linkedElement, pickedDate, onSelectCallbacks, options } = activeInstance;
		const { dateFormat } = options;
		// if the value of picked date is not null then get formated date
		let pickedDateValue =
			pickedDate !== null ? dateFormatParser(pickedDate, options, dateFormat) : null;
		// set the value of the picked date to the linked input
		if (linkedElement !== null) linkedElement.value = pickedDateValue;
		// run all custom onSelect callbacks added by the user
		onSelectCallbacks.forEach((callback) => callback.apply(null, [activeInstance.pickedDate]));
		// dispatch DATEPICKER_HIDE event
		dispatchCalendarHide(e.target);
	});

	clearButton.addEventListener('click', () => {
		const { linkedElement } = activeInstance;
		dateCells.forEach((cell) => cell.classList.remove('mc-date--picked'));
		activeInstance.pickedDate = null;
		if (linkedElement !== null) linkedElement.value = null;
	});
};
