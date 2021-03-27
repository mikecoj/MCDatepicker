import { dateFormatValidator } from './validators';
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
	]).then(() => {
		newElem.style.transform = 'translateX(0)';
		// remove the old span tag
		activeElem.remove();
	});
}

export const dateFormatParser = (
	date = new Date(),
	{ customWeekDays, customMonths },
	format = 'dd-mmm-yyyy'
) => {
	if (Is(date).date() && dateFormatValidator(format.toLocaleLowerCase()).isValid()) {
		const wDay = date.getDay();
		const mDate = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		const flags = {
			d: String(mDate),
			dd: String(mDate).padStart(2, '0'),
			ddd: customWeekDays[wDay].substr(0, 3),
			dddd: customWeekDays[wDay],
			m: String(month + 1),
			mm: String(month + 1).padStart(2, '0'),
			mmm: customMonths[month].substr(0, 3),
			mmmm: customMonths[month],
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

export const getRectProps = (element) => {
	var rec = element.getBoundingClientRect();
	return {
		t: Math.ceil(rec.top),
		l: Math.ceil(rec.left),
		b: Math.ceil(rec.bottom),
		r: Math.ceil(rec.right),
		w: Math.ceil(rec.width),
		h: Math.ceil(rec.height)
	};
};
const getDimensions = (calendarDIV, linkedElement) => {
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const dh = document.body.offsetHeight;
	const elementDimensions = getRectProps(linkedElement);
	const calendarDimensions = getRectProps(calendarDIV);
	const elementOffsetTop = elementDimensions.t + +window.scrollY;
	const elementOffsetleft = elementDimensions.l + window.scrollX;
	return {
		vw,
		vh,
		dh,
		elementOffsetTop,
		elementOffsetleft,
		elem: elementDimensions,
		cal: calendarDimensions
	};
};
const getOffsetOnView = ({ elem, cal }) => {
	const t = elem.t - cal.h - 10;
	const b = elem.b + cal.h + 10;
	const l = elem.w > cal.w ? elem.l : elem.l - cal.w;
	const r = elem.w > cal.w ? elem.r : elem.r + cal.w;
	return { t, b, l, r };
};

const getOffsetOnDoc = ({ elementOffsetTop, elem, cal }) => {
	const t = elementOffsetTop - cal.h - 10;
	const b = elementOffsetTop + elem.h + cal.h + 10;
	return { t, b };
};

export const calculateCalendarPosition = (calendarDIV, linkedElement) => {
	const allDimensions = getDimensions(calendarDIV, linkedElement);
	const { cal, elem, vw, vh, dh, elementOffsetTop, elementOffsetleft } = allDimensions;
	const offsetOnView = getOffsetOnView(allDimensions);
	const offsetOnDoc = getOffsetOnDoc(allDimensions);
	const moreThanViewMinW = offsetOnView.l > 0 ? true : false;
	const lessThanViewMaxW = vw > offsetOnView.r ? true : false;
	const moreThanViewMinH = offsetOnView.t > 0 ? true : false;
	const lessThanViewMaxH = vh > offsetOnView.b ? true : false;

	const moreThanDocMinH = offsetOnDoc.t > 0 ? true : false;
	const lessThanDocMaxH = dh > offsetOnDoc.b ? true : false;

	let top = null;
	let left = null;
	// calculate left position
	if (lessThanViewMaxW) left = elementOffsetleft;
	if (!lessThanViewMaxW && moreThanViewMinW) left = elementOffsetleft + elem.w - cal.w;
	if (!lessThanViewMaxW && !moreThanViewMinW) left = (vw - cal.w) / 2;

	// calculate top position

	if (lessThanViewMaxH) top = elementOffsetTop + elem.h + 5;
	if (!lessThanViewMaxH && moreThanViewMinH) top = elementOffsetTop - cal.h - 5;
	if (!lessThanViewMaxH && !moreThanViewMinH) {
		if (lessThanDocMaxH) top = elementOffsetTop + elem.h + 5;
		if (!lessThanDocMaxH && moreThanDocMinH) top = elementOffsetTop - cal.h - 5;
		if (!lessThanDocMaxH && !moreThanDocMinH) top = (vh - cal.h) / 2;
	}
	return { top, left };
};

export const HandleArrowClass = (arrow) => {
	const active = () => {
		arrow.classList.remove('mc-select__nav--inactive');
	};
	const inactive = () => {
		arrow.classList.add('mc-select__nav--inactive');
	};

	return { active, inactive };
};
