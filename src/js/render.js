import template from './template';
import { valueOfDate } from './utils';
import { applyListeners } from './handlers';

export const renderCalendar = (instance, date) => {
	// get the first day of the month
	const firstMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);
	// get the month
	const activeMonth = firstMonthDate.getMonth();
	//  create date custom object
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
		const { firstWeekday } = instance.options;
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

	const isSelectable = ({ options: { minDate, maxDate } }, { date }) => {
		const smallerTanMin = minDate !== null ? valueOfDate(date) < valueOfDate(minDate) : false;
		const biggerTanMax = maxDate !== null ? valueOfDate(maxDate) < valueOfDate(date) : false;
		return smallerTanMin || biggerTanMax;
	};

	const isInActiveMonth = (activeMonth, { month }) => {
		return month !== activeMonth ? false : true;
	};

	const isExcludedWeekend = ({ options }, { day }) => {
		if (!options.disableWeekends) return false;
		return day === 0 || day === 6 ? true : false;
	};

	const isDisabledWeekDay = ({ options }, { day }) => {
		if (!options.disableWeekDays.length) return false;
		return options.disableWeekDays.some((weekDay) => weekDay === day);
	};

	const isDisabledDate = ({ options }, { date }) => {
		if (!options.disableDates.length) return false;
		return options.disableDates.some(
			(disabledDate) => valueOfDate(disabledDate) === valueOfDate(date)
		);
	};

	const isPicked = ({ pickedDate }, { date }) => {
		// instance.selectedDate;
		if (pickedDate === null) return false;

		return valueOfDate(pickedDate) === valueOfDate(date) ? true : false;
	};

	const isMarked = ({ options, markCustomCallbacks }, { date }) => {
		// if (!options.markDates.length) return false;
		const optionMark = options.markDates.some(
			(markedDate) => valueOfDate(markedDate) === valueOfDate(date)
		);
		const customMark = markCustomCallbacks.some((callback) => callback.apply(null, [date]));

		return optionMark || customMark;
	};

	const isToday = ({ date }) => {
		return valueOfDate(date) === valueOfDate(new Date()) ? true : false;
	};

	const renderDay = (dayObject) => {
		let classArray = ['mc-date'];
		// check the cases when the date is not active
		if (
			!isInActiveMonth(activeMonth, dayObject) ||
			isSelectable(instance, dayObject) ||
			isExcludedWeekend(instance, dayObject) ||
			isDisabledWeekDay(instance, dayObject) ||
			isDisabledDate(instance, dayObject)
		) {
			classArray.push('mc-date--inactive');
		} else {
			classArray.push('mc-date--active');
		}
		if (isPicked(instance, dayObject)) classArray.push('mc-date--picked');

		if (isMarked(instance, dayObject)) classArray.push('mc-date--marked');

		if (isToday(dayObject)) classArray.push('mc-date--today');

		dayObject.classList = classArray.join(' ');

		return dayObject;
	};

	const calendarArray = getCalendarArray();

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
	// apply listeners to calendar
	applyListeners(calendarDiv, datepickers);
	return calendarDiv;
}
