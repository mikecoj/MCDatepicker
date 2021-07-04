import { viewLayers, defaultTheme } from './defaults';
import { renderCalendar, renderMonthPreview, renderYearPreview } from './render';
import { isActiveMonth, isActiveYear, isLessThanMinDate, isMoreThanMaxDate } from './checker';
import {
	calculateCalendarPosition,
	CalendarStateManager,
	HandleArrowClass,
	dateFormatParser,
	valueOfDate,
	getNewIndex
} from './utils';

export const getDOMNodes = (calendar) => {
	const nodes = {
		calendar,
		calendarDisplay: calendar.querySelector('.mc-display'),
		calendarPicker: calendar.querySelector('.mc-picker'),
		displayDay: calendar.querySelector('.mc-display__day'),
		displayDate: calendar.querySelector('.mc-display__date'),
		displayMonth: calendar.querySelector('.mc-display__month'),
		displayYear: calendar.querySelector('.mc-display__year'),
		accessibilityMonthYear: calendar.querySelector('#mc-picker__month-year'),
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
		previewCells: calendar.querySelectorAll('.mc-month-year__cell'),
		calendarStates: CalendarStateManager(calendar)
	};
	return nodes;
};

export const getViewLayers = (options) => {
	const { dateFormat } = options;
	const splitTest = dateFormat.split(/(?:(?:,\s)|[.-\s\/]{1})/);
	const firstChars = splitTest.map((group) => group.charAt(0).toUpperCase());
	const result = [...new Set(firstChars)].sort().join('');
	return viewLayers[result];
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

export const updatePickedDateValue = (activeInstance, calendarStates) => {
	if (!activeInstance) return;
	const { pickedDate, linkedElement, onSelectCallbacks, options } = activeInstance;
	const { dateFormat } = options;
	let pickedDateValue = pickedDate ? dateFormatParser(pickedDate, options, dateFormat) : null;
	if (linkedElement) linkedElement.value = pickedDateValue;
	onSelectCallbacks.forEach((callback) => callback.apply(null, [pickedDate, pickedDateValue]));
	calendarStates.close();
};

export const updateLinkedInputValue = (instance) => {
	const { pickedDate, linkedElement, options } = instance;
	const { dateFormat } = options;
	if (linkedElement && pickedDate) {
		linkedElement.value = dateFormatParser(pickedDate, options, dateFormat);
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
		calendar.style.removeProperty('top');
		calendar.style.removeProperty('left');
		// if (calendar.hasAttribute('style')) calendar.removeAttribute('style');
	}
};

export const updateNavs = (calendarNodes, instance) => {
	const { monthNavPrev, monthNavNext, yearNavPrev, yearNavNext } = calendarNodes;
	const { store, prevLimitDate, nextLimitDate, options } = instance;
	const { customMonths, jumpToMinMax } = options;
	const viewTarget = store.header.target;
	const currentMonth = store.header.month;
	const currentYear = store.header.year;
	const monthNavPrevState = HandleArrowClass(monthNavPrev);
	const monthNavNextState = HandleArrowClass(monthNavNext);
	const yearNavPrevState = HandleArrowClass(yearNavPrev);
	const yearNavNextState = HandleArrowClass(yearNavNext);

	yearNavPrevState.active();
	yearNavNextState.active();
	monthNavPrevState.active();
	monthNavNextState.active();

	if (viewTarget === 'year') {
		monthNavPrevState.inactive();
		monthNavNextState.inactive();
		prevLimitDate && prevLimitDate.getFullYear() > currentYear - 1 && yearNavPrevState.inactive();
		nextLimitDate && nextLimitDate.getFullYear() < currentYear + 12 && yearNavNextState.inactive();
		return;
	}

	const prevMonth = getNewMonth(instance, customMonths[currentMonth], 'prev');
	const nextMonth = getNewMonth(instance, customMonths[currentMonth], 'next');
	const prevYear = viewTarget !== 'year' && getNewYear(options, currentYear, 'prev');
	const nextYear = viewTarget !== 'year' && getNewYear(options, currentYear, 'next');

	viewTarget === 'calendar' && prevMonth.overlap !== 0 && !prevYear && monthNavPrevState.inactive();
	viewTarget === 'calendar' && prevMonth.overlap !== 0 && !prevYear && yearNavPrevState.inactive();
	viewTarget === 'calendar' && nextMonth.overlap !== 0 && !nextYear && monthNavNextState.inactive();
	viewTarget === 'calendar' && nextMonth.overlap !== 0 && !nextYear && yearNavNextState.inactive();

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
		wDay.setAttribute('aria-label', customWeekDays[nextElement]);
	});
};

export const updateDisplay = (calendarNodes, instance) => {
	const { displayDay, displayDate, displayMonth, displayYear, calendarDisplay } = calendarNodes;
	const { store, options } = instance;
	const { target, date } = store.display;
	const { customWeekDays, customMonths, showCalendarDisplay } = options;

	if (!showCalendarDisplay) {
		calendarDisplay.classList.add('u-display-none');
	} else {
		calendarDisplay.classList.remove('u-display-none');
	}
	calendarDisplay.setAttribute('data-target', store.display.target);
	displayYear.innerText = date.getFullYear();
	if (target === 'year') return;
	displayMonth.innerText = customMonths[date.getMonth()];
	if (target === 'month') return;
	displayDay.innerText = customWeekDays[date.getDay()];
	displayDate.innerText = date.getDate();
};

export const updateCalendarTable = (calendarNodes, instance) => {
	const { dateCells } = calendarNodes;
	const { store, viewLayers } = instance;
	const activeDate = store.calendar.date;

	if (viewLayers[0] !== 'calendar') return;
	// render the new calendar array
	const datesArray = renderCalendar(instance, activeDate);
	// update the DOM for each date cell
	dateCells.forEach((cell, index) => {
		cell.innerText = datesArray[index].dateNumb;
		cell.classList = datesArray[index].classList;
		cell.setAttribute('data-val-date', datesArray[index].date);
		cell.setAttribute('tabindex', datesArray[index].tabindex);
		cell.setAttribute('aria-label', datesArray[index].ariaLabel);
	});
};

export const updateCalendarHeader = (calendarNodes, instance) => {
	const {
		currentMonthSelect,
		currentYearSelect,
		calendarHeader,
		accessibilityMonthYear
	} = calendarNodes;
	const { store, options } = instance;
	const { customMonths } = options;
	const { target, month, year } = store.header;

	calendarHeader.setAttribute('data-target', target);

	updateNavs(calendarNodes, instance);

	if (target === 'year') {
		const firstYear = year;
		currentYearSelect.innerHTML = `<span>${firstYear}</span><span> - </span><span>${
			firstYear + 11
		}</span>`;
		return;
	}
	currentMonthSelect.innerHTML = `<span>${customMonths[month]}</span>`;
	currentYearSelect.innerHTML = `<span>${year}</span>`;
	accessibilityMonthYear.innerText = `${customMonths[month]} ${year}`;
};

export const updateMonthYearPreview = (calendarNodes, instance) => {
	if (!instance) return;
	const { monthYearPreview } = calendarNodes;
	const { target } = instance.store.preview;
	const { year } = instance.store.header;
	if (target === 'calendar')
		return monthYearPreview.classList.remove('mc-month-year__preview--opened');
	monthYearPreview.setAttribute('data-target', target);
	monthYearPreview.classList.add('mc-month-year__preview--opened');
	if (target == 'month') renderMonthPreview(calendarNodes, instance);
	if (target == 'year') renderYearPreview(calendarNodes, instance, year);
};

export const updateMonthSelect = (activeInstance, calendarNodes, arrivalMethod = 'click') => {
	const { store, viewLayers } = activeInstance;
	if (viewLayers[0] === 'month') return;
	const { monthYearPreview } = calendarNodes;
	const isOpened = monthYearPreview.classList.contains('mc-month-year__preview--opened');
	const isMonthTarget = store.preview.target === 'month' ? true : false;
	if (isOpened && isMonthTarget) {
		store.preview.setTarget = viewLayers[0];
		return;
	}
	store.header.setTarget = 'month';
	store.preview.setTarget = 'month';
	if (arrivalMethod == 'keyboard') monthYearPreview.querySelector('[tabindex="0"]').focus();
};
export const updateYearSelect = (activeInstance, calendarNodes, arrivalMethod = 'click') => {
	const { store, viewLayers } = activeInstance;
	if (viewLayers[0] === 'year') return;
	const { monthYearPreview } = calendarNodes;
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
	if (arrivalMethod == 'keyboard') monthYearPreview.querySelector('[tabindex="0"]').focus();
};

const updateCalendarTheme = (calendar, theme) => {
	Object.values(theme).forEach((value) => calendar.style.setProperty(value.cssVar, value.color));
};

export const updateCalendarUI = (calendarNodes, instance) => {
	const { calendar } = calendarNodes;
	const { store, viewLayers, options, pickedDate } = instance;
	const { bodyType, theme } = options;
	const activeDate = getTargetDate(instance);
	const activeYear = activeDate.getFullYear();
	const activeMonth = activeDate.getMonth();
	calendar.classList = 'mc-calendar';
	calendar.classList.add(`mc-calendar--${bodyType}`);
	store.display.target = viewLayers[0];
	store.display.setDate = pickedDate || new Date();
	store.calendar.setDate = activeDate;
	store.header.month = activeMonth;
	store.header.year = viewLayers[0] === 'year' ? activeYear - 4 : activeYear;
	store.preview.month = activeMonth;
	store.preview.year = activeYear;
	store.header.setTarget = viewLayers[0];
	store.preview.setTarget = viewLayers[0];
	updateCalendarTheme(calendar, theme);
	updateWeekdays(calendarNodes, options);
	updateButtons(calendarNodes, options);
	updateCalendarPosition(calendarNodes, instance);
};
