import template from './template';
import { valueOfDate } from './utils';
import { getDOMNodes } from './handlers';
import { applyListeners } from './listeners';
import {
	isActiveMonth,
	isActiveYear,
	isSelectable,
	isInActiveMonth,
	isExcludedWeekend,
	isDisabledWeekDay,
	isDisabledDate,
	isPicked,
	isMarked,
	isToday
} from './checker';

const dayObj = (dateVal = null) => {
	return {
		date: dateVal,
		day: dateVal.getDay(),
		dateNumb: dateVal.getDate(),
		month: dateVal.getMonth(),
		year: dateVal.getFullYear(),
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

export const renderMonthPreview = (calendarNodes, instance) => {
	const { previewCells, currentMonthSelect } = calendarNodes;
	const { store, prevLimitDate, nextLimitDate, options } = instance;
	const { customMonths } = options;
	const currentMonth = customMonths[store.preview.month];
	const selectedYear = store.preview.year;
	currentMonthSelect.setAttribute('aria-expanded', true);
	customMonths.map((month, index) => {
		let monthClasslist = ['mc-month-year__cell'];
		const firstMonthDate = new Date(Number(selectedYear), index);
		const lastMonthDate = new Date(Number(selectedYear), index + 1, 0);
		const lessThanMinDate =
			prevLimitDate && valueOfDate(lastMonthDate) < valueOfDate(prevLimitDate);
		const moreThanMaxDate =
			nextLimitDate && valueOfDate(firstMonthDate) > valueOfDate(nextLimitDate);
		let ariaLabel = month;
		if (month === currentMonth) {
			monthClasslist.push('mc-month-year__cell--picked');
			ariaLabel = `Current Month: ${ariaLabel}`;
		}
		if (
			lessThanMinDate ||
			moreThanMaxDate ||
			!isActiveMonth(options, index) ||
			!isActiveYear(options, Number(selectedYear))
		) {
			monthClasslist.push('mc-month-year__cell--inactive');
			previewCells[index].setAttribute('tabindex', -1);
		} else {
			previewCells[index].setAttribute('tabindex', 0);
		}

		previewCells[index].classList = monthClasslist.join(' ');
		previewCells[index].innerHTML = `<span>${month.substr(0, 3)}</span>`;
		previewCells[index].setAttribute('aria-label', month);
	});
};

export const renderYearPreview = (calendarNodes, instance, year) => {
	const { previewCells, currentYearSelect } = calendarNodes;
	const { store, prevLimitDate, nextLimitDate, options } = instance;
	const minYear = prevLimitDate && prevLimitDate.getFullYear();
	const maxYear = nextLimitDate && nextLimitDate.getFullYear();
	const currentYear = store.preview.year;
	currentYearSelect.setAttribute('aria-expanded', true);
	previewCells.forEach((cell, index) => {
		let yearClasslist = ['mc-month-year__cell'];
		let customYear = year + index;
		const lessThanMinYear = prevLimitDate && customYear < minYear;
		const moreThanMaxYear = nextLimitDate && customYear > maxYear;
		if (customYear === currentYear) yearClasslist.push('mc-month-year__cell--picked');
		if (lessThanMinYear || moreThanMaxYear || !isActiveYear(options, customYear)) {
			yearClasslist.push('mc-month-year__cell--inactive');
			previewCells[index].setAttribute('tabindex', -1);
		} else {
			previewCells[index].setAttribute('tabindex', 0);
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

	//  create date custom object
	const renderDay = (dayObject) => {
		let classArray = ['mc-date'];
		dayObject.ariaLabel = dayObject.date.toDateString();
		// check the cases when the date is not active
		if (
			!isInActiveMonth(activeMonth, dayObject) ||
			!isActiveMonth(options, dayObject.month) ||
			!isActiveYear(options, dayObject.year) ||
			isSelectable(instance, dayObject) ||
			isExcludedWeekend(options, dayObject) ||
			isDisabledWeekDay(options, dayObject) ||
			isDisabledDate(options, dayObject)
		) {
			classArray.push('mc-date--inactive');
			dayObject.tabindex = -1;
		} else {
			classArray.push('mc-date--active');
			dayObject.tabindex = 0;
		}
		if (isPicked(pickedDate, dayObject)) {
			classArray.push('mc-date--picked');
			dayObject.ariaLabel = `Picked: ${dayObject.ariaLabel}`;
		}

		if (isMarked(instance, dayObject)) {
			classArray.push('mc-date--marked');
			dayObject.ariaLabel = `Marked: ${dayObject.ariaLabel}`;
		}

		if (isToday(dayObject)) {
			classArray.push('mc-date--today');
			dayObject.ariaLabel = `Today: ${dayObject.ariaLabel}`;
		}

		dayObject.classList = classArray.join(' ');

		return dayObject;
	};

	const calendarArray = getCalendarArray(options, firstMonthDate);
	return calendarArray.map((day) => renderDay(day));
};

export function writeTemplate(instanceOptions) {
	// create a new div tag
	const calendarDiv = document.createElement('div');
	// set the classList of the created div
	calendarDiv.className = 'mc-calendar';
	// make the calendar focusable
	calendarDiv.setAttribute('tabindex', 0);
	// write the template to the div content
	calendarDiv.innerHTML = template;
	// add the new div to the document
	document.body.appendChild(calendarDiv);
	// get calendar Nodes
	const calendarNodes = getDOMNodes(calendarDiv);
	// apply listeners to calendar
	applyListeners(calendarNodes);

	return calendarNodes;
}
