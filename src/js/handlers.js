import { renderCalendar, renderMonthPreview, renderYearPreview } from './render';

import { isActiveMonth, isActiveYear, isLessThanMinDate, isMoreThanMaxDate } from './checker';

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
	targetDate = minDate !== null && lessThanMinDate ? minDate : targetDate;
	targetDate =
		maxDate !== null && valueOfDate(targetDate) > valueOfDate(maxDate) ? maxDate : targetDate;
	return targetDate;
};

export const getTargetDate = (instance, newDate = null) => {
	const { options, pickedDate, prevLimitDate, nextLimitDate, activeMonths } = instance;
	let targetDate = pickedDate ? pickedDate : new Date();
	const targetMonth = targetDate.getMonth();
	if (!isActiveMonth(options, targetMonth)) {
		const closestMonth = activeMonths.reduce((result, month) => {
			return Math.abs(month.index - targetMonth) < Math.abs(result.index - targetMonth)
				? month
				: result;
		});
		targetDate.setMonth(closestMonth.index);
	}

	if (newDate) targetDate = newDate;
	if (prevLimitDate && isLessThanMinDate(targetDate, prevLimitDate)) targetDate = prevLimitDate;
	if (nextLimitDate && isMoreThanMaxDate(targetDate, nextLimitDate)) targetDate = nextLimitDate;
	return targetDate;
};

export const getNewMonth = (instance, currentMonth, direction) => {
	const { activeMonths, options } = instance;
	const { customMonths, jumpOverDisabled } = options;
	if (!jumpOverDisabled) {
		const { newIndex, overlap } = getNewIndex(
			customMonths,
			customMonths.indexOf(currentMonth),
			direction
		);
		const newMonth = {
			name: customMonths[newIndex],
			index: newIndex
		};
		return { newMonth, overlap };
	}
	const currentMonthIndex = activeMonths.findIndex(({ name }) => name === currentMonth);
	const { newIndex, overlap } = getNewIndex(activeMonths, currentMonthIndex, direction);
	const newMonth = activeMonths[newIndex];
	return { newMonth, overlap };
};

export const getNewYear = (options, currentYear, direction) => {
	const { allowedYears, jumpOverDisabled } = options;
	let newYear = direction === 'next' ? currentYear + 1 : currentYear - 1;

	if (!jumpOverDisabled) return newYear;

	if (allowedYears.length) {
		const { newIndex, overlap } = getNewIndex(
			allowedYears,
			allowedYears.indexOf(currentYear),
			direction
		);
		newYear = overlap !== 0 ? null : allowedYears[newIndex];
		return newYear;
	}

	while (!isActiveYear(options, newYear)) {
		direction === 'next' ? newYear++ : newYear--;
	}
	return newYear;
};
export const getActiveMonths = (options) => {
	const { customMonths } = options;
	return customMonths
		.map((month, index) => {
			if (isActiveMonth(options, index)) return { name: month, index };
			return null;
		})
		.filter((item) => item);
	// return customMonths.filter((month, index) => isActiveMonth(options, index));
};

export const getLimitDates = (options) => {
	const { minDate, maxDate, allowedYears } = options;
	let prevLimitDate = null;
	let nextLimitDate = null;
	const activeMonths = getActiveMonths(options);
	const minMonth = activeMonths[0];
	const maxMonth = activeMonths[activeMonths.length - 1];
	const minYear = allowedYears.length ? Math.min(...allowedYears) : null;
	const maxYear = allowedYears.length ? Math.max(...allowedYears) : null;
	const minAllowedDate = minYear ? new Date(minYear, minMonth.index, 1) : null;
	const maxAllowedDate = maxYear ? new Date(maxYear, maxMonth.index + 1, 0) : null;
	if (minDate && minAllowedDate) prevLimitDate = new Date(Math.max(minDate, minAllowedDate));
	if (maxDate && maxAllowedDate) nextLimitDate = new Date(Math.min(maxDate, maxAllowedDate));
	if (!prevLimitDate) prevLimitDate = minDate ? minDate : minAllowedDate;
	if (!nextLimitDate) nextLimitDate = maxDate ? maxDate : maxAllowedDate;

	return { prevLimitDate, nextLimitDate };
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

export const updateNavs = (calendarNodes, instance, date) => {
	const { monthNavPrev, monthNavNext, yearNavPrev, yearNavNext } = calendarNodes;
	const { prevLimitDate, nextLimitDate, options } = instance;
	const { customMonths, jumpToMinMax } = options;
	const currentMonth = date.getMonth();
	const currentYear = date.getFullYear();
	const prevMonth = getNewMonth(instance, customMonths[currentMonth], 'prev');
	const nextMonth = getNewMonth(instance, customMonths[currentMonth], 'next');
	const prevYear = getNewYear(options, currentYear, 'prev');
	const nextYear = getNewYear(options, currentYear, 'next');
	const monthNavPrevState = HandleArrowClass(monthNavPrev);
	const monthNavNextState = HandleArrowClass(monthNavNext);
	const yearNavPrevState = HandleArrowClass(yearNavPrev);
	const yearNavNextState = HandleArrowClass(yearNavNext);

	yearNavPrevState.active();
	yearNavNextState.active();
	monthNavPrevState.active();
	monthNavNextState.active();

	prevMonth.overlap !== 0 && !prevYear && monthNavPrevState.inactive();
	prevMonth.overlap !== 0 && !prevYear && yearNavPrevState.inactive();
	nextMonth.overlap !== 0 && !nextYear && monthNavNextState.inactive();
	nextMonth.overlap !== 0 && !nextYear && yearNavNextState.inactive();

	if (prevLimitDate) {
		const currentMonthFirstDay = new Date(currentYear, currentMonth, 1);
		const prevYearLastDay = new Date(prevYear, currentMonth + 1, 0);
		const inactivePrevMonth = isLessThanMinDate(currentMonthFirstDay, prevLimitDate);
		const inactivePrevYear = isLessThanMinDate(prevYearLastDay, prevLimitDate);
		if (jumpToMinMax && inactivePrevMonth) yearNavPrevState.inactive();
		if (!jumpToMinMax && (inactivePrevYear || !nextYear)) yearNavPrevState.inactive();
		if (inactivePrevMonth) monthNavPrevState.inactive();
	}
	if (nextLimitDate) {
		const currentMonthLastDay = new Date(currentYear, currentMonth + 1, 0);
		const nextYearFirstDay = new Date(nextYear, currentMonth, 1);
		const inactiveNextMonth = isMoreThanMaxDate(currentMonthLastDay, nextLimitDate);
		const inactiveNextYear = isMoreThanMaxDate(nextYearFirstDay, nextLimitDate);
		if (jumpToMinMax && inactiveNextMonth) yearNavNextState.inactive();
		if (!jumpToMinMax && (inactiveNextYear || !nextYear)) yearNavNextState.inactive();
		if (inactiveNextMonth) monthNavNextState.inactive();
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
	updateNavs(calendarNodes, instance, date);
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

export const updateMonthYearPreview = (calendarNodes, instance) => {
	const { monthYearPreview, currentYearSelect } = calendarNodes;
	const previewTarget = monthYearPreview.getAttribute('data-preview');
	if (previewTarget == 'month') renderMonthPreview(calendarNodes, instance);
	if (previewTarget == 'year') {
		const currentYear = Number(currentYearSelect.children[0].innerHTML);
		renderYearPreview(calendarNodes, instance.options, currentYear - 4);
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
	const activeDate = getTargetDate(instance);
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
	updateMonthYearPreview(calendarNodes, instance);
	// update the calendar classlist based on options.bodytype
	calendar.classList.add(`mc-calendar--${bodyType}`);
};
