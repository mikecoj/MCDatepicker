import template from './template';
import { valueOfDate } from './utils';
import { applyListeners } from './handlers';

export const renderCalendar = (instance, date) => {
	// console.log(instance.pickedDate);
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
		let firstCalendarDate = (firstMonthDate.getDay() - 1) * -1;
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

	const isInActiveMonth = (activeMonth, date) => {
		return date.month !== activeMonth ? false : true;
	};

	const isExcludedWeekend = ({ options }, date) => {
		if (!options.disableWeekends) return false;
		return date.day === 0 || date.day === 6 ? true : false;
	};

	const isDisabledWeekDay = ({ options }, date) => {
		if (!options.disableWeekDays.length) return false;
		return options.disableWeekDays.some((weekDay) => weekDay === date.day);
	};

	const isDisabledDate = ({ options }, date) => {
		if (!options.disableDates.length) return false;
		return options.disableDates.some(
			(disabledDate) => valueOfDate(disabledDate) === valueOfDate(date.date)
		);
	};

	const isPicked = (instance, date) => {
		// instance.selectedDate;
		if (instance.pickedDate === null) return false;

		return valueOfDate(instance.pickedDate) === valueOfDate(date.date) ? true : false;
	};

	const isToday = (date) => {
		return valueOfDate(date.date) === valueOfDate(new Date()) ? true : false;
	};

	const renderDay = (dayObject) => {
		let classArray = ['mc-date'];
		// check the cases when the date is not active
		if (
			!isInActiveMonth(activeMonth, dayObject) ||
			isExcludedWeekend(instance, dayObject) ||
			isDisabledWeekDay(instance, dayObject) ||
			isDisabledDate(instance, dayObject)
		) {
			classArray.push('mc-date--inactive');
		} else {
			classArray.push('mc-date--active');
		}
		if (isPicked(instance, dayObject)) classArray.push('mc-date--picked');

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
	calendarDiv.id = 'mc-calendar';
	// set the classList of the created div
	calendarDiv.className = 'mc-calendar__box row mc-calendar__box--inline'; // mc-calendar__box--inline
	// write the template to the div content
	calendarDiv.innerHTML = template;
	// add the new div to the document
	document.body.appendChild(calendarDiv);
	// apply listeners to calendar
	applyListeners(calendarDiv, datepickers);
	return calendarDiv;
}
