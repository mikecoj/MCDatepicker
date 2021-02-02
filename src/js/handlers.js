import { weekDays, months } from './defaults';
import { renderCalendar } from './render';
import { arrayInfiniteLooper, slide, dateFormatParser } from './utils';
import {
	CALENDAR_HIDE,
	CALENDAR_SHOW,
	CHANGE_MONTH,
	CHANGE_YEAR,
	DATE_PICK,
	TABLE_UPDATE
} from './events';
import {
	dispatchCalendarShow,
	dispatchCalendarHide,
	dispatchChangeMonth,
	dispatchChangeYear,
	dispatchDatePick
} from './emiters';

const spanTemplate = (direction, content) => {
	const units = direction === 'next' ? '-100' : '100';
	return `<span style="transform: translateX(${units}px);">${content}</span>`;
};
export const applyOnFocusListener = (calendarDiv, { linkedElement }) => {
	linkedElement.onfocus = () => {
		dispatchCalendarShow(calendarDiv, '#' + linkedElement.id);
	};
};

export const removeOnFocusListener = ({ linkedElement }) => {
	linkedElement.onfocus = null;
};

export function applyListeners(calendar, datepickers) {
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
	const okButton = calendar.querySelector('#mc-btn__ok');
	const cancelButton = calendar.querySelector('#mc-btn__cancel');
	const clearButton = calendar.querySelector('#mc-btn__clear');
	const dateCells = calendar.querySelectorAll('.mc-date');
	let activeCell = null;
	let activeInstance = null;
	let clickable = true;

	const updateDisplay = (date) => {
		displayDay.innerText = weekDays[date.getDay()];
		displayDate.innerText = date.getDate();
		displayMonth.innerText = months[date.getMonth()];
		displayYear.innerText = date.getFullYear();
	};

	const updateCalendar = (datesArray = []) => {
		dateCells.forEach((cell, index) => {
			cell.innerText = datesArray[index].dateNumb;
			cell.classList = datesArray[index].classList;
			cell.setAttribute('data-val-date', datesArray[index].date);
		});
	};

	const updateCalendarHeader = (date) => {
		currentMonthSelect.innerHTML = `<span>${months[date.getMonth()]}</span>`;
		currentYearSelect.innerHTML = `<span>${date.getFullYear()}</span>`;
	};
	// add click event that dispatch a custom DATE_PICK event, to every calendar cell
	dateCells.forEach((cell) => cell.addEventListener('click', (e) => dispatchDatePick(e.target)));

	calendar.addEventListener(CALENDAR_SHOW, (e) => {
		// get the instance of the input that fired CALENDAR_SHOW event
		activeInstance = datepickers.find(({ el }) => el === e.detail.input);
		// check if the picked date is null, set it to new date
		activeInstance.pickedDate === null && (activeInstance.pickedDate = new Date());
		// render the new calendar array
		const datesArray = renderCalendar(activeInstance, activeInstance.pickedDate);
		// update the calendar display
		updateDisplay(activeInstance.pickedDate);
		// update calendar header
		updateCalendarHeader(activeInstance.pickedDate);
		// update the calendar
		updateCalendar(datesArray);
		// show the calendar
		calendar.classList.add('mc-calendar__box--opened');
		// run all custom onOpen callbacks added by the user
		activeInstance.onOpenCallbacks.forEach((callback) => callback.apply(null));
		// get the active cell
		activeCell = calendar.querySelector('.mc-date--picked');
	});
	calendar.addEventListener(CALENDAR_HIDE, (e) => {
		calendar.classList.remove('mc-calendar__box--opened');
		// run all custom onClose callbacks added by the user
		activeInstance.onCloseCallbacks.forEach((callback) => callback.apply(null));
		// reset the active instance
		activeInstance = null;
	});
	calendar.addEventListener(DATE_PICK, function (e) {
		if (e.target.classList.contains('mc-date--inactive')) return;
		activeCell !== null && activeCell.classList.remove('mc-date--picked');
		// const pickedDays = calendar.querySelectorAll('.mc-date--picked');
		const selectedDate = e.detail.date;
		// update the display
		updateDisplay(selectedDate);
		// update the instance picked date
		activeInstance.pickedDate = selectedDate;
		// pickedDays.forEach((date) => date.classList.remove('mc-date--picked'));
		// update the classlist of the picked cell
		e.target.classList.add('mc-date--picked');
		// add a new activeCell
		activeCell = e.target;
		// run all custom onSelect callbacks added by the user
		activeInstance.onSelectCallbacks.forEach((callback) => callback.apply(null));
	});

	currentMonthSelect.addEventListener(CHANGE_MONTH, function (e) {
		// check if the button is clickable
		if (!clickable) return;
		// set the button clickable to false
		clickable = !clickable;
		// get the value of active month
		const selectedMonth = e.target.children[0].innerText;
		// get the value of active Year
		const selectedYear = currentYearSelect.children[0].innerText;
		// get the next ot prev month and the overlap value
		const { newElement, overlap } = arrayInfiniteLooper(months, selectedMonth, e.detail.direction);
		// add a new span tah with the new month to the months div
		e.target.innerHTML += spanTemplate(e.detail.direction, newElement);

		if (overlap !== 0) {
			// if the overlap is not 0 then calculate the new year
			const newYear = Number(selectedYear) + overlap;
			// add a new span with the new year to the years div
			currentYearSelect.innerHTML += spanTemplate(e.detail.direction, newYear);
			// apply slide animation to years span tags
			slide(currentYearSelect.children[0], currentYearSelect.children[1], e.detail.direction).then(
				() => {
					currentYearSelect.children[1].style.transform = 'translateX(0)';
					// remove the old span tag
					currentYearSelect.children[0].remove();
				}
			);
		}
		// apply slide animation to months span tags
		slide(e.target.children[0], e.target.children[1], e.detail.direction).then(() => {
			e.target.children[1].style.transform = 'translateX(0)';
			// remove the old span tag
			e.target.children[0].remove();
			// get new date for the new calendar array
			const nextCalendarDate = new Date(
				currentYearSelect.children[0].innerText,
				months.indexOf(e.target.children[0].innerHTML),
				1
			);
			// render the new calendar array
			const datesArray = renderCalendar(activeInstance, nextCalendarDate);
			// update the calendar
			updateCalendar(datesArray);
			// run all custom onMonthChangeCallbacks added by the user
			activeInstance.onMonthChangeCallbacks.forEach((callback) => callback.apply(null));

			clickable = !clickable;
		});
	});

	currentYearSelect.addEventListener(CHANGE_YEAR, function (e) {
		if (!clickable) return;
		clickable = !clickable;
		const selectedMonth = currentMonthSelect.children[0].innerText;
		const selectedYear = e.target.children[0].innerText;
		// get the next or prev Year, based on the direction property
		const newYear =
			e.detail.direction === 'next' ? Number(selectedYear) + 1 : Number(selectedYear) - 1;
		// append a new span tag to the targeted div
		e.target.innerHTML += spanTemplate(e.detail.direction, newYear);
		// apply slide animation
		slide(e.target.children[0], e.target.children[1], e.detail.direction).then(() => {
			// reset the style of the new created span tag
			e.target.children[1].style.transform = 'translateX(0)';
			// delete the old span tag
			e.target.children[0].remove();
			// generate a new date based on the current month and new generated year
			const nextCalendarDate = new Date(
				e.target.children[0].innerText,
				months.indexOf(selectedMonth),
				1
			);
			// render the new calendar array
			const datesArray = renderCalendar(activeInstance, nextCalendarDate);
			// update the calendar
			updateCalendar(datesArray);
			// run every custom callback added by user
			activeInstance.onYearChangeCallbacks.forEach((callback) => callback.apply(null));

			clickable = !clickable;
		});
	});

	monthNavPrev.addEventListener('click', () => dispatchChangeMonth(currentMonthSelect, 'prev'));

	monthNavNext.addEventListener('click', () => dispatchChangeMonth(currentMonthSelect, 'next'));

	yearNavPrev.addEventListener('click', () => dispatchChangeYear(currentYearSelect, 'prev'));

	yearNavNext.addEventListener('click', () => dispatchChangeYear(currentYearSelect, 'next'));

	cancelButton.addEventListener('click', (e) => dispatchCalendarHide(e.target));

	okButton.addEventListener('click', (e) => {
		// if the value of picked date is not null then get formated date
		let pickedDateValue =
			activeInstance.pickedDate !== null
				? dateFormatParser(activeInstance.pickedDate, activeInstance.options.dateFormat)
				: null;
		// set the value of the picked date to the linked input
		activeInstance.linkedElement.value = pickedDateValue;
		// dispatch DATEPICKER_HIDE event
		dispatchCalendarHide(e.target);
	});

	clearButton.addEventListener('click', () => {
		activeCell.classList.remove('mc-date--picked');
		activeCell = null;
		activeInstance.pickedDate = null;
	});
}
