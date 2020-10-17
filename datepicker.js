class Datepicker {
	template = `
        	<div class="m-display">
        		<div class="m-display-header">
        			<div class="d-h-day"><span>September</span></div>
        		</div>
        		<div class="m-display-body">
        			<div class="d-b-container">
        				<div class="d-b-c-date"><span>14</span></div>
        				<div class="d-b-c-month"><span>Monday</span></div>
        			</div>
        		</div>
        		<div class="m-display-footer">
        			<div class="d-f-year"><span>2020</span></div>
        		</div>
        	</div>
			<div class="m-cal">
				<div class="m-cal-header">
					<div class="mch-month-yar-picker">
						<div class="month-picker">
							<i class="fas fa-angle-left"></i>
							<div class="month-picker-slide">
								<span>September</span>
							</div>
							<i class="fas fa-angle-right"></i>
					 	</div>
						<div class="year-picker">
							<i class="fas fa-angle-left"></i>
							<div class="year-picker-slide">
								<span>2020</span>
							</div>
							<i class="fas fa-angle-right"></i>
						</div>
						<ul class="mch-picker-option">
						</ul>
					</div>
				</div>
				<div class="m-cal-body">
					<table class="calendar-table">
						<thead class="weekday-header">
							<tr>
								<th class="m-cal-weekday">S</th>
								<th class="m-cal-weekday">M</th>
								<th class="m-cal-weekday">T</th>
								<th class="m-cal-weekday">W</th>
								<th class="m-cal-weekday">T</th>
								<th class="m-cal-weekday">F</th>
								<th class="m-cal-weekday">S</th>
							</tr>
						</thead>
						<tbody id="m-cal-table-body"></tbody>
					</table>
				</div>
				<div class="m-cal-footer">
					<div class="mcf-btn-rej">
						<input id="m-cal-btn-clear" type="button" value="Clear" />
					</div>
					<div class="mcf-buttons">
						<input id="m-cal-btn-cancel" type="button" value="CANCEL" />
						<input id="m-cal-btn-ok" type="button" value="OK" />
					</div>
				</div>
			</div>
		</div>`;
	constructor() {
		(this.wDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
			(this.months = [
				'January',
				'Febuary',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			]),
			(this.date = new Date()),
			(this.today = new Date()),
			(this.pickedDate = this.today),
			(this.parentNode = null);
	}

	init(
		options = {
			el: '#m-calendar',
		}
	) {
		const parentElem = document.querySelector(options.el);
		const parent = document.createElement('div');
		parent.className = 'm-container';
		this.setParentNode = parent;
		parentElem.appendChild(this.parentNode);
		this.writeCalendar(this.date);
		this.changeMonth();
		this.changeYear();
		this.writeDisplay(new Date());
		this.onButton();
		// this.setColorScheme();
		// this.setColorScheme('#ad415e');
		// this.setColorScheme('#f37c88');
	}

	set setPicker(date) {
		this.pickedDate = date;
	}

	set setParentNode(node) {
		node.innerHTML = this.template;
		this.parentNode = node;
	}

	writeCalendar(date) {
		const _this = this;
		const parentNode = _this.parentNode;
		const pickedYear = parentNode.querySelector('.year-picker span');
		const pickedMonth = parentNode.querySelector('.month-picker span');
		const calBody = parentNode.querySelector('#m-cal-table-body');
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
				return `<tr class="m-cal-table-week">
					${w
						.map((d) => {
							let dayTemplate;
							let newDate = new Date(fstDate);
							let thisDate = new Date(newDate.setDate(d));
							let classlist = ['m-cal-date'];
							thisDate.getMonth() != fstDate.getMonth()
								? classlist.push('inactive-date')
								: classlist.push('active-date');

							_this.pickedDate != null &&
							thisDate.setHours(0, 0, 0, 0).valueOf() ==
								_this.pickedDate.setHours(0, 0, 0, 0).valueOf()
								? classlist.push('picked-date')
								: null;

							thisDate.setHours(0, 0, 0, 0).valueOf() == new Date().setHours(0, 0, 0, 0).valueOf()
								? classlist.push('today-date')
								: null;

							dayTemplate = `<td class="${classlist.join(
								' '
							)}" data-val-date="${thisDate}">${thisDate.getDate()}</td>`;
							return dayTemplate;
						})
						.join('')}
					</tr>`;
			})
			.join('');
		pickedMonth.innerHTML = activeMonth;
		pickedYear.innerHTML = activeYear;
		calBody.innerHTML = calData;

		this.clickedDate();
	}

	writeDisplay(date) {
		const _this = this;
		const parentNode = _this.parentNode;
		const display = parentNode.querySelector('.m-display');
		const month = display.querySelector('.d-b-c-month span');
		const year = display.querySelector('.d-f-year span');
		const dateNumb = display.querySelector('.d-b-c-date span');
		const weekDay = display.querySelector('.d-h-day span');
		month.innerText = _this.months[date.getMonth()];
		year.innerText = date.getFullYear();
		dateNumb.innerText = date.getDate();
		weekDay.innerText = _this.wDays[date.getDay()];
	}

	clickedDate() {
		const _this = this;
		const parentNode = _this.parentNode;
		const calendar = parentNode.querySelector('.calendar-table');
		const dates = calendar.querySelectorAll('.m-cal-date.active-date');
		const prevPicked = calendar.querySelectorAll('.m-cal-date');
		dates.forEach((elem) => {
			elem.addEventListener('click', (e) => {
				let target = e.currentTarget;
				if (!target.classList.contains('picked-date')) {
					target.classList.add('picked-date');
					_this.setPicker = new Date(target.getAttribute('data-val-date'));
					_this.writeDisplay(_this.pickedDate);
				}
				prevPicked.forEach((elem) => {
					if (elem != target && elem.classList.contains('picked-date')) {
						elem.classList.remove('picked-date');
					}
				});
			});
		});
	}

	changeMonth() {
		let clickable = true;
		const _this = this;
		const parentNode = _this.parentNode;
		const prevMonthRow = parentNode.querySelector('.month-picker .fa-angle-left');
		const nextMonthRow = parentNode.querySelector('.month-picker .fa-angle-right');
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
				const pickedYear = parentNode.querySelector('.year-picker span');
				const monthSlider = parentNode.querySelector('.month-picker-slide');
				const pickedMonth = monthSlider.querySelector('span');
				let yearNumb = Number(pickedYear.textContent);
				const monthID = _this.months.indexOf(pickedMonth.textContent);
				let newMonthID;

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
		// monthCell.onclick = (e) => {
		// 	let option = parentNode.querySelector('.mch-picker-option');
		// 	option.innerHTML = `${_this.months
		// 		.map((elem) => {
		// 			return `<li>${elem}</li>`;
		// 		})
		// 		.join('')}`;
		// 	option.style.display = 'block';
		// 	console.log(e.target);
		// };
		prevMonthRow.addEventListener('click', async () => {
			if (clickable) {
				clickable = false;
				const pickedYear = parentNode.querySelector('.year-picker span');
				const monthSlider = parentNode.querySelector('.month-picker-slide');
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
				const pickedYear = parentNode.querySelector('.year-picker span');
				const monthSlider = parentNode.querySelector('.month-picker-slide');
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
		const prevYearRow = parentNode.querySelector('.year-picker .fa-angle-left');
		const nextYearRow = parentNode.querySelector('.year-picker .fa-angle-right');

		const monthSlider = () => {};

		prevYearRow.addEventListener('click', async () => {
			if (clickable) {
				clickable = false;
				const yearSlider = parentNode.querySelector('.year-picker-slide');
				const pickedYear = yearSlider.querySelector('span');
				const pickedMonth = parentNode.querySelector('.month-picker-slide span');
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
				const yearSlider = parentNode.querySelector('.year-picker-slide');
				const pickedYear = yearSlider.querySelector('span');
				const pickedMonth = parentNode.querySelector('.month-picker-slide span');
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
		let okButton = parentNode.querySelector('#m-cal-btn-ok');
		let cancelButton = parentNode.querySelector('#m-cal-btn-cancel');
		let clearButton = parentNode.querySelector('#m-cal-btn-clear');
		okButton.onclick = (e) => {
			alert(_this.dateFormatString(_this.pickedDate));
		};

		cancelButton.onclick = (e) => {
			_this.close();
		};

		clearButton.onclick = (e) => {
			let dates = parentNode.querySelectorAll('.m-cal-date');
			dates.forEach((elem) => {
				elem.classList.contains('picked-date') ? elem.classList.remove('picked-date') : null;
			});
			_this.setPicker = null;
			_this.writeDisplay(_this.today);
		};
	}

	open() {
		this.setPicker = new Date();
		this.writeCalendar(new Date());
		let parentNode = this.parentNode;
		parentNode.style.display = 'flex';
		setTimeout(() => {
			parentNode.style.transform = 'scale(1, 1)';
			parentNode.style.opacity = '1';
		}, 0);
	}
	close() {
		let parentNode = this.parentNode;
		parentNode.style.transform = 'scale(0.5, 0.5)';
		parentNode.style.opacity = '0';
		setTimeout(() => {
			parentNode.style.display = 'none';
		}, 200);
	}

	dateFormatString(date = new Date(), format = 'dd-mmm-yyyy') {
		let result = null;
		if (date != null) {
			let unsuportedChar = format.match(/[^dmy,-\s\/]/g);
			const wordReg = /(d|m|y)+/g;
			let wDay = date.getDay();
			let mDate = date.getDate();
			let month = date.getMonth();
			let year = date.getFullYear();
			const months = [
				'January',
				'Febuary',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			];
			const weekDays = [
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
			];
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
			if (!unsuportedChar) {
				result = format.replace(wordReg, (match) => {
					if (match === 'yyy') {
						err = new TypeError(match + ' Is not a suported format!');
						console.error(err);
						return flags['yy'];
					} else if (match.match(/d{5,}/) || match.match(/m{5,}/) || match.match(/y{5,}/)) {
						err = new TypeError(match + ' Is not a suported format!');
						console.error(err);

						return flags[match.substring(0, 2)];
					} else {
						return flags[match];
					}
				});
			} else {
				err = new TypeError(format + ' Is not a suported format!');
				console.error(err);
			}
		}

		return result;
	}

	// setColorScheme(H = '#38ada9') {
	// 	let rootCSS = document.documentElement;
	// 	// Convert hex to RGB first
	// 	let r = 0,
	// 		g = 0,
	// 		b = 0;
	// 	if (H.length == 4) {
	// 		r = '0x' + H[1] + H[1];
	// 		g = '0x' + H[2] + H[2];
	// 		b = '0x' + H[3] + H[3];
	// 	} else if (H.length == 7) {
	// 		r = '0x' + H[1] + H[2];
	// 		g = '0x' + H[3] + H[4];
	// 		b = '0x' + H[5] + H[6];
	// 	}
	// 	// Then to HSL
	// 	r /= 255;
	// 	g /= 255;
	// 	b /= 255;
	// 	let cmin = Math.min(r, g, b),
	// 		cmax = Math.max(r, g, b),
	// 		delta = cmax - cmin,
	// 		h = 0,
	// 		s = 0,
	// 		l = 0;

	// 	if (delta == 0) h = 0;
	// 	else if (cmax == r) h = ((g - b) / delta) % 6;
	// 	else if (cmax == g) h = (b - r) / delta + 2;
	// 	else h = (r - g) / delta + 4;

	// 	h = Math.round(h * 60);

	// 	if (h < 0) h += 360;

	// 	l = (cmax + cmin) / 2;
	// 	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	// 	s = +(s * 100).toFixed(1);
	// 	l = +(l * 100).toFixed(1);

	// 	let colors = {
	// 		main_bg_color: `hsl(${h},0%,96%)`,
	// 		light_bg_color: `hsl(${h},${Math.round(s)}%,${Math.round(l)}%)`,
	// 		dark_bg_color: `hsl(${h},${Math.round(s + 49) < 100 ? Math.round(s + 49) : 100}%,${
	// 			Math.round(l - 20) > 0 ? Math.round(l - 20) : 0
	// 		}%)`,
	// 		year_color: `hsl(${h},${Math.round(s - 10) > 0 ? Math.round(s - 10) : 0}%,${
	// 			Math.round(l + 34) < 100 ? Math.round(l + 34) < 100 : 100
	// 		}%)`,
	// 		inactive_white_color: `hsl(${h},0%,75%)`,
	// 		active_white_color: `hsl(0,100%,0%)`,
	// 		inactive_black_color: `hsla(${h}, 0%, 0%, 0.8)`,
	// 		active_black_color: `hsl(0,0%,0%)`,
	// 	};
	// 	console.log(colors);
	// 	rootCSS.style.setProperty('--main-bg-color', colors.main_bg_color);
	// 	rootCSS.style.setProperty('--light-bg-color', colors.light_bg_color);
	// 	rootCSS.style.setProperty('--dark-bg-color', colors.dark_bg_color);
	// 	rootCSS.style.setProperty('--year-color', colors.year_color);
	// 	rootCSS.style.setProperty('--inactive-white-color', colors.inactive_white_color);
	// 	rootCSS.style.setProperty('--active-white-color', colors.active_white_color);
	// 	rootCSS.style.setProperty('--inactive-black-color', colors.inactive_black_color);
	// 	rootCSS.style.setProperty('--active-black-color', colors.active_black_color);
	// }

	async slide(activElem, newElem, dir) {
		let value = activElem.offsetWidth;
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
			activElem.animate(
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
		activElem.style.transform = 'translateX(100px)';
		newElem.style.transform = 'translateX(0)';
		activElem.remove();
	}
}
