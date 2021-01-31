// import { fas, faAngleLeft, faAngleRight } from 'font-awesome/css/font-awesome.css';
// import template from './template';
// import * as utils from './utils';
import defaultOptions from './defaults';
import { applyListeners, applyOnFocusListener } from './handlers';
import createInstance from './instance';
import validateOptions from './validators';
import { writeTemplate } from './render';

import '../css/mc-calendar.css';

const MCDatepicker = (() => {
	let datepickers = [];
	// let activeInstance = null;
	const create = (options = {}) => {
		const calendarDiv = writeTemplate(datepickers);
		const instanceOptions = validateOptions(options, defaultOptions);
		const instance = createInstance(instanceOptions);
		datepickers.push(instance);
		applyOnFocusListener(calendarDiv, instance.el);
		// return instance;
	};
	const remove = (instance) => {
		this.datepickers.slice(datepickers.indexOf({ instance }), 1);
	};
	const test = (message) => {
		console.log(message);
	};
	return { create, remove, test };
})();
export default MCDatepicker;
// console.log(optionsDefault);
// export default class Datepicker {
// 	constructor() {
// 		(this.wDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
// 			(this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']),
// 			(this.today = new Date()),
// 			(this.linkedNode = null),
// 			(this.parentNode = null),
// 			(this.pickedDate = new Date(this.today)),
// 			(this.currentMonth = this.months[this.pickedDate.getMonth()]),
// 			(this.currentYear = this.pickedDate.getFullYear());
// 	}

// 	init({ ...options }) {
// 		const instanceOption = { ...optionsDefault, ...options };
// 		console.log(instanceOption);
// 		const _this = this;
// 		const linkedNode = document.querySelector(options.el);
// 		document.querySelector('body').innerHTML += template(
// 			this.wDays[this.pickedDate.getDay()],
// 			this.pickedDate.getDate(),
// 			this.currentMonth,
// 			this.currentYear
// 		);
// 		const parent = document.querySelector('#mc-calendar');
// 		this.setParentNode = parent;
// 		parent.addEventListener('datepicker-show', function (e) {
// 			this.classList.toggle('mc-calendar__box--opened');
// 		});
// 		parent.addEventListener('datepicker-hide', function (e) {
// 			this.classList.toggle('mc-calendar__box--opened');
// 		});
// 		parent.addEventListener('datepicker-pick', function (e) {
// 			_this.displayHandler(e.detail.date);
// 			_this.setPicker = e.detail.date;
// 			_this.parentNode.querySelectorAll('.mc-date--picked').forEach((date) => date.classList.remove('mc-date--picked'));
// 			e.target.classList.add('mc-date--picked');
// 		});

// 		_this.writeCalendar(this.today);
// 		_this.onButton();
// 		_this.navMonthYearHandler();
// 	}

// 	set setPicker(date) {
// 		this.pickedDate = date;
// 	}

// 	set setLinkedNode(node) {
// 		this.linkedNode = node;
// 	}

// 	set setParentNode(node) {
// 		this.parentNode = node;
// 	}

// 	set setCurrentMonth(month) {
// 		this.currentMonth = month;
// 	}

// 	set setCurrentYear(year) {
// 		this.currentYear = year;
// 	}

// 	writeCalendar(date) {
// 		const _this = this;
// 		const tableBody = _this.parentNode.querySelector('.mc-table__body');
// 		const firstMonthDate = new Date(date.setDate(1));
// 		let calendarArray = [];
// 		let firstCalendarDate = (firstMonthDate.getDay() - 1) * -1;

// 		const writeDay = (day) => {
// 			let newDate = new Date(firstMonthDate);
// 			let thisDate = new Date(newDate.setDate(day));
// 			let classlist = ['mc-date'];
// 			thisDate.getMonth() != firstMonthDate.getMonth() ? classlist.push('mc-date--inactive') : classlist.push('mc-date--active');
// 			if (thisDate.setHours(0, 0, 0, 0).valueOf() == _this.pickedDate.setHours(0, 0, 0, 0).valueOf()) classlist.push('mc-date--picked');
// 			if (thisDate.setHours(0, 0, 0, 0).valueOf() == new Date().setHours(0, 0, 0, 0).valueOf()) classlist.push('mc-date--today');
// 			return `<td class="${classlist.join(' ')}" data-val-date="${thisDate}">${thisDate.getDate()}</td>`;
// 		};

// 		while (calendarArray.length < 6) {
// 			let week = [];
// 			while (week.length < 7) week.push(firstCalendarDate++);
// 			calendarArray.push(week);
// 		}
// 		tableBody.innerHTML = calendarArray
// 			.map((week) => {
// 				return `<tr class="mc-table__week">${week.map((day) => writeDay(day)).join('')}</tr>`;
// 			})
// 			.join('');
// 		_this.parentNode.querySelectorAll('.mc-date--active').forEach((day) => {
// 			day.onclick = (e) => utils.dispatchPick(e.target);
// 		});
// 	}

// 	displayHandler(date) {
// 		const _this = this;
// 		_this.parentNode.querySelector('.mc-display__day').innerText = _this.wDays[date.getDay()];
// 		_this.parentNode.querySelector('.mc-display__date').innerText = date.getDate();
// 		_this.parentNode.querySelector('.mc-display__month').innerText = _this.months[date.getMonth()];
// 		_this.parentNode.querySelector('.mc-display__year').innerText = date.getFullYear();
// 	}

// 	navMonthYearHandler() {
// 		const _this = this;
// 		let clickable = true;
// 		const currentMonthSelect = _this.parentNode.querySelector('#mc-current--month');
// 		const currentYearSelect = _this.parentNode.querySelector('#mc-current--year');

// 		currentMonthSelect.addEventListener('month-change', function (e) {
// 			if (clickable) {
// 				clickable = !clickable;
// 				const oldMonth = e.target.children[0].innerText;
// 				const { newElement, overlap } = utils.arrayInfiniteLooper(_this.months, oldMonth, e.detail.direction);

// 				e.target.innerHTML += `<span style="transform: translateX(${e.detail.direction === 'next' ? '-100' : '100'}px);">${newElement}</span>`;

// 				if (overlap != 0) {
// 					_this.setCurrentYear = _this.currentYear + overlap;
// 					currentYearSelect.innerHTML += `<span style="transform: translateX(${e.detail.direction === 'next' ? '-100' : '100'}px);">${
// 						_this.currentYear
// 					}</span>`;

// 					utils.slide(currentYearSelect.children[0], currentYearSelect.children[1], e.detail.direction).then(() => {
// 						currentYearSelect.children[1].style.transform = 'translateX(0)';
// 						currentYearSelect.children[0].remove();
// 						_this.writeCalendar(new Date(_this.currentYear, _this.months.indexOf(_this.currentMonth), 1));
// 					});
// 				}

// 				utils.slide(e.target.children[0], e.target.children[1], e.detail.direction).then(() => {
// 					e.target.children[1].style.transform = 'translateX(0)';
// 					e.target.children[0].remove();

// 					_this.setCurrentMonth = newElement;

// 					_this.writeCalendar(new Date(_this.currentYear, _this.months.indexOf(_this.currentMonth), 1));
// 					clickable = !clickable;
// 				});
// 			}
// 		});
// 		currentYearSelect.addEventListener('year-change', function (e) {
// 			const oldYear = e.target.children[0].innerText;

// 			_this.setCurrentYear = e.detail.direction === 'next' ? Number(oldYear) + 1 : Number(oldYear) - 1;

// 			e.target.innerHTML += `<span style="transform: translateX(${e.detail.direction === 'next' ? '-100' : '100'}px);">${_this.currentYear}</span>`;

// 			utils.slide(e.target.children[0], e.target.children[1], e.detail.direction).then(() => {
// 				e.target.children[1].style.transform = 'translateX(0)';
// 				e.target.children[0].remove();
// 				_this.writeCalendar(new Date(_this.currentYear, _this.months.indexOf(_this.currentMonth), 1));
// 				clickable = !clickable;
// 			});
// 			// _this.writeCalendar(new Date(_this.currentYear, _this.months.indexOf(_this.currentMonth), 1));
// 			// e.target.children[0].innerText = _this.currentYear;
// 		});

// 		_this.parentNode.querySelector('#mc-picker__month--prev').addEventListener('click', function (e) {
// 			utils.monthChange(currentMonthSelect, 'prev');
// 		});
// 		_this.parentNode.querySelector('#mc-picker__month--next').addEventListener('click', function (e) {
// 			utils.monthChange(currentMonthSelect, 'next');
// 		});
// 		_this.parentNode.querySelector('#mc-picker__year--prev').addEventListener('click', function (e) {
// 			utils.yearChange(currentYearSelect, 'prev');
// 		});
// 		_this.parentNode.querySelector('#mc-picker__year--next').addEventListener('click', function (e) {
// 			utils.yearChange(currentYearSelect, 'next');
// 		});
// 	}

// 	onButton() {
// 		let _this = this;
// 		let okButton = _this.parentNode.querySelector('#mc-btn__ok');
// 		let cancelButton = _this.parentNode.querySelector('#mc-btn__cancel');
// 		let clearButton = _this.parentNode.querySelector('#mc-btn__clear');
// 		okButton.onclick = (e) => {
// 			console.log(utils.dateFormatString(_this.pickedDate));
// 			_this.close();
// 		};

// 		cancelButton.onclick = (e) => {
// 			utils.datepickerHide(_this.parentNode);
// 		};

// 		clearButton.onclick = (e) => {
// 			_this.parentNode.querySelectorAll('.mc-date--picked').forEach((elem) => elem.classList.remove('mc-date--picked'));
// 			_this.setPicker = null;
// 		};
// 	}

// 	open() {
// 		// const _this = this;
// 		this.parentNode.classList.toggle('mc-calendar__box--opened');
// 	}
// 	close() {
// 		// const _this = this;
// 		this.parentNode.classList.toggle('mc-calendar__box--opened');
// 	}
// }
