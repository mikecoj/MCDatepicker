class Datepicker {
	defaultOptions = {
		el: null,
		type: 'popup',
		dateFormat: 'dd/mm/yy',
		autoShow: true,
		autoHide: false,
		multiselect: false,
	};
	constructor() {
		(this.wDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
			(this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']),
			(this.date = new Date()),
			(this.today = new Date()),
			(this.pickedDate = this.today),
			(this.linkedNode = null),
			(this.parentNode = null);
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
                    <h3 class="mc-display__month">${this.months[this.pickedDate.getMonth()]}</h3>
                    <h2 class="mc-display__year">${this.pickedDate.getFullYear()}</h2>
                </div>
            </div>
        </div>
        <div class="mc-calendar__picker row">
            <div class="mc-picker__header row container-m">
                <div class="mc-picker__select-month row">
                    <a id="mc-picker__month--prev" class="mc-picker__nav mc-picker__nav--prev" href="#">
                        <i class="fas fa-angle-left" aria-hidden="true"></i>
                    </a>
                    <div id="mc-current--month" class="mc-select__data"><span>November</span></div>
                    <a id="mc-picker__month--next" class="mc-picker__nav mc-picker__nav--next" href="#">
                        <i class="fas fa-angle-right" aria-hidden="true"></i>
                    </a>
                </div>
                <div class="mc-picker__select-year row">
                    <a id="mc-picker__year--prev" class="mc-picker__nav mc-picker__nav--prev" href="#">
                        <i class="fas fa-angle-left" aria-hidden="true"></i>
                    </a>
                    <div id="mc-current--year" class="mc-select__data"><span>2020</span></div>
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

		this.writeCalendar(this.date);
		// this.changeMonth();
		// this.changeYear();
		this.updateDisplay();
		this.onButton();
		this.monthYearChangeHandler();

		// this.setColorScheme();
		// this.setColorScheme('#ad415e');
		// this.setColorScheme('#f37c88');
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

	writeCalendar(date) {
		const _this = this;
		const parentNode = _this.parentNode;
		const pickedYear = parentNode.querySelector('#mc-current--year span');
		const pickedMonth = parentNode.querySelector('#mc-current--month span');
		const calBody = parentNode.querySelector('.mc-table__body');
		const fstDate = new Date(date.setDate(1));
		const activeMonth = this.months[fstDate.getMonth()];
		const activeYear = fstDate.getFullYear();
		const weekDay = fstDate.getDay();
		let calendar = [];
		let lastDate = (weekDay - 1) * -1;
		for (let w = 0; w < 6; w++) {
			let week = [];
			for (let d = 0; d < 7; d++) {
				week.push(lastDate);
				lastDate++;
			}
			calendar.push(week);
		}

		let calData = calendar
			.map((w) => {
				return `<tr class="mc-table__week">
					${w
						.map((d) => {
							let dayTemplate;
							let newDate = new Date(fstDate);
							let thisDate = new Date(newDate.setDate(d));
							let classlist = ['mc-date'];
							thisDate.getMonth() != fstDate.getMonth() ? classlist.push('mc-date--inactive') : classlist.push('mc-date--active');

							_this.pickedDate != null && thisDate.setHours(0, 0, 0, 0).valueOf() == _this.pickedDate.setHours(0, 0, 0, 0).valueOf()
								? classlist.push('mc-date--picked')
								: null;

							thisDate.setHours(0, 0, 0, 0).valueOf() == new Date().setHours(0, 0, 0, 0).valueOf() ? classlist.push('mc-date--today') : null;

							dayTemplate = `<td class="${classlist.join(' ')}" data-val-date="${thisDate}">${thisDate.getDate()}</td>`;
							return dayTemplate;
						})
						.join('')}
					</tr>`;
			})
			.join('');
		// pickedMonth.innerHTML = activeMonth;
		// pickedYear.innerHTML = activeYear;
		calBody.innerHTML = calData;

		this.clickedDate();
	}

	updateDisplay() {
		const _this = this;
		_this.parentNode.addEventListener('datepicker-pick', function (e) {
			_this.parentNode.querySelector('.mc-display__day').innerText = _this.wDays[e.detail.date.getDay()];
			_this.parentNode.querySelector('.mc-display__date').innerText = e.detail.date.getDate();
			_this.parentNode.querySelector('.mc-display__month').innerText = _this.months[e.detail.date.getMonth()];
			_this.parentNode.querySelector('.mc-display__year').innerText = e.detail.date.getFullYear();
		});
	}

	clickedDate() {
		const _this = this;
		const parentNode = _this.parentNode;
		const calendar = parentNode.querySelector('.mc-picker__table');
		const dates = calendar.querySelectorAll('.mc-date--active');
		const prevPicked = calendar.querySelectorAll('.mc-date');
		dates.forEach((elem) => {
			elem.addEventListener('click', (e) => {
				let target = e.currentTarget;
				datepickerPick(target, new Date(target.getAttribute('data-val-date')));
				if (!target.classList.contains('mc-date--picked')) {
					target.classList.add('mc-date--picked');
					_this.setPicker = new Date(target.getAttribute('data-val-date'));
					// _this.writeDisplay(_this.pickedDate);
				}
				prevPicked.forEach((elem) => {
					if (elem != target && elem.classList.contains('mc-date--picked')) {
						elem.classList.remove('mc-date--picked');
					}
				});
			});
		});
	}

	monthYearChangeHandler() {
		const _this = this;
		const currentMonth = _this.parentNode.querySelector('#mc-current--month');
		const currentYear = _this.parentNode.querySelector('#mc-current--year');

		currentMonth.addEventListener('month-change', function (e) {
			console.log('Month', e.detail.direction);
		});
		currentYear.addEventListener('year-change', function (e) {
			console.log('Year', e.detail.direction);
		});

		_this.parentNode.querySelector('#mc-picker__month--prev').addEventListener('click', function (e) {
			monthChange(currentMonth, 'prev');
		});
		_this.parentNode.querySelector('#mc-picker__month--next').addEventListener('click', function (e) {
			monthChange(currentMonth, 'next');
		});
		_this.parentNode.querySelector('#mc-picker__year--prev').addEventListener('click', function (e) {
			yearChange(currentYear, 'prev');
		});
		_this.parentNode.querySelector('#mc-picker__year--next').addEventListener('click', function (e) {
			yearChange(currentYear, 'next');
		});
	}

	changeMonth() {
		let clickable = true;
		const _this = this;
		const parentNode = _this.parentNode;
		const prevMonthRow = parentNode.querySelector('#mc-picker__month--prev');
		const nextMonthRow = parentNode.querySelector('#mc-picker__month--next');
		const monthSlider = async (dir) => {
			let transVar;
			const dirObj = {
				prev: {
					dir: 'left',
					translVar: -100,
					mthID: function (monthID, newMonthID, yearNumb) {},
				},
				next: {
					dir: 'right',
					translVar: 100,
				},
			};
			if (clickable) {
				clickable = false;
				const pickedYear = parentNode.querySelector('#mc-current--year span');
				const monthSlider = parentNode.querySelector('#mc-current--month');
				const pickedMonth = monthSlider.querySelector('span');
				let yearNumb = Number(pickedYear.textContent);
				const monthID = _this.months.indexOf(pickedMonth.textContent);
				let newMonthID;

				//TODO: needs to do a universal function for looping through array (carousel)

				monthID == 0 ? ((newMonthID = 11), yearNumb--) : (newMonthID = monthID - 1);
				monthID == 11 ? ((newMonthID = 0), yearNumb++) : (newMonthID = monthID + 1);

				monthSlider.innerHTML += `<span style="transform: translateX(${transVar}px);">${_this.months[newMonthID]}</span>`;
				let slideMonths = monthSlider.querySelectorAll('span');
				await _this.slide(slideMonths[0], slideMonths[1], dir);
				const newDate = new Date(yearNumb, newMonthID, 1);
				_this.writeCalendar(newDate);
				clickable = true;
			}
		};

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
		let parentNode = _this.parentNode;
		let okButton = parentNode.querySelector('#mc-btn__ok');
		let cancelButton = parentNode.querySelector('#mc-btn__cancel');
		let clearButton = parentNode.querySelector('#mc-btn__clear');
		okButton.onclick = (e) => {
			alert(_this.dateFormatString(_this.pickedDate));
		};

		cancelButton.onclick = (e) => {
			datepickerHide(_this.parentNode);
		};

		clearButton.onclick = (e) => {
			let dates = parentNode.querySelectorAll('.mc-date');
			dates.forEach((elem) => {
				elem.classList.contains('mc-date--picked') ? elem.classList.remove('mc-date--picked') : null;
			});
			_this.setPicker = null;
			// _this.writeDisplay(_this.today);
		};
	}

	open() {
		const _this = this;
		this.setPicker = new Date();
		this.writeCalendar(new Date());
		_this.parentNode.classList.toggle('mc-calendar__box--opened');
	}
	close() {
		const _this = this;
		_this.parentNode.classList.toggle('mc-calendar__box--opened');
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
				yyyy: year.toString(),
			};
			if (!unsupportedChar) {
				result = format.replace(wordReg, (match) => {
					if (match === 'yyy') {
						err = new TypeError(match + ' Is not a supported format!');
						console.error(err);
						return flags['yy'];
					} else if (match.match(/d{5,}/) || match.match(/m{5,}/) || match.match(/y{5,}/)) {
						err = new TypeError(match + ' Is not a supported format!');
						console.error(err);

						return flags[match.substring(0, 2)];
					} else {
						return flags[match];
					}
				});
			} else {
				err = new TypeError(format + ' Is not a supported format!');
				console.error(err);
			}
		}

		return result;
	}

	async slide(activeElem, newElem, dir) {
		let value = activeElem.offsetWidth;
		// dir == 'right' ? value : -1 * value;
		if (dir == 'right') {
			value;
		} else if (dir == 'left') {
			value = -1 * value;
		}
		let animationOptions = {
			// timing options
			duration: 200,
			easing: 'ease-in-out',
		};
		await Promise.all([
			activeElem.animate(
				[
					// keyframes
					{ transform: 'translateX(0px)' },
					{ transform: `translateX(${value}px)` },
				],
				animationOptions
			).finished,
			newElem.animate(
				[
					// keyframes
					{ transform: `translateX(${-1 * value}px)` },
					{ transform: 'translateX(0px)' },
				],
				animationOptions
			).finished,
		]);
		activeElem.style.transform = 'translateX(100px)';
		newElem.style.transform = 'translateX(0)';
		activeElem.remove();
	}
}

const methods = {
	open() {},
	close() {},
	onOpen() {},
	onClose() {},
	onSelect() {},
	getDay() {},
	getDate() {},
	getMonth() {},
	getYear() {},
	getFullDate() {},
};

function monthChange(elem, direction, month) {
	elem.dispatchEvent(
		new CustomEvent('month-change', {
			bubbles: true,
			detail: {
				direction: direction,
			},
		})
	);
}

function yearChange(elem, direction, year) {
	elem.dispatchEvent(
		new CustomEvent('year-change', {
			bubbles: true,
			detail: {
				direction: direction,
			},
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
				date: date,
			},
		})
	);
}
