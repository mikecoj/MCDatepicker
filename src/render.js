import { getCalendarArray, valueOfDate } from './utils.js';

function renderCalendar(instance, date) {
	const firstMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);
	const activeMonth = firstMonthDate.getMonth();
	const calendarArray = getCalendarArray(date);
	let modifiableDate = new Date(firstMonthDate);

	const renderDay = (day) => {
		let classList = ['mc-date'];
		let dayObject = {
			date: new Date(modifiableDate.setDate(day)),
			classList: null
		};

		if (
			!isInActiveMonth(activeMonth, dayObject.date) ||
			isExcludedWeekend(instance.options, dayObject.date) ||
			isDisabledWeekDate(instance.options, dayObject.date) ||
			isDisabledDate(instance.options, dayObject.date)
		) {
			classlist.push('mc-date--inactive');
		} else {
			classlist.push('mc-date--active');
		}
		if (isPicked(instance.selectedDate, dayObject.date)) classlist.push('mc-date--picked');

		if (isToday(dayObject.date)) classlist.push('mc-date--today');

		dayObject.classList = classList.join(' ');

		return dayObject;
	};

	return calendarArray.map((week) => {
		week.map((day) => renderDay(day));
	});
}

function isInActiveMonth(activeMonth, date) {
	return date.getMonth() !== activeMonth ? false : true;
}

function isExcludedWeekend(options, date) {
	if (options.disableWeekends.length) {
		return date.getDay() === 5 || 6 ? true : false;
	}
	return false;
}

function isDisabledWeekDate(options, date) {
	if (options.disableWeekDays.length) {
		return options.disableWeekDays.some((weekDay) => weekDay === date.getDay());
	}
	return false;
}

function isDisabledDate(options, date) {
	if (options.disableDates.length) {
		return options.disableDates.some(
			(disabledDate) => valueOfDate(disabledDate) === valueOfDate(date)
		);
	}
	return false;
}

function isPicked(selectedDate, date) {
	// instance.selectedDate;
	return valueOfDate(selectedDate) === valueOfDate(date) ? true : false;
}

function isToday(date) {
	return valueOfDate(date) === valueOfDate(new Date()) ? true : false;
}

function writeCalendarTable() {}

function createDay(day) {
	return `<td class="${day.classlist}" data-val-date="${day.date}">${day.date.getDate()}</td>`;
}

function createMonth(monthArray) {
	return calendarArray
		.map((week) => {
			return `<tr class="mc-table__week">${week.map((day) => writeDay(day)).join('')}</tr>`;
		})
		.join('');
}
