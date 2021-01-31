import template from './template.js';
import { valueOfDate, noop } from './utils.js';
import { applyListeners } from './handlers';

export const renderCalendar = (instance, date) => {
	// get the first day of the month
	const firstMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);
	// get the month
	const activeMonth = firstMonthDate.getMonth();
	// get a new instance of the first day of the month, it's used for changing the date based on array

	const dayObj = (dateVal = null) => {
		return {
			date: dateVal,
			day: dateVal.getDay(),
			dateNumb: dateVal.getDate(),
			month: dateVal.getMonth(),
			classList: []
		};
	};

	const getCalendarArray = () => {
		let calendarArray = [];
		// get the day of the first date of the first table cell
		let firstCalendarDate = (firstMonthDate.getDay() - 1) * -1;
		// generate the calendar array
		while (calendarArray.length < 42) {
			let modifiableDate = new Date(firstMonthDate);
			let newDate = new Date(modifiableDate.setDate(firstCalendarDate++));
			calendarArray.push(dayObj(newDate));
		}
		return calendarArray;
	};

	const isInActiveMonth = (activeMonth, date) => {
		return date.month !== activeMonth ? false : true;
	};

	const isExcludedWeekend = ({ options }, date) => {
		if (options.disableWeekends.length) {
			return date.day === 5 || 6 ? true : false;
		}
		return false;
	};

	const isDisabledWeekDay = ({ options }, date) => {
		if (options.disableWeekDays.length) {
			return options.disableWeekDays.some((weekDay) => weekDay === date.day);
		}
		return false;
	};

	const isDisabledDate = ({ options }, date) => {
		if (options.disableDates.length) {
			return options.disableDates.some(
				(disabledDate) => valueOfDate(disabledDate) === valueOfDate(date.date)
			);
		}
		return false;
	};

	const isPicked = (selectedDate, date) => {
		// instance.selectedDate;
		return valueOfDate(selectedDate) === valueOfDate(date.date) ? true : false;
	};

	const isToday = (date) => {
		return valueOfDate(date.date) === valueOfDate(new Date()) ? true : false;
	};

	const renderDay = (dayObject) => {
		let classList = ['mc-date'];
		if (
			!isInActiveMonth(activeMonth, dayObject) ||
			isExcludedWeekend(instance, dayObject) ||
			isDisabledWeekDay(instance, dayObject) ||
			isDisabledDate(instance, dayObject)
		) {
			classlist.push('mc-date--inactive');
		} else {
			classlist.push('mc-date--active');
		}
		if (isPicked(instance, dayObject)) classlist.push('mc-date--picked');

		if (isToday(dayObject)) classlist.push('mc-date--today');

		dayObject.classList = classList.join(' ');

		return dayObject;
	};

	const calendarArray = getCalendarArray();

	return calendarArray.map((day) => renderDay(day));
};

// export function writeCalendarTable(instance, day) {
// 	const calendar = renderCalendar(instance, day);
// 	const createDay = (day) => {
// 		return `<td class="${day.classlist}" data-val-date="${day.date}">${day.date.getDate()}</td>`;
// 	};
// 	const createWeek = (week) => {
// 		return `<tr class="mc-table__week">${week.map((day) => createDay(day)).join('')}</tr>`;
// 	};
// 	return calendar.map((week) => createWeek(week));
// }

// export const updateCalendarTAble = (instance, day) => {};

export function writeTemplate(datepickers) {
	writeTemplate = noop;
	const calendarDiv = document.createElement('div');
	calendarDiv.id = 'mc-calendar';
	calendarDiv.className = 'mc-calendar__box row';
	calendarDiv.innerHTML = template;
	document.body.appendChild(calendarDiv);
	applyListeners(calendarDiv, datepickers);
	// document.innerHTML += template();
	return calendarDiv;
}
