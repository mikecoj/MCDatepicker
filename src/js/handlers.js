import { renderCalendar, renderMonthPreview, renderYearPreview, isActiveMonth } from './render';

import { valueOfDate, calculateCalendarPosition, HandleArrowClass, getNewIndex } from './utils';

export const getDOMNodes = (calendar) => {
	return {
		calendar,
		calendarDisplay: calendar.querySelector('.mc-display'),
		displayDay: calendar.querySelector('.mc-display__day'),
		displayDate: calendar.querySelector('.mc-display__date'),
		displayMonth: calendar.querySelector('.mc-display__month'),
		displayYear: calendar.querySelector('.mc-display__year'),
		calendarHeader: calendar.querySelector('.mc-picker__header'),
		currentMonthSelect: calendar.querySelector('#mc-current--month'),
		currentYearSelect: calendar.querySelector('#mc-current--year'),
		monthNavPrev: calendar.querySelector('#mc-picker__month--prev'),
		monthNavNext: calendar.querySelector('#mc-picker__month--next'),
		yearNavPrev: calendar.querySelector('#mc-picker__year--prev'),
		yearNavNext: calendar.querySelector('#mc-picker__year--next'),
		weekdays: calendar.querySelectorAll('.mc-table__weekday'),
		okButton: calendar.querySelector('#mc-btn__ok'),
		cancelButton: calendar.querySelector('#mc-btn__cancel'),
		clearButton: calendar.querySelector('#mc-btn__clear'),
		dateCells: calendar.querySelectorAll('.mc-date'),
		monthYearPreview: calendar.querySelector('.mc-month-year__preview'),
		previewCells: calendar.querySelectorAll('.mc-month-year__cell')
	};
};

export const getActiveDate = (pickedDate, minDate, maxDate) => {
	let targetDate = pickedDate === null ? new Date() : pickedDate;
	targetDate =
		minDate !== null && valueOfDate(targetDate) < valueOfDate(minDate) ? minDate : targetDate;
	targetDate =
		maxDate !== null && valueOfDate(targetDate) > valueOfDate(maxDate) ? maxDate : targetDate;
	return targetDate;
};

export const getNewMonth = (options, currentMonth, direction) => {
	const { customMonths, jumpOverDisabled } = options;
	// let newYear = Number(currentYear);
	if (!jumpOverDisabled) {
		const { newIndex, overlap } = getNewIndex(
			customMonths,
			customMonths.indexOf(currentMonth),
			direction
		);
		return { newMonth: customMonths[newIndex], overlap };
	}
	const activeMonthsArray = customMonths.filter((month, index) => isActiveMonth(options, index));
	console.log(activeMonthsArray);
	const { newIndex, overlap } = getNewIndex(
		activeMonthsArray,
		activeMonthsArray.indexOf(currentMonth),
		direction
	);
	// if (overlap !== 0) {
	// 	newYear = newYear + overlap;
	// 	isActiveYear();
	// }

	return { newMonth: activeMonthsArray[newIndex], overlap };
};

export const getNewYear = (options, currentYear, direction) => {
	const { allowedYears, jumpOverDisabled } = options;
	if (!jumpOverDisabled) {
		const newYear = Number(currentYear);
		direction === 'next' ? newYear++ : newYear--;
		return newYear;
	}
	if (allowedYears.length) {
		const { newIndex } = getNewIndex(
			allowedYears,
			allowedYears.indexOf(Number(currentYear)),
			direction
		);
		const newYear = allowedYears[newIndex];
		return newYear;
	}
};

export const updateCalendarPosition = (calendarNodes, instance) => {
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

export const updateNavs = (calendarNodes, options, date) => {
	const { monthNavPrev, monthNavNext, yearNavPrev, yearNavNext } = calendarNodes;
	const { minDate, maxDate, jumpToMinMax } = options;
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
		// jumpToMinMax && currentMonthFirstDay > minDateValue
		// 	? yearNavPrevState.active()
		// 	: yearNavPrevState.inactive();
		if (jumpToMinMax) {
			currentMonthFirstDay > minDateValue ? yearNavPrevState.active() : yearNavPrevState.inactive();
		} else {
			minDateValue > prevYearLastDay ? yearNavPrevState.inactive() : yearNavPrevState.active();
		}

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
		if (jumpToMinMax) {
			currentMonthLastDay < maxDateValue ? yearNavNextState.active() : yearNavNextState.inactive();
		} else {
			maxDateValue < nextYearFirstDay ? yearNavNextState.inactive() : yearNavNextState.active();
		}
		// check the last day of the current month and year is smaller than maxDate
		currentMonthLastDay < maxDateValue ? monthNavNextState.active() : monthNavNextState.inactive();
	} else {
		// remove the inactive class from the month and year next arrow selectors if the maxDate is null
		yearNavNextState.active();
		monthNavNextState.active();
	}
};

export const updateButtons = (calendarNodes, options) => {
	const { customOkBTN, customClearBTN, customCancelBTN } = options;
	const { okButton, clearButton, cancelButton } = calendarNodes;
	okButton.innerText = customOkBTN;
	clearButton.innerText = customClearBTN;
	cancelButton.innerText = customCancelBTN;
};

export const updateWeekdays = (calendarNodes, options) => {
	const { weekdays } = calendarNodes;
	const { customWeekDays, firstWeekday } = options;
	weekdays.forEach((wDay, index) => {
		const nextElement = (firstWeekday + index) % customWeekDays.length;
		wDay.innerText = customWeekDays[nextElement].substr(0, 2);
	});
};
export const updateDisplay = (calendarNodes, options, pickedDate) => {
	const { displayDay, displayDate, displayMonth, displayYear } = calendarNodes;
	const { customWeekDays, customMonths } = options;
	displayDay.innerText = customWeekDays[pickedDate.getDay()];
	displayDate.innerText = pickedDate.getDate();
	displayMonth.innerText = customMonths[pickedDate.getMonth()];
	displayYear.innerText = pickedDate.getFullYear();
};

export const updateCalendarTable = (calendarNodes, instance, date) => {
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

export const updateCalendarHeader = (calendarNodes, options, date) => {
	const { currentMonthSelect, currentYearSelect, calendarHeader } = calendarNodes;
	const { customMonths } = options;
	const viewTarget = calendarHeader.getAttribute('data-view');
	if (viewTarget === 'year') {
		const firstYear = date;
		currentYearSelect.innerHTML = `<span>${firstYear}</span><span> - </span><span>${
			firstYear + 11
		}</span>`;
		// currentMonthSelect.style.display = 'none';
		return;
	}
	currentMonthSelect.innerHTML = `<span>${customMonths[date.getMonth()]}</span>`;
	currentYearSelect.innerHTML = `<span>${date.getFullYear()}</span>`;
};

export const updateMonthYearPreview = (calendarNodes, options) => {
	const { monthYearPreview, currentYearSelect } = calendarNodes;
	const previewTarget = monthYearPreview.getAttribute('data-preview');
	if (previewTarget == 'month') renderMonthPreview(calendarNodes, options);
	if (previewTarget == 'year') {
		const currentYear = Number(currentYearSelect.children[0].innerHTML);
		renderYearPreview(calendarNodes, options, currentYear - 4);
	}
	return;
	// monthYearPreview.classList.remove('mc-month-year__preview--opened');
};

export const updateCalendarUI = (calendarNodes, instance) => {
	const { options, pickedDate } = instance;
	const { showCalendarDisplay, bodyType, minDate, maxDate } = options;
	const { calendar, calendarDisplay, calendarHeader } = calendarNodes;
	const viewTarget = calendarHeader.getAttribute('data-view');

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
	if (viewTarget !== 'year') updateCalendarHeader(calendarNodes, options, activeDate);
	if (viewTarget === 'year') updateCalendarHeader(calendarNodes, options, activeDate.getFullYear());
	// update calendar display UI based on custom options
	if (!showCalendarDisplay) {
		calendarDisplay.classList.add('u-display-none');
	} else {
		calendarDisplay.classList.remove('u-display-none');
	}
	updateDisplay(calendarNodes, options, pickedDate || new Date());
	// update month year preview
	updateMonthYearPreview(calendarNodes, options);
	// update the calendar classlist based on options.bodytype
	calendar.classList.add(`mc-calendar--${bodyType}`);
};
