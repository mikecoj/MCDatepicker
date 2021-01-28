import { dateFormatValidator } from './validators.js';
import { weekDays, months } from './defaults.js';
import { Is } from './validators.js';

export function noop() {}

export const arrayInfiniteLooper = (array, arrayElement, direction) => {
	let overlap = 0;
	const currentArrayElementIndex = array.indexOf(arrayElement);
	const forward = (currentArrayElementIndex + 1) % array.length;
	const backward = (((currentArrayElementIndex - 1) % array.length) + array.length) % array.length;
	const nextArrayElementIndex = direction === 'next' ? forward : backward;
	const newElement = array[nextArrayElementIndex];
	if (direction === 'next' && currentArrayElementIndex > nextArrayElementIndex) overlap++;
	if (direction === 'prev' && currentArrayElementIndex < nextArrayElementIndex) overlap--;
	return { newElement, overlap };
};

export function slide(
	activeElem,
	newElem,
	dir,
	{ duration = 300, easing = 'ease-in-out', ...customOption } = {}
) {
	const value =
		dir === 'prev' ? activeElem.offsetWidth : dir === 'next' ? activeElem.offsetWidth * -1 : null;

	const animationOptions = {
		// timing options
		duration,
		easing,
		...customOption
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

export const dateFormatParser = (date = new Date(), format = 'dd-mmm-yyyy') => {
	if (Is(date).date() && dateFormatValidator(format).isValid()) {
		const wDay = date.getDay();
		const mDate = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		const flags = {
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
		return dateFormatValidator(format).replaceMatch(flags);
	}
	throw new Error(date + ' Is not a Date object.');
};

export const getCalendarArray = (date) => {
	let calendarArray = [];
	const firstMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);
	let firstCalendarDate = (firstMonthDate.getDay() - 1) * -1;
	while (calendarArray.length < 6) {
		let week = [];
		while (week.length < 7) week.push(firstCalendarDate++);
		calendarArray.push(week);
	}
	return calendarArray;
};

export const valueOfDate = (date) => {
	return date.setHours(0, 0, 0, 0).valueOf();
};
