class Datepicker {
	defaultOptions = {
		el: null,
		type: 'popup',
		dateFormat: 'dd/mm/yy',
		autoShow: true,
		autoHide: false,
		multiSelect: false
	};
	constructor() {
		(this.wDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
			(this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']),
			(this.today = new Date()),
			(this.linkedNode = null),
			(this.parentNode = null),
			(this.pickedDate = new Date(this.today)),
			(this.currentMonth = this.months[this.pickedDate.getMonth()]),
			(this.currentYear = this.pickedDate.getFullYear());
	}
	get template() {
		return `
    <div id="mc-calendar" class="mc-calendar__box row">
        <div class="mc-calendar__display row">
            <div class="mc-display__header">
                <h3 class="mc-display__day">${this.wDays[this.pickedDate.getDay()]}</h3>
            </div>
            <div class="mc-display__body row">
                <div class="mc-display__data mc-display__data--primary row">
                    <h1 class="mc-display__date">${this.pickedDate.getDate()}</h1>
                </div>
                <div class="mc-display__data mc-display__data--secondary row">
                    <h3 class="mc-display__month">${this.currentMonth}</h3>
                    <h2 class="mc-display__year">${this.currentYear}</h2>
                </div>
            </div>
        </div>
        <div class="mc-calendar__picker row">
            <div class="mc-picker__header row container-m">
                <div class="mc-picker__select-month row">
                    <a id="mc-picker__month--prev" class="mc-picker__nav mc-picker__nav--prev" href="#">
                        <i class="fas fa-angle-left" aria-hidden="true"></i>
                    </a>
                    <div id="mc-current--month" class="mc-select__data"><span>${this.currentMonth}</span></div>
                    <a id="mc-picker__month--next" class="mc-picker__nav mc-picker__nav--next" href="#">
                        <i class="fas fa-angle-right" aria-hidden="true"></i>
                    </a>
                </div>
                <div class="mc-picker__select-year row">
                    <a id="mc-picker__year--prev" class="mc-picker__nav mc-picker__nav--prev" href="#">
                        <i class="fas fa-angle-left" aria-hidden="true"></i>
                    </a>
                    <div id="mc-current--year" class="mc-select__data"><span>${this.currentYear}</span></div>
                    <a id="mc-picker__year--next" class="mc-picker__nav mc-picker__nav--next" href="#">
                        <i class="fas fa-angle-right" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
            <div class="mc-picker__body">
                <table class="mc-picker__table container-s">
                    <thead class="mc-table__header">
                        <tr>
                            <th class="mc-table__weekday">S</th>
                            <th class="mc-table__weekday">M</th>
                            <th class="mc-table__weekday">T</th>
                            <th class="mc-table__weekday">W</th>
                            <th class="mc-table__weekday">T</th>
                            <th class="mc-table__weekday">F</th>
                            <th class="mc-table__weekday">S</th>
                        </tr>
                    </thead>
                    <tbody class="mc-table__body"></tbody>
                </table>
            </div>
            <div class="mc-picker__footer row container-m">
                <div class="mc-footer__section mc-footer__section--primary">
                    <a id="mc-btn__clear" class="mc-btn mc-btn--danger" href="#">Clear</a>
                </div>
                <div class="mc-footer__section mc-footer__section--secondary">
                    <a id="mc-btn__cancel" class="mc-btn mc-btn--success" href="#">CANCEL</a>
                    <a id="mc-btn__ok" class="mc-btn mc-btn--success" href="#">OK</a>
                </div>
            </div>
        </div>
	</div>`;
	}

	init(options = {}) {
		const _this = this;
		// const linkedNode = document.querySelector(options.el);
		document.querySelector('body').innerHTML += this.template;
		const parent = document.querySelector('#mc-calendar');
		this.setParentNode = parent;
		parent.addEventListener('datepicker-show', function (e) {
			this.classList.toggle('mc-calendar__box--opened');
		});
		parent.addEventListener('datepicker-hide', function (e) {
			this.classList.toggle('mc-calendar__box--opened');
		});
		parent.addEventListener('datepicker-pick', function (e) {
			if (e.target.classList.contains('mc-date--inactive')) {
				e.preventDefault();
				return;
			}
			_this.displayHandler(e.detail.date);
			_this.setPicker = e.detail.date;
			_this.parentNode.querySelectorAll('.mc-date--picked').forEach((date) => date.classList.remove('mc-date--picked'));
			e.target.classList.add('mc-date--picked');
		});

		_this.writeCalendar(this.today);
		_this.onButton();
		_this.navMonthYearHandler();
	}

	set setPicker(date) {
		this.pickedDate = date;
	}

	set setLinkedNode(node) {
		this.linkedNode = node;
	}

	set setParentNode(node) {
		this.parentNode = node;
	}

	set setCurrentMonth(month) {
		this.currentMonth = month;
	}

	set setCurrentYear(year) {
		this.currentYear = year;
	}

	writeCalendar(date) {
		const _this = this;
		const firstMonthDate = new Date(date.setDate(1));
		// const weekDay = firstMonthDate.getDay();
		let calendarArray = [];
		let firstCalendarDate = (firstMonthDate.getDay() - 1) * -1;

		while (calendarArray.length < 6) {
			let week = [];
			while (week.length < 7) week.push(firstCalendarDate++);
			calendarArray.push(week);
		}
		_this.parentNode.querySelector('.mc-table__body').innerHTML = calendarArray
			.map((w) => {
				return `<tr class="mc-table__week">
					${w
						.map((d) => {
							let newDate = new Date(firstMonthDate);
							let thisDate = new Date(newDate.setDate(d));
							let classlist = ['mc-date'];
							thisDate.getMonth() != firstMonthDate.getMonth() ? classlist.push('mc-date--inactive') : classlist.push('mc-date--active');
							if (thisDate.setHours(0, 0, 0, 0).valueOf() == _this.pickedDate.setHours(0, 0, 0, 0).valueOf()) classlist.push('mc-date--picked');
							if (thisDate.setHours(0, 0, 0, 0).valueOf() == new Date().setHours(0, 0, 0, 0).valueOf()) classlist.push('mc-date--today');
							return `<td class="${classlist.join(' ')}" onclick="dispatchPick(this)" data-val-date="${thisDate}">${thisDate.getDate()}</td>`;
						})
						.join('')}
					</tr>`;
			})
			.join('');
	}

	displayHandler(date) {
		const _this = this;
		_this.parentNode.querySelector('.mc-display__day').innerText = _this.wDays[date.getDay()];
		_this.parentNode.querySelector('.mc-display__date').innerText = date.getDate();
		_this.parentNode.querySelector('.mc-display__month').innerText = _this.months[date.getMonth()];
		_this.parentNode.querySelector('.mc-display__year').innerText = date.getFullYear();
	}

	navMonthYearHandler() {
		const _this = this;
		const currentMonthSelect = _this.parentNode.querySelector('#mc-current--month');
		const currentYearSelect = _this.parentNode.querySelector('#mc-current--year');

		currentMonthSelect.addEventListener('month-change', function (e) {
			const oldMonth = e.target.children[0].innerText;
			const { newElement, overlap } = arrayInfiniteLooper(_this.months, oldMonth, e.detail.direction);
			e.target.innerHTML += `<span style="transform: translateX(${e.detail.direction === 'next' ? '-100' : '100'}px);">${newElement}</span>`;
			const children = currentYearSelect.getElementsByTagName('span');
			// _this.slide(children[0], children[1], e.detail.direction);
			_this.setCurrentMonth = newElement;
			console.log(children[0]);

			children[0].animate(
				[
					{ transform: 'rotate(0) translate3D(-50%, -50%, 0)', color: '#000' },
					{ color: '#431236', offset: 0.3 },
					{ transform: 'rotate(360deg) translate3D(-50%, -50%, 0)', color: '#000' }
				],
				3000
			);

			if (overlap != 0) {
				_this.setCurrentYear = _this.currentYear + overlap;
				currentYearSelect.innerHTML = `<span>${_this.currentYear}</span>`;
			}
			_this.writeCalendar(new Date(_this.currentYear, _this.months.indexOf(_this.currentMonth), 1));
		});
		currentYearSelect.addEventListener('year-change', function (e) {
			const oldYear = e.target.children[0].innerText;

			_this.setCurrentYear = e.detail.direction === 'next' ? Number(oldYear) + 1 : Number(oldYear) - 1;

			_this.writeCalendar(new Date(_this.currentYear, _this.months.indexOf(_this.currentMonth), 1));
			e.target.children[0].innerText = _this.currentYear;
		});

		_this.parentNode.querySelector('#mc-picker__month--prev').addEventListener('click', function (e) {
			monthChange(currentMonthSelect, 'prev');
		});
		_this.parentNode.querySelector('#mc-picker__month--next').addEventListener('click', function (e) {
			monthChange(currentMonthSelect, 'next');
		});
		_this.parentNode.querySelector('#mc-picker__year--prev').addEventListener('click', function (e) {
			yearChange(currentYearSelect, 'prev');
		});
		_this.parentNode.querySelector('#mc-picker__year--next').addEventListener('click', function (e) {
			yearChange(currentYearSelect, 'next');
		});
	}

	changeMonth() {
		let clickable = true;
		const _this = this;
		const parentNode = _this.parentNode;
		const prevMonthRow = parentNode.querySelector('#mc-picker__month--prev');
		const nextMonthRow = parentNode.querySelector('#mc-picker__month--next');

		prevMonthRow.addEventListener('click', async () => {
			if (clickable) {
				clickable = false;
				const pickedYear = parentNode.querySelector('#mc-current--year span');
				const monthSlider = parentNode.querySelector('#mc-current--month');
				const pickedMonth = monthSlider.querySelector('span');
				let yearNumb = Number(pickedYear.textContent);
				const monthID = _this.months.indexOf(pickedMonth.textContent);
				let newMonthID;
				monthID == 0 ? ((newMonthID = 11), yearNumb--) : (newMonthID = monthID - 1);
				monthSlider.innerHTML += `<span style="transform: translateX(-100px);">${_this.months[newMonthID]}</span>`;
				let slideMonths = monthSlider.querySelectorAll('span');
				await _this.slide(slideMonths[0], slideMonths[1], 'right');
				const newDate = new Date(yearNumb, newMonthID, 1);
				_this.writeCalendar(newDate);
				clickable = true;
			}
		});
		nextMonthRow.addEventListener('click', async () => {
			if (clickable) {
				clickable = false;
				const pickedYear = parentNode.querySelector('#mc-current--year span');
				const monthSlider = parentNode.querySelector('#mc-current--month');
				const pickedMonth = monthSlider.querySelector('span');
				let yearNumb = Number(pickedYear.textContent);
				const monthID = _this.months.indexOf(pickedMonth.textContent);
				let newMonthID;
				monthID == 11 ? ((newMonthID = 0), yearNumb++) : (newMonthID = monthID + 1);
				monthSlider.innerHTML += `<span style="transform: translateX(100px);">${_this.months[newMonthID]}</span>`;
				let slideMonths = monthSlider.querySelectorAll('span');
				await _this.slide(slideMonths[0], slideMonths[1], 'left');
				const newDate = new Date(yearNumb, newMonthID, 1);
				_this.writeCalendar(newDate);
				clickable = true;
			}
		});
	}

	changeYear() {
		let clickable = true;
		const _this = this;
		const parentNode = _this.parentNode;
		const prevYearRow = parentNode.querySelector('#mc-picker__year--prev');
		const nextYearRow = parentNode.querySelector('#mc-picker__year--next');

		const monthSlider = () => {};

		prevYearRow.addEventListener('click', async () => {
			if (clickable) {
				clickable = false;
				const yearSlider = parentNode.querySelector('#mc-current--year');
				const pickedYear = yearSlider.querySelector('span');
				const pickedMonth = parentNode.querySelector('#mc-current--month span');
				let newYear = Number(pickedYear.textContent) - 1;
				yearSlider.innerHTML += `<span style="transform: translateX(100px);">${newYear}</span>`;
				let yearSliders = yearSlider.querySelectorAll('span');
				await _this.slide(yearSliders[0], yearSliders[1], 'right');
				const newDate = new Date(newYear, _this.months.indexOf(pickedMonth.textContent), 1);
				_this.writeCalendar(newDate);
				clickable = true;
			}
		});
		nextYearRow.addEventListener('click', async () => {
			if (clickable) {
				clickable = false;
				const yearSlider = parentNode.querySelector('#mc-current--year');
				const pickedYear = yearSlider.querySelector('span');
				const pickedMonth = parentNode.querySelector('#mc-current--month span');
				let newYear = Number(pickedYear.textContent) + 1;
				yearSlider.innerHTML += `<span style="transform: translateX(100px);">${newYear}</span>`;
				let yearSliders = yearSlider.querySelectorAll('span');
				await _this.slide(yearSliders[0], yearSliders[1], 'left');
				const newDate = new Date(newYear, _this.months.indexOf(pickedMonth.textContent), 1);
				_this.writeCalendar(newDate);
				pickedYear.innerHTML = newYear;
				clickable = true;
			}
		});
	}

	onButton() {
		let _this = this;
		let okButton = _this.parentNode.querySelector('#mc-btn__ok');
		let cancelButton = _this.parentNode.querySelector('#mc-btn__cancel');
		let clearButton = _this.parentNode.querySelector('#mc-btn__clear');
		okButton.onclick = (e) => {
			console.log(_this.dateFormatString(_this.pickedDate));
			_this.close();
		};

		cancelButton.onclick = (e) => {
			datepickerHide(_this.parentNode);
		};

		clearButton.onclick = (e) => {
			_this.parentNode.querySelectorAll('.mc-date--picked').forEach((elem) => elem.classList.remove('mc-date--picked'));
			_this.setPicker = null;
		};
	}

	open() {
		// const _this = this;
		this.parentNode.classList.toggle('mc-calendar__box--opened');
	}
	close() {
		// const _this = this;
		this.parentNode.classList.toggle('mc-calendar__box--opened');
	}

	dateFormatString(date = new Date(), format = 'dd-mmm-yyyy') {
		let result = null;
		if (date != null) {
			let unsupportedChar = format.match(/[^dmy,-\s\/]/g);
			const wordReg = /(d|m|y)+/g;
			let wDay = date.getDay();
			let mDate = date.getDate();
			let month = date.getMonth();
			let year = date.getFullYear();
			const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			let flags = {
				d: mDate.toString(),
				dd: mDate.toString().padStart(2, '0'),
				ddd: weekDays[wDay].substr(0, 3),
				dddd: weekDays[wDay],
				m: month.toString(),
				mm: month.toString().padStart(2, '0'),
				mmm: months[month].substr(0, 3),
				mmmm: months[month],
				yy: year.toString().substr(2),
				yyyy: year.toString()
			};
			if (!unsupportedChar) {
				result = format.replace(wordReg, (match) => {
					if (match === 'yyy') {
						console.error(new TypeError(match + ' Is not a supported format!'));
						return flags['yy'];
					} else if (match.match(/d{5,}/) || match.match(/m{5,}/) || match.match(/y{5,}/)) {
						console.error(new TypeError(match + ' Is not a supported format!'));

						return flags[match.substring(0, 2)];
					} else {
						return flags[match];
					}
				});
			} else {
				console.error(new TypeError(format + ' Is not a supported format!'));
			}
		}

		return result;
	}

	slide(activeElem, newElem, dir) {
		let value = activeElem.offsetWidth;
		// console.log(value);
		dir == 'prev' ? -1 * value : null;
		// if (dir == 'next') {
		// 	value;
		// } else if (dir == 'prev') {
		// 	value = -1 * value;
		// }
		let animationOptions = {
			// timing options
			duration: 1000,
			easing: 'ease-in-out'
		};
		activeElem.animate(
			[
				// keyframes
				{ transform: 'translateX(0px)' },
				{ transform: `translateX(${value}px)` }
			],
			{
				// timing options
				duration: 1000,
				easing: 'ease-in-out'
			}
		);
		newElem.animate(
			[
				// keyframes
				{ transform: `translateX(${-1 * value}px)` },
				{ transform: 'translateX(0px)' }
			],
			{
				// timing options
				duration: 1000,
				easing: 'ease-in-out'
			}
		);
		// activeElem.style.transform = 'translateX(100px)';
		// newElem.style.transform = 'translateX(0)';
		// activeElem.remove();
	}
}

function monthChange(elem, direction, month) {
	elem.dispatchEvent(
		new CustomEvent('month-change', {
			bubbles: true,
			detail: {
				direction: direction
			}
		})
	);
}

function yearChange(elem, direction, year) {
	elem.dispatchEvent(
		new CustomEvent('year-change', {
			bubbles: true,
			detail: {
				direction: direction
			}
		})
	);
}

function datepickerShow(elem) {
	elem.dispatchEvent(new CustomEvent('datepicker-show', { bubbles: true }));
}

function datepickerHide(elem) {
	elem.dispatchEvent(new CustomEvent('datepicker-hide', { bubbles: true }));
}

function datepickerPick(elem, date) {
	elem.dispatchEvent(
		new CustomEvent('datepicker-pick', {
			bubbles: true,
			detail: {
				date: date
			}
		})
	);
}

function dispatchPick(elem) {
	elem.dispatchEvent(
		new CustomEvent('datepicker-pick', {
			bubbles: true,
			detail: {
				date: new Date(elem.getAttribute('data-val-date'))
			}
		})
	);
}

function arrayInfiniteLooper(array, arrayElement, direction) {
	let overlap = 0;
	const currentArrayElementIndex = array.indexOf(arrayElement);
	const forward = (currentArrayElementIndex + 1) % array.length;
	const backward = (((currentArrayElementIndex - 1) % array.length) + array.length) % array.length;
	const nextArrayElementIndex = direction === 'next' ? forward : backward;
	const newElement = array[nextArrayElementIndex];
	if (direction === 'next' && currentArrayElementIndex > nextArrayElementIndex) overlap++;
	if (direction === 'prev' && currentArrayElementIndex < nextArrayElementIndex) overlap--;
	return { newElement, overlap };
}
