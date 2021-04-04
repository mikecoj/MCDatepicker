import template from './template';
import { valueOfDate } from './utils';
import { applyListeners } from './listeners';
import { getDOMNodes } from './handlers';

const dayObj = (dateVal = null) => {
	return {
		date: dateVal,
		day: dateVal.getDay(),
		dateNumb: dateVal.getDate(),
		month: dateVal.getMonth(),
		classList: []
	};
};

const getCalendarArray = (options, firstMonthDate) => {
	let calendarArray = [];
	// get the day of the first date of the first table cell
	const { firstWeekday } = options;
	const wDay = firstMonthDate.getDay();
	const wDays = 7;
	const offset = (firstWeekday - wDays) % wDays;
	let firstCalendarDate = ((wDay - offset - 1) * -1) % wDays;
	firstCalendarDate = firstCalendarDate > -6 ? firstCalendarDate : 1;
	// generate the calendar array
	while (calendarArray.length < 42) {
		// regenerate date object based on first active month day
		let modifiableDate = new Date(firstMonthDate);
		// generate a new date based on the iteration of the first calendar day
		let newDate = new Date(modifiableDate.setDate(firstCalendarDate++));
		calendarArray.push(dayObj(newDate));
	}
	return calendarArray;
};

export const renderMonthPreview = (calendarNodes, options) => {
	const { currentMonthSelect, currentYearSelect, previewCells } = calendarNodes;
	const { customMonths, minDate, maxDate, allowMonths, disableMonths } = options;
	const currentMonth = currentMonthSelect.children[0].innerHTML;
	const selectedYear = currentYearSelect.children[0].innerHTML;
	const isDisabledMonth = (monthTarget) =>
		disableMonths.includes(customMonths.indexOf(monthTarget));
	const isAllowedMonth = (monthTarget) => allowMonths.includes(customMonths.indexOf(monthTarget));
	const monthPreviewArray = customMonths.map((month, index) => {
		let monthClasslist = ['mc-month-year__cell'];
		const firstMonthDate = new Date(Number(selectedYear), customMonths.indexOf(month));
		const lastMonthDate = new Date(Number(selectedYear), customMonths.indexOf(month) + 1, 0);
		const lessThanMinDate = minDate !== null && valueOfDate(lastMonthDate) < valueOfDate(minDate);
		const moreThanMaxDate = maxDate !== null && valueOfDate(firstMonthDate) > valueOfDate(maxDate);

		if (month === currentMonth) monthClasslist.push('mc-month-year__cell--picked');
		if (lessThanMinDate || moreThanMaxDate || isDisabledMonth(month)) {
			monthClasslist.push('mc-month-year__cell--inactive');
		}

		previewCells[index].classList = monthClasslist.join(' ');
		previewCells[index].innerHTML = `<span>${month.substr(0, 3)}</span>`;
	});
};

export const renderYearPreview = (calendarNodes, options, year) => {
	const { currentYearSelect, previewCells } = calendarNodes;
	const { minDate, maxDate, disableYears, allowYears } = options;
	const minYear = minDate && minDate.getFullYear();
	const maxYear = maxDate && maxDate.getFullYear();
	const currentYear = Number(currentYearSelect.children[0].innerHTML);
	const isDisabledYear = (yearTarget) => disableYears.includes(yearTarget);
	const isAllowedYear = (yearTarget) => allowYears.includes(yearTarget);
	previewCells.forEach((cell, index) => {
		let yearClasslist = ['mc-month-year__cell'];
		let customYear = year + index;
		const lessThanMinYear = minDate !== null && customYear < minYear;
		const moreThanMaxYear = maxDate !== null && customYear > maxYear;
		if (customYear === currentYear) yearClasslist.push('mc-month-year__cell--picked');
		if (lessThanMinYear || moreThanMaxYear || isDisabledYear(customYear)) {
			yearClasslist.push('mc-month-year__cell--inactive');
		}
		cell.classList = yearClasslist.join(' ');
		cell.innerHTML = `<span>${customYear}</span>`;
	});
};

export const renderCalendar = (instance, date) => {
	const { options, pickedDate } = instance;
	// get the first day of the month
	const firstMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);
	// get the month
	const activeMonth = firstMonthDate.getMonth();

	const isSelectable = (options, dayObject) => {
		const { minDate, maxDate } = options;
		const { date } = dayObject;
		const smallerTanMin = minDate !== null ? valueOfDate(date) < valueOfDate(minDate) : false;
		const biggerTanMax = maxDate !== null ? valueOfDate(maxDate) < valueOfDate(date) : false;
		return smallerTanMin || biggerTanMax;
	};

	const isInActiveMonth = (activeMonth, dayObject) => {
		const { month } = dayObject;
		return month !== activeMonth ? false : true;
	};

	const isExcludedWeekend = (options, dayObject) => {
		const { disableWeekends } = options;
		const { day } = dayObject;
		if (!disableWeekends) return false;
		return day === 0 || day === 6 ? true : false;
	};

	const isDisabledWeekDay = (options, dayObject) => {
		const { disableWeekDays } = options;
		const { day } = dayObject;
		if (!disableWeekDays.length) return false;
		return disableWeekDays.some((weekDay) => weekDay === day);
	};

	const isDisabledDate = (options, dayObject) => {
		const { disableDates } = options;
		const { date } = dayObject;
		if (!disableDates.length) return false;
		return disableDates.some((disabledDate) => valueOfDate(disabledDate) === valueOfDate(date));
	};

	const isPicked = (pickedDate, dayObject) => {
		const { date } = dayObject;
		// instance.selectedDate;
		if (pickedDate === null) return false;

		return valueOfDate(pickedDate) === valueOfDate(date) ? true : false;
	};

	const isMarked = (instance, dayObject) => {
		const { options, markCustomCallbacks } = instance;
		const { date } = dayObject;
		// if (!options.markDates.length) return false;
		const optionMark = options.markDates.some(
			(markedDate) => valueOfDate(markedDate) === valueOfDate(date)
		);
		const customMark = markCustomCallbacks.some((callback) => callback.apply(null, [date]));

		return optionMark || customMark;
	};

	const isToday = (dayObject) => {
		const { date } = dayObject;
		return valueOfDate(date) === valueOfDate(new Date()) ? true : false;
	};

	//  create date custom object
	const renderDay = (dayObject) => {
		let classArray = ['mc-date'];
		// check the cases when the date is not active
		if (
			!isInActiveMonth(activeMonth, dayObject) ||
			isSelectable(options, dayObject) ||
			isExcludedWeekend(options, dayObject) ||
			isDisabledWeekDay(options, dayObject) ||
			isDisabledDate(options, dayObject)
		) {
			classArray.push('mc-date--inactive');
		} else {
			classArray.push('mc-date--active');
		}
		if (isPicked(pickedDate, dayObject)) classArray.push('mc-date--picked');

		if (isMarked(instance, dayObject)) classArray.push('mc-date--marked');

		if (isToday(dayObject)) classArray.push('mc-date--today');

		dayObject.classList = classArray.join(' ');

		return dayObject;
	};

	const calendarArray = getCalendarArray(options, firstMonthDate);

	return calendarArray.map((day) => renderDay(day));
};

export function writeTemplate(datepickers) {
	// create a new div tag
	const calendarDiv = document.createElement('div');
	// set the id of the created div
	// calendarDiv.id = 'mc-calendar';
	// set the classList of the created div
	calendarDiv.className = 'mc-calendar';
	// write the template to the div content
	calendarDiv.innerHTML = template;
	// add the new div to the document
	document.body.appendChild(calendarDiv);
	// get calendar Nodes
	const calendarNodes = getDOMNodes(calendarDiv);
	// apply listeners to calendar
	applyListeners(calendarNodes, datepickers);

	return calendarNodes;
}
