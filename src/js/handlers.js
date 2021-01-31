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
		console.log(e.target.id);
		datepickerShow(calendarDiv);
	});
	document.querySelector(elem).addEventListener('blur', (e) => {
		console.log(e.target.id);
		datepickerHide(calendarDiv);
	});
};

export function applyListeners(calendar, datepickers) {
	// const calendar = document.querySelector('#mc-calendar');
	const tableBody = calendar.querySelector('.mc-table__body');
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
	const pickedDays = calendar.querySelectorAll('.mc-date--picked');
	const activeDates = calendar.querySelectorAll('.mc-date--active');
	const dateCells = calendar.querySelectorAll('mc-date');
	let activeInstance = null;
	let clickable = true;

	dateCells.forEach((cell) => cell.addEventListener('click', (e) => dispatchPick(e.target)));

	calendar.addEventListener(CALENDAR_SHOW, (e) => {
		calendar.classList.add('mc-calendar__box--opened');
		activeInstance = datepickers.find(({ el }) => el === '#' + e.target.id);
		activeInstance.onOpen(e);
	});
	calendar.addEventListener(CALENDAR_HIDE, (e) => {
		calendar.classList.remove('mc-calendar__box--opened');
		activeInstance.onClose(e);
		activeInstance = null;
	});
	calendar.addEventListener(DATE_PICK, function (e) {
		const selectedDate = e.detail.date;
		displayDay.innerText = weekDays[selectedDate.getDay()];
		displayDate.innerText = selectedDate.getDate();
		displayMonth.innerText = months[selectedDate.getMonth()];
		displayYear.innerText = selectedDate.getFullYear();

		activeInstance.pickedDate = selectedDate;
		pickedDays.forEach((date) => date.classList.remove('mc-date--picked'));
		e.target.classList.add('mc-date--picked');

		activeInstance.onSelect(e);
	});

	currentMonthSelect.addEventListener(CHANGE_MONTH, function (e) {
		if (!clickable) return;
		clickable = !clickable;
		const selectedMonth = e.target.children[0].innerText;
		const selectedYear = currentYearSelect.children[0].innerText;
		const { newElement, overlap } = utils.arrayInfiniteLooper(
			months,
			selectedMonth,
			e.detail.direction
		);

		e.target.innerHTML += spanTemplate(e.detail.direction, newElement);

		if (overlap !== 0) {
			const newYear = Number(selectedYear) + overlap;
			currentYearSelect.innerHTML += spanTemplate(e.detail.direction, newYear);
			utils
				.slide(currentYearSelect.children[0], currentYearSelect.children[1], e.detail.direction)
				.then(() => {
					currentYearSelect.children[1].style.transform = 'translateX(0)';
					currentYearSelect.children[0].remove();
				});
		}

		utils.slide(e.target.children[0], e.target.children[1], e.detail.direction).then(() => {
			e.target.children[1].style.transform = 'translateX(0)';
			e.target.children[0].remove();
			// tableBody.innerHTML = renderCalendar(
			// 	new Date(selectedYear, months.indexOf(selectedMonth), 1)
			// );
			// dateCells.onClick = (e) => dispatchPick(e.target);
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
		datepickerHide(e.target);
		activeInstance.linkedElement.value = activeInstance.pickedDate;
	});

	clearButton.addEventListener('click', () => {
		pickedDays.forEach((date) => date.classList.remove('mc-date--picked'));
		activeInstance.pickedDate = null;
	});
}
