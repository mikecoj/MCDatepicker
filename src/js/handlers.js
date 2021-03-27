import { renderCalendar } from './render';
import { spanTemplate } from './template';
import {
	arrayInfiniteLooper,
	slide,
	dateFormatParser,
	valueOfDate,
	calculateCalendarPosition,
	HandleArrowClass
} from './utils';
import { CALENDAR_HIDE, CALENDAR_SHOW, CHANGE_MONTH, CHANGE_YEAR, DATE_PICK } from './events';
import {
	dispatchCalendarShow,
	dispatchCalendarHide,
	dispatchChangeMonth,
	dispatchChangeYear,
	dispatchDatePick
} from './emiters';

const getDOMNodes = (calendar) => {
	const calendarDisplay = calendar.querySelector('.mc-display');
	const displayDay = calendar.querySelector('.mc-display__day');
	const displayDate = calendar.querySelector('.mc-display__date');
	const displayMonth = calendar.querySelector('.mc-display__month');
	const displayYear = calendar.querySelector('.mc-display__year');
	const currentMonthSelect = calendar.querySelector('#mc-current--month');
	const currentYearSelect = calendar.querySelector('#mc-current--year');
	const monthNavPrev = calendar.querySelector('#mc-picker__month--prev');
	const monthNavNext = calendar.querySelector('#mc-picker__month--next');
	const yearNavPrev = calendar.querySelector('#mc-picker__year--prev');
	const yearNavNext = calendar.querySelector('#mc-picker__year--next');
	const weekdays = calendar.querySelectorAll('.mc-table__weekday');
	const okButton = calendar.querySelector('#mc-btn__ok');
	const cancelButton = calendar.querySelector('#mc-btn__cancel');
	const clearButton = calendar.querySelector('#mc-btn__clear');
	const dateCells = calendar.querySelectorAll('.mc-date');
	return {
		calendar,
		calendarDisplay,
		displayDay,
		displayDate,
		displayMonth,
		displayYear,
		currentMonthSelect,
		currentYearSelect,
		monthNavPrev,
		monthNavNext,
		yearNavPrev,
		yearNavNext,
		weekdays,
		okButton,
		cancelButton,
		clearButton,
		dateCells
	};
};

const getActiveDate = (pickedDate, minDate, maxDate) => {
	let targetDate = pickedDate === null ? new Date() : pickedDate;
	targetDate =
		minDate !== null && valueOfDate(targetDate) < valueOfDate(minDate) ? minDate : targetDate;
	targetDate =
		maxDate !== null && valueOfDate(targetDate) > valueOfDate(maxDate) ? maxDate : targetDate;
	return targetDate;
};

const updateCalendarPosition = (calendarNodes, instance) => {
	const { calendar } = calendarNodes;
	const { options, linkedElement } = instance;
	const { bodyType } = options;
	if (bodyType === 'inline') {
		const { top, left } = calculateCalendarPosition(calendar, linkedElement);
		calendar.style.top = `${top}px`;
		calendar.style.left = `${left}px`;
	} else {
		if (calendar.hasAttribute('style')) calendar.removeAttribute('style');
	}
};

const updateNavs = (calendarNodes, options, date) => {
	const { monthNavPrev, monthNavNext, yearNavPrev, yearNavNext } = calendarNodes;
	const { minDate, maxDate } = options;
	const currentMonth = date.getMonth();
	const currentYear = date.getFullYear();

	const monthNavPrevState = HandleArrowClass(monthNavPrev);
	const monthNavNextState = HandleArrowClass(monthNavNext);
	const yearNavPrevState = HandleArrowClass(yearNavPrev);
	const yearNavNextState = HandleArrowClass(yearNavNext);

	if (minDate !== null) {
		const minDateValue = valueOfDate(minDate);
		const prevYearLastDay = valueOfDate(new Date(currentYear - 1, currentMonth + 1, 0));
		const currentMonthFirstDay = valueOfDate(new Date(currentYear, currentMonth));
		// check if the minDate is greater than the last day of the same month of the previous year
		minDateValue > prevYearLastDay ? yearNavPrevState.inactive() : yearNavPrevState.active();
		// check if the first day of the current month and year is greater that the minDate
		currentMonthFirstDay > minDateValue ? monthNavPrevState.active() : monthNavPrevState.inactive();
	} else {
		yearNavPrevState.active();
		monthNavPrevState.active();
	}
	if (maxDate !== null) {
		const maxDateValue = valueOfDate(maxDate);
		const currentMonthLastDay = valueOfDate(new Date(currentYear, currentMonth + 1, 0));
		const nextYearFirstDay = valueOfDate(new Date(currentYear + 1, currentMonth, 1));
		// check if maxDate is smaller than the first day of the same month of the next year
		maxDateValue < nextYearFirstDay ? yearNavNextState.inactive() : yearNavNextState.active();
		// check the last day of the current month and year is smaller than maxDate
		currentMonthLastDay < maxDateValue ? monthNavNextState.active() : monthNavNextState.inactive();
	} else {
		// remove the inactive class from the month and year next arrow selectors if the maxDate is null
		yearNavNextState.active();
		monthNavNextState.active();
	}
};

const updateButtons = (calendarNodes, options) => {
	const { customOkLabel, customClearLabel, customCancelLabel } = options;
	const { okButton, clearButton, cancelButton } = calendarNodes;
	okButton.innerText = customOkLabel;
	clearButton.innerText = customClearLabel;
	cancelButton.innerText = customCancelLabel;
};

const updateWeekdays = (calendarNodes, options) => {
	const { weekdays } = calendarNodes;
	const { customWeekDays, firstWeekday } = options;
	weekdays.forEach((wDay, index) => {
		const nextElement = (firstWeekday + index) % customWeekDays.length;
		wDay.innerText = customWeekDays[nextElement].substr(0, 2);
	});
};
const updateDisplay = (calendarNodes, options, pickedDate) => {
	const { displayDay, displayDate, displayMonth, displayYear } = calendarNodes;
	const { customWeekDays, customMonths } = options;
	displayDay.innerText = customWeekDays[pickedDate.getDay()];
	displayDate.innerText = pickedDate.getDate();
	displayMonth.innerText = customMonths[pickedDate.getMonth()];
	displayYear.innerText = pickedDate.getFullYear();
};

const updateCalendarTable = (calendarNodes, instance, date) => {
	const { dateCells } = calendarNodes;
	const { options } = instance;
	// render the new calendar array
	const datesArray = renderCalendar(instance, date);
	// Update clickable navs based on minDate and maxDate
	updateNavs(calendarNodes, options, date);
	// update the DOM for each date cell
	dateCells.forEach((cell, index) => {
		cell.innerText = datesArray[index].dateNumb;
		cell.classList = datesArray[index].classList;
		cell.setAttribute('data-val-date', datesArray[index].date);
	});
};

const updateCalendarHeader = (calendarNodes, options, date) => {
	const { currentMonthSelect, currentYearSelect } = calendarNodes;
	const { customMonths } = options;
	currentMonthSelect.innerHTML = `<span>${customMonths[date.getMonth()]}</span>`;
	currentYearSelect.innerHTML = `<span>${date.getFullYear()}</span>`;
};

const updateCalendarUI = (calendarNodes, instance) => {
	const { options, pickedDate } = instance;
	const { showCalendarDisplay, bodyType, minDate, maxDate } = options;
	const { calendar, calendarDisplay } = calendarNodes;

	calendar.classList = 'mc-calendar';
	// if the picketDate is null, render the calendar based on today's date
	const activeDate = getActiveDate(pickedDate, minDate, maxDate);
	// update the weekdays names
	updateWeekdays(calendarNodes, options);
	// update the buttons labels
	updateButtons(calendarNodes, options);
	// update the calendar table
	updateCalendarTable(calendarNodes, instance, activeDate);
	// update calendar header
	updateCalendarHeader(calendarNodes, options, activeDate);
	// update calendar display UI based on custom options
	if (!showCalendarDisplay) {
		calendarDisplay.classList.add('u-display-none');
	} else {
		calendarDisplay.classList.remove('u-display-none');
	}
	updateDisplay(calendarNodes, options, pickedDate || new Date());
	// update the calendar classlist based on options.bodytype
	calendar.classList.add(`mc-calendar--${bodyType}`);
};

export const applyListeners = (calendarNode, datepickers) => {
	const calendarNodes = getDOMNodes(calendarNode);
	const {
		calendar,
		currentMonthSelect,
		currentYearSelect,
		monthNavPrev,
		monthNavNext,
		yearNavPrev,
		yearNavNext,
		dateCells,
		cancelButton,
		okButton,
		clearButton
	} = calendarNodes;

	let activeCell = null;
	let activeInstance = null;
	let clickable = true;

	// listen for custom events

	calendar.addEventListener(CALENDAR_SHOW, (e) => {
		// get the instance of the input that fired CALENDAR_SHOW event
		activeInstance = datepickers.find(({ el }) => el === e.detail.input);
		// update the calendar display
		updateCalendarUI(calendarNodes, activeInstance);
		// show the calendar
		calendar.classList.add('mc-calendar--opened');
		// update the calendar position based on calendar type
		updateCalendarPosition(calendarNodes, activeInstance);
		// run all custom onOpen callbacks added by the user
		activeInstance.onOpenCallbacks.forEach((callback) => callback.apply(null));
		// get the active cell
		activeCell = calendar.querySelector('.mc-date--picked');
	});
	calendar.addEventListener(CALENDAR_HIDE, (e) => {
		// hide the calendar
		calendar.classList.remove('mc-calendar--opened');
		// delete the style attribute for inline calendar
		if (activeInstance.options.bodyType == 'inline') {
			calendar.removeAttribute('style');
		}
		// run all custom onClose callbacks added by the user
		activeInstance.onCloseCallbacks.forEach((callback) => callback.apply(null));
		// reset the active instance
		activeInstance = null;
	});
	calendar.addEventListener(DATE_PICK, function (e) {
		if (e.target.classList.contains('mc-date--inactive')) return;
		const { options, pickedDate } = activeInstance;
		activeCell !== null && activeCell.classList.remove('mc-date--picked');
		// update the instance picked date
		activeInstance.pickedDate = e.detail.date;
		// update the display
		updateDisplay(calendarNodes, options, activeInstance.pickedDate);
		// update the classlist of the picked cell
		e.target.classList.add('mc-date--picked');
		// add a new activeCell
		activeCell = e.target;
	});

	currentMonthSelect.addEventListener(CHANGE_MONTH, function (e) {
		const { customMonths } = activeInstance.options;
		// check if the button is clickable
		if (!clickable) return;
		// set the button clickable to false
		clickable = !clickable;
		// get the value of active month
		const selectedMonth = e.target.children[0].innerText;
		// get the value of active Year
		const selectedYear = currentYearSelect.children[0].innerText;
		// get the next ot prev month and the overlap value
		const { newElement, overlap } = arrayInfiniteLooper(
			customMonths,
			selectedMonth,
			e.detail.direction
		);

		// add a new span tah with the new month to the months div
		e.target.innerHTML += spanTemplate(e.detail.direction, newElement);

		if (overlap !== 0) {
			// if the overlap is not 0 then calculate the new year
			const newYear = Number(selectedYear) + overlap;
			// add a new span with the new year to the years div
			currentYearSelect.innerHTML += spanTemplate(e.detail.direction, newYear);
			// apply slide animation to years span tags
			slide(currentYearSelect.children[0], currentYearSelect.children[1], e.detail.direction);
		}
		// apply slide animation to months span tags
		slide(e.target.children[0], e.target.children[1], e.detail.direction).then(() => {
			// get new date for the new calendar array
			const nextCalendarDate = new Date(
				currentYearSelect.children[0].innerText,
				customMonths.indexOf(e.target.children[0].innerHTML),
				1
			);
			// update the calendar table
			updateCalendarTable(calendarNodes, activeInstance, nextCalendarDate);
			// get the active cell
			activeCell = calendar.querySelector('.mc-date--picked');
			// run all custom onMonthChangeCallbacks added by the user
			activeInstance.onMonthChangeCallbacks.forEach((callback) => callback.apply(null));

			clickable = !clickable;
		});
	});

	currentYearSelect.addEventListener(CHANGE_YEAR, function (e) {
		if (!clickable) return;
		clickable = !clickable;
		const { customMonths } = activeInstance.options;
		const selectedMonth = currentMonthSelect.children[0].innerText;
		const selectedYear = e.target.children[0].innerText;
		// get the next or prev Year, based on the direction property
		const newYear =
			e.detail.direction === 'next' ? Number(selectedYear) + 1 : Number(selectedYear) - 1;
		// append a new span tag to the targeted div
		e.target.innerHTML += spanTemplate(e.detail.direction, newYear);
		// apply slide animation
		slide(e.target.children[0], e.target.children[1], e.detail.direction).then(() => {
			// TODO: Change the month if the next year is out of min or max date
			// generate a new date based on the current month and new generated year
			const nextCalendarDate = new Date(
				e.target.children[0].innerText,
				customMonths.indexOf(selectedMonth),
				1
			);
			// update the calendar table
			updateCalendarTable(calendarNodes, activeInstance, nextCalendarDate);
			// get the active cell
			activeCell = calendar.querySelector('.mc-date--picked');
			// run every custom callback added by user
			activeInstance.onYearChangeCallbacks.forEach((callback) => callback.apply(null));

			clickable = !clickable;
		});
	});

	// Dispatch custom events

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

	cancelButton.addEventListener('click', (e) => dispatchCalendarHide(e.target));

	okButton.addEventListener('click', (e) => {
		// if the value of picked date is not null then get formated date
		let pickedDateValue =
			activeInstance.pickedDate !== null
				? dateFormatParser(
						activeInstance.pickedDate,
						activeInstance.options,
						activeInstance.options.dateFormat
				  )
				: null;
		// set the value of the picked date to the linked input
		activeInstance.linkedElement.value = pickedDateValue;
		// run all custom onSelect callbacks added by the user
		activeInstance.onSelectCallbacks.forEach((callback) =>
			callback.apply(null, [activeInstance.pickedDate])
		);
		// dispatch DATEPICKER_HIDE event
		dispatchCalendarHide(e.target);
	});

	clearButton.addEventListener('click', () => {
		if (activeCell !== null) {
			activeCell.classList.remove('mc-date--picked');
			activeCell = null;
			activeInstance.pickedDate = null;
			activeInstance.linkedElement.value = null;
		}
	});
};

export const applyOnFocusListener = (calendarDiv, { linkedElement }) => {
	linkedElement.onfocus = (e) => {
		e.preventDefault();
		dispatchCalendarShow(calendarDiv, '#' + linkedElement.id);
	};
};
export const removeOnFocusListener = ({ linkedElement }) => {
	linkedElement.onfocus = null;
};
