export function monthChange(elem, direction, month) {
	elem.dispatchEvent(
		new CustomEvent('month-change', {
			bubbles: true,
			detail: {
				direction: direction
			}
		})
	);
}

export function yearChange(elem, direction, year) {
	elem.dispatchEvent(
		new CustomEvent('year-change', {
			bubbles: true,
			detail: {
				direction: direction
			}
		})
	);
}

export function datepickerShow(elem) {
	elem.dispatchEvent(new CustomEvent('datepicker-show', { bubbles: true }));
}

export function datepickerHide(elem) {
	elem.dispatchEvent(new CustomEvent('datepicker-hide', { bubbles: true }));
}

export function datepickerPick(elem, date) {
	elem.dispatchEvent(
		new CustomEvent('datepicker-pick', {
			bubbles: true,
			detail: {
				date: date
			}
		})
	);
}

export function dispatchPick(elem) {
	elem.dispatchEvent(
		new CustomEvent('datepicker-pick', {
			bubbles: true,
			detail: {
				date: new Date(elem.getAttribute('data-val-date'))
			}
		})
	);
}

export function arrayInfiniteLooper(array, arrayElement, direction) {
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

export function slide(activeElem, newElem, dir) {
	let value = activeElem.offsetWidth;
	if (dir == 'prev') {
		value;
	} else if (dir == 'next') {
		value = -1 * value;
	}
	const animationOptions = {
		// timing options
		duration: 300,
		easing: 'ease-in-out'
	};
	return Promise.all([
		activeElem.animate(
			[
				// keyframes
				{ transform: 'translateX(0px)' },
				{ transform: `translateX(${value}px)` }
			],
			animationOptions
		).finished,
		newElem.animate(
			[
				// keyframes
				{ transform: `translateX(${-1 * value}px)` },
				{ transform: 'translateX(0px)' }
			],
			animationOptions
		).finished
	]);
}

export function dateFormatString(date = new Date(), format = 'dd-mmm-yyyy') {
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

export function alert() {
	console.log('It works');
}
