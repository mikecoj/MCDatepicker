import { dateFormatValidator } from './validators';
import { weekDays, months } from './defaults';
import { Is } from './validators';

export function noop() {}

export const arrayInfiniteLooper = (array, arrayElement, direction) => {
	let overlap = 0;
	// get the index of the current element
	const currentArrayElementIndex = array.indexOf(arrayElement);
	// get the next element, if the current element is the last element in the array, the next element will be the first element of the array
	const forward = (currentArrayElementIndex + 1) % array.length;
	// gets the prev element of the array, if the current one ah index 0, then the prev element will be the last element of the array
	const backward = (((currentArrayElementIndex - 1) % array.length) + array.length) % array.length;
	// get the logic based on direction property
	const nextArrayElementIndex = direction === 'next' ? forward : backward;
	// get the new element from the array
	const newElement = array[nextArrayElementIndex];
	// check the overlap
	if (direction === 'next' && currentArrayElementIndex > nextArrayElementIndex) overlap++;
	if (direction === 'prev' && currentArrayElementIndex < nextArrayElementIndex) overlap--;
	return { newElement, overlap };
};

export function slide(
	activeElem,
	newElem,
	dir,
	{ duration = 150, easing = 'ease-in-out', ...customOption } = {}
) {
	// get the with of the element, and transform it based on dir property
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
	if (Is(date).date() && dateFormatValidator(format.toLocaleLowerCase()).isValid()) {
		const wDay = date.getDay();
		const mDate = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		const flags = {
			d: String(mDate),
			dd: String(mDate).padStart(2, '0'),
			ddd: weekDays[wDay].substr(0, 3),
			dddd: weekDays[wDay],
			m: String(month + 1),
			mm: String(month + 1).padStart(2, '0'),
			mmm: months[month].substr(0, 3),
			mmmm: months[month],
			yy: String(year).substr(2),
			yyyy: String(year)
		};
		return dateFormatValidator(format.toLocaleLowerCase()).replaceMatch(flags);
	}
	throw new Error(date + ' Is not a Date object.');
};

export const valueOfDate = (date) => {
	return date.setHours(0, 0, 0, 0).valueOf();
};
