import { spanTemplate } from './template';
import {
	arrayInfiniteLooper,
	slide,
	dateFormatParser,
	Animation,
	valueOfDate,
	getNewIndex
} from './utils';
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
	updateCalendarUI,
	getTargetDate,
	getNewMonth,
	getNewYear
} from './handlers';

import { isLessThanMinDate, isMoreThanMaxDate } from './checker';

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
	let activeInstance = null;
	let clickable = true;
	const {
		calendar,
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

	currentMonthSelect.onclick = () => {
		const isOpened = monthYearPreview.classList.contains('mc-month-year__preview--opened');
		const isMonthTarget = monthYearPreview.getAttribute('data-preview') === 'month' ? true : false;
		renderMonthPreview(calendarNodes, activeInstance);

		if (isOpened && isMonthTarget) {
			monthYearPreview.setAttribute('data-preview', null);
			monthYearPreview.classList.remove('mc-month-year__preview--opened');
		}
		monthYearPreview.setAttribute('data-preview', 'month');
		calendarHeader.setAttribute('data-view', 'calendar');
		if (!isOpened) monthYearPreview.classList.add('mc-month-year__preview--opened');
	};

	currentYearSelect.onclick = () => {
		const isOpened = monthYearPreview.classList.contains('mc-month-year__preview--opened');
		const isYearTarget = monthYearPreview.getAttribute('data-preview') === 'year' ? true : false;
		const currentYear = Number(currentYearSelect.children[0].innerText);
		renderYearPreview(calendarNodes, activeInstance, currentYear - 4);
		if (isOpened && isYearTarget) {
			monthYearPreview.setAttribute('data-preview', null);
			calendarHeader.setAttribute('data-view', 'calendar');
			monthYearPreview.classList.remove('mc-month-year__preview--opened');
			const newDate = new Date(dateCells[17].getAttribute('data-val-date'));
			updateCalendarHeader(calendarNodes, activeInstance.options, newDate);
			return;
		}
		monthYearPreview.setAttribute('data-preview', 'year');
		calendarHeader.setAttribute('data-view', 'year');
		updateCalendarHeader(calendarNodes, activeInstance.options, currentYear);
		if (!isOpened) monthYearPreview.classList.add('mc-month-year__preview--opened');
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
		).then(() => {
			calendarHeader.setAttribute('data-view', 'calendar');
			monthYearPreview.classList.remove('mc-month-year__preview--opened');
		});
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
		const { options } = activeInstance;
		const { customMonths } = options;

		if (e.target.classList.contains('mc-month-year__cell--inactive')) return;

		previewCells.forEach((cell) => cell.classList.remove('mc-month-year__cell--picked'));
		e.target.classList.add('mc-month-year__cell--picked');

		const currentSelectedYear = Number(currentYearSelect.children[0].innerHTML);
		const targetYear = target === 'year' ? Number(data) : currentSelectedYear;
		const targetMonth = target === 'month' ? data : currentMonthSelect.children[0].innerHTML;
		const currentMonthIndex = customMonths.findIndex((month) => month.includes(targetMonth));
		const newDate = new Date(targetYear, currentMonthIndex, 1);

		const nextCalendarDate = getTargetDate(activeInstance, newDate);

		calendarHeader.setAttribute('data-view', 'calendar');
		updateCalendarTable(calendarNodes, activeInstance, nextCalendarDate);
		updateCalendarHeader(calendarNodes, options, nextCalendarDate);
		monthYearPreview.setAttribute('data-preview', null);
		monthYearPreview.classList.remove('mc-month-year__preview--opened');
	});

	currentMonthSelect.addEventListener(CHANGE_MONTH, function (e) {
		// check if the button is clickable
		if (!clickable) return;
		clickable = !clickable;
		const slider = Animation();
		const { options, onMonthChangeCallbacks, onYearChangeCallbacks } = activeInstance;
		const { direction } = e.detail;
		// get the value of active month
		const selectedMonth = e.target.children[0].innerText;
		// get the value of active Year
		let selectedYear = Number(currentYearSelect.children[0].innerText);
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
			updateCalendarTable(calendarNodes, activeInstance, newCalendarDate);
			updateMonthYearPreview(calendarNodes, activeInstance);
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
			options,
			onMonthChangeCallbacks,
			onYearChangeCallbacks,
			prevLimitDate,
			nextLimitDate
		} = activeInstance;
		const { customMonths } = options;
		const slider = Animation();
		const next = direction === 'next' ? true : false;
		const selectedMonth = currentMonthSelect.children[0].innerText;
		const selectedYear = Number(e.target.children[0].innerText);
		const currentMonthIndex = customMonths.indexOf(selectedMonth);
		const viewTarget = calendarHeader.getAttribute('data-view');

		const newYear = getNewYear(options, selectedYear, direction);

		let newMonth = null;
		let newCalendarDate =
			newYear && getTargetDate(activeInstance, new Date(newYear, currentMonthIndex, 1));
		if (!newYear) newCalendarDate = next ? nextLimitDate : prevLimitDate;
		if (newCalendarDate.getMonth() !== currentMonthIndex)
			newMonth = customMonths[newCalendarDate.getMonth()];

		if (viewTarget === 'year') {
			const firstTableYear = Number(previewCells[0].children[0].innerHTML);
			const targetYear = next ? firstTableYear + 12 : firstTableYear - 12;
			renderYearPreview(calendarNodes, activeInstance, targetYear);
			updateCalendarHeader(calendarNodes, options, targetYear);
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
			updateCalendarTable(calendarNodes, activeInstance, newCalendarDate);
			updateMonthYearPreview(calendarNodes, activeInstance);
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
		onSelectCallbacks.forEach((callback) => callback.apply(null, [pickedDate]));
	});

	clearButton.addEventListener('click', () => {
		const { linkedElement } = activeInstance;
		dateCells.forEach((cell) => cell.classList.remove('mc-date--picked'));
		activeInstance.pickedDate = null;
		if (linkedElement) linkedElement.value = null;
	});
};
