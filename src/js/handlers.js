import { weekDays, months } from './defaults.js';
import { renderCalendar } from './render.js';
import * as utils from './utils.js';
import {
	CALENDAR_HIDE,
	CALENDAR_SHOW,
	CHANGE_MONTH,
	CHANGE_YEAR,
	DATE_PICK,
	TABLE_UPDATE
} from './events';
import {
	datepickerShow,
	datepickerHide,
	monthChange,
	yearChange,
	dispatchPick
} from './emiters.js';

const spanTemplate = (direction, content) => {
	const units = direction === 'next' ? '-100' : '100';
	return `<span style="transform: translateX(${units}px);">${content}</span>`;
};

export const applyOnFocusListener = (calendarDiv, elem) => {
	document.querySelector(elem).addEventListener('focus', (e) => {
		datepickerShow(calendarDiv, e.target.id);
	});
	// document.querySelector(elem).addEventListener('blur', (e) => {
	// 	console.log(e.target.id);
	// 	datepickerHide(calendarDiv);
	// });
};

export function applyListeners(calendar, datepickers) {
	// const calendar = document.querySelector('#mc-calendar');
	// const tableBody = calendar.querySelector('.mc-table__body');
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
	// const pickedDays = calendar.querySelectorAll('.mc-date--picked');
	// const activeDates = calendar.querySelectorAll('.mc-date--active');
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

	dateCells.forEach((cell) => cell.addEventListener('click', (e) => dispatchPick(e.target)));

	calendar.addEventListener(CALENDAR_SHOW, (e) => {
		// get the instance of the input that fired CALENDAR_SHOW event
		activeInstance = datepickers.find(({ el }) => el === '#' + e.detail.input);
		// check if the picked date is null, set it to new date
		activeInstance.pickedDate === null && (activeInstance.pickedDate = new Date());
		// render the new calendar
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
		const { newElement, overlap } = utils.arrayInfiniteLooper(
			months,
			selectedMonth,
			e.detail.direction
		);
		// add a new span tah with the new month to the months div
		e.target.innerHTML += spanTemplate(e.detail.direction, newElement);

		if (overlap !== 0) {
			// if the overlap is not 0 then calculate the new year
			const newYear = Number(selectedYear) + overlap;
			// add a new span with the new year to the years div
			currentYearSelect.innerHTML += spanTemplate(e.detail.direction, newYear);
			// apply slide animation to years span tags
			utils
				.slide(currentYearSelect.children[0], currentYearSelect.children[1], e.detail.direction)
				.then(() => {
					currentYearSelect.children[1].style.transform = 'translateX(0)';
					// remove the old span tag
					currentYearSelect.children[0].remove();
				});
		}
		// apply slide animation to months span tags
		utils.slide(e.target.children[0], e.target.children[1], e.detail.direction).then(() => {
			e.target.children[1].style.transform = 'translateX(0)';
			// remove the old span tag
			e.target.children[0].remove();
			// run all custom onMonthChangeCallbacks callbacks added by the user
			activeInstance.onMonthChangeCallbacks.forEach((callback) => callback.apply(null));
			// tableBody.innerHTML = renderCalendar(
			// 	new Date(selectedYear, months.indexOf(selectedMonth), 1)
			// );
			// dateCells.onClick = (e) => dispatchPick(e.target);
			// reset the button clickable
			clickable = !clickable;
		});
	});

	currentYearSelect.addEventListener(CHANGE_YEAR, function (e) {
		if (!clickable) return;
		clickable = !clickable;
		const selectedMonth = currentMonthSelect.children[0].innerText;
		const selectedYear = e.target.children[0].innerText;
		const newYear =
			e.detail.direction === 'next' ? Number(selectedYear) + 1 : Number(selectedYear) - 1;

		e.target.innerHTML += spanTemplate(e.detail.direction, newYear);

		utils.slide(e.target.children[0], e.target.children[1], e.detail.direction).then(() => {
			e.target.children[1].style.transform = 'translateX(0)';
			e.target.children[0].remove();
			activeInstance.onYearChangeCallbacks.forEach((callback) => callback.apply(null));
			// tableBody.innerHTML = renderCalendar(new Date(newYear, months.indexOf(selectedMonth), 1));
			// dateCells.onClick = (e) => dispatchPick(e.target);
			clickable = !clickable;
		});
	});

	monthNavPrev.addEventListener('click', () => monthChange(currentMonthSelect, 'prev'));

	monthNavNext.addEventListener('click', () => monthChange(currentMonthSelect, 'next'));

	yearNavPrev.addEventListener('click', () => yearChange(currentYearSelect, 'prev'));

	yearNavNext.addEventListener('click', () => yearChange(currentYearSelect, 'next'));

	cancelButton.addEventListener('click', (e) => datepickerHide(e.target));

	okButton.addEventListener('click', (e) => {
		// set the value of the picked date to the linked input
		activeInstance.linkedElement.value = activeInstance.pickedDate;
		datepickerHide(e.target);
	});

	clearButton.addEventListener('click', () => {
		activeCell.classList.remove('mc-date--picked');
		activeCell = null;
		activeInstance.pickedDate = null;
	});
}
