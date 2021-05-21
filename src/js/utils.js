import {
	dispatchCalendarShow,
	dispatchCalendarHide,
	dispatchCalendarUpdate,
	dispatchDisplayUpdate,
	dispatchHeaderUpdate,
	dispatchPreviewUpdate
} from './emiters';
import { dateFormatValidator } from './validators';
import { Is } from './validators';

export function noop() {}

export const getNewIndex = (array, currentIndex, direction) => {
	// get the next array index, if the current index is equal to array.length set the next index to 0
	const forward = (currentIndex + 1) % array.length;
	// get the prev array index, if the current index is equal to 0 set the next index to the last array index
	const backward = (((currentIndex - 1) % array.length) + array.length) % array.length;
	// get the overlap if the next index is greather that array.length
	const forwardOverlap = (currentIndex + 1) / array.length;
	// get the overlap if the index is less that 0
	const backwardOverlap = (currentIndex - array.length) / array.length;
	// get the new Index based on direction
	const newIndex = direction === 'next' ? forward : backward;
	// get overlap based on direction
	const overlap = direction === 'next' ? ~~forwardOverlap : ~~backwardOverlap;
	return { newIndex, overlap };
};

export const getAnimations = (element) => {
	return Promise.all(
		element.getAnimations({ subtree: true }).map((animation) => animation.finished)
	);
};

export const waitFor = (time) => {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, time);
	});
};

export const Animation = () => {
	let promises = null;
	const slide = (activeElem, newElem, dir) => {
		// const activeElementClass = dir === 'prev' ? 'slide-left--out' : 'slide-right--out';
		const activeElementClass = dir === 'prev' ? 'slide-right--out' : 'slide-left--out';
		// const newElementClass = dir === 'prev' ? 'slide-left--in' : 'slide-right--in';
		const newElementClass = dir === 'prev' ? 'slide-right--in' : 'slide-left--in';
		activeElem.classList.add(activeElementClass);
		newElem.classList.add(newElementClass);

		promises = waitFor(150).then(() => {
			// remove the style attribute from the new element
			activeElem.remove();
			newElem.removeAttribute('style');
			newElem.classList.remove(newElementClass);
			//  remove the old span tag
		});
	};
	const onFinish = (callback) => {
		!promises && callback();
		promises && promises.then(() => callback());
		promises = null;
	};
	return { slide, onFinish };
};

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

export const Store = (calendarNodes, dataTarget) => {
	const { calendar, calendarDisplay, calendarHeader, monthYearPreview } = calendarNodes;
	return {
		display: {
			target: dataTarget,
			date: null,
			set setDate(date) {
				this.date = date;
				dispatchDisplayUpdate(calendarDisplay);
			}
		},
		header: {
			target: dataTarget,
			month: null,
			year: null,
			set setTarget(target) {
				this.target = target;
				dispatchHeaderUpdate(calendarHeader);
			},
			set setMonth(month) {
				this.month = month;
				dispatchHeaderUpdate(calendarHeader);
			},
			set setYear(year) {
				this.year = year;
				dispatchHeaderUpdate(calendarHeader);
			}
		},
		preview: {
			target: null,
			month: null,
			year: null,
			set setTarget(target) {
				this.target = target;
				dispatchPreviewUpdate(monthYearPreview);
			},
			set setMonth(month) {
				this.month = month;
				dispatchPreviewUpdate(monthYearPreview);
			},
			set setYear(year) {
				this.year = year;
				dispatchPreviewUpdate(monthYearPreview);
			}
		},
		calendar: {
			date: null,
			set setDate(date) {
				this.date = date;
				dispatchCalendarUpdate(calendar);
			}
		}
	};
};

export const CalendarStateManager = (calendar) => {
	let openTimer = null;
	let closeTimer = null;
	let prevInstance = null;
	let sameInstance = false;

	return {
		opened: false,
		closed: true,
		blured: false,
		isOpening: false,
		isClosing: false,
		isBluring: false,
		open(instance) {
			if (this.isClosing) return;
			sameInstance = JSON.stringify(prevInstance) === JSON.stringify(instance);
			this.isOpening = true;
			clearTimeout(openTimer);
			dispatchCalendarShow(calendar, instance);
			openTimer = setTimeout(() => {
				this.isOpening = false;
				this.opened = true;
				this.closed = false;
				prevInstance = instance;
			}, 200);
		},
		close() {
			if (this.closed || this.isOpening || this.isClosing) return;
			sameInstance = false;
			this.isClosing = true;
			clearTimeout(closeTimer);
			dispatchCalendarHide(calendar);
			closeTimer = setTimeout(() => {
				this.isClosing = false;
				this.opened = false;
				this.closed = true;
			}, 200);
		},
		blur() {
			this.isBluring = true;
			return waitFor(100).then(() => {
				if (this.closed || this.isOpening || this.isClosing) return !sameInstance;
				if (prevInstance && !prevInstance.options.closeOnBlur) return false;
				this.close();
				this.isBluring = false;
				this.blured = true;
				return true;
			});
		}
	};
};
