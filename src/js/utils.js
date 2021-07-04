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
			sameInstance = prevInstance && prevInstance._id === instance._id;
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

export const uniqueId = (length = 16) => {
	return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length)).toString(16);
};

export const themeParser = (defaultTheme, customTheme) => {
	return {
		theme_color: {
			cssVar: '--mc-theme-color',
			color: customTheme?.theme_color || defaultTheme.theme_color
		},
		main_background: {
			cssVar: '--mc-main-bg',
			color: customTheme?.main_background || defaultTheme.main_background
		},
		active_text_color: {
			cssVar: '--mc-active-text-color',
			color: customTheme?.active_text_color || defaultTheme.active_text_color
		},
		inactive_text_color: {
			cssVar: '--mc-inactive-text-color',
			color: customTheme?.inactive_text_color || defaultTheme.inactive_text_color
		},
		display_foreground: {
			cssVar: '--mc-display-foreground',
			color: customTheme?.display?.foreground || defaultTheme.display.foreground
		},
		display_background: {
			cssVar: '--mc-display-background',
			color:
				customTheme?.display?.background ||
				customTheme?.theme_color ||
				defaultTheme.display.background
		},
		picker_foreground: {
			cssVar: '--mc-picker-foreground',
			color:
				customTheme?.picker?.foreground ||
				customTheme?.active_text_color ||
				defaultTheme.picker.foreground
		},
		picker_background: {
			cssVar: '--mc-picker-background',
			color:
				customTheme?.picker?.background ||
				customTheme?.main_background ||
				defaultTheme.picker.background
		},
		picker_header_active: {
			cssVar: '--mc-picker-header-active',
			color: customTheme?.picker_header?.active || defaultTheme.picker_header.active
		},
		picker_header_inactive: {
			cssVar: '--mc-picker-header-inactive',
			color:
				customTheme?.picker_header?.inactive ||
				customTheme?.inactive_text_color ||
				defaultTheme.picker_header.inactive
		},
		weekday_foreground: {
			cssVar: '--mc-weekday-foreground',
			color:
				customTheme?.weekday?.foreground ||
				customTheme?.theme_color ||
				defaultTheme.weekday.foreground
		},
		button_success_foreground: {
			cssVar: '--mc-btn-success-foreground',
			color:
				customTheme?.button?.success?.foreground ||
				customTheme?.theme_color ||
				defaultTheme.button.success.foreground
		},
		button_danger_foreground: {
			cssVar: '--mc-btn-danger-foreground',
			color: customTheme?.button?.danger?.foreground || defaultTheme.button.danger.foreground
		},
		date_active_default_foreground: {
			cssVar: '--mc-date-active-def-foreground',
			color:
				customTheme?.date?.active?.default?.foreground ||
				customTheme?.active_text_color ||
				defaultTheme.date.active.default.foreground
		},
		date_active_picked_foreground: {
			cssVar: '--mc-date-active-pick-foreground',
			color:
				customTheme?.date?.active?.picked?.foreground || defaultTheme.date.active.picked.foreground
		},
		date_active_picked_background: {
			cssVar: '--mc-date-active-pick-background',
			color:
				customTheme?.date?.active?.picked?.background ||
				customTheme?.theme_color ||
				defaultTheme.date.active.picked.background
		},
		date_active_today_foreground: {
			cssVar: '--mc-date-active-today-foreground',
			color:
				customTheme?.date?.active?.today?.foreground ||
				customTheme?.active_text_color ||
				defaultTheme.date.active.today.foreground
		},
		date_active_today_background: {
			cssVar: '--mc-date-active-today-background',
			color:
				customTheme?.date?.active?.today?.background ||
				customTheme?.inactive_text_color ||
				defaultTheme.date.active.today.background
		},
		date_inactive_default_foreground: {
			cssVar: '--mc-date-inactive-def-foreground',
			color:
				customTheme?.date?.inactive?.default?.foreground ||
				customTheme?.inactive_text_color ||
				defaultTheme.date.inactive.default.foreground
		},
		date_inactive_picked_foreground: {
			cssVar: '--mc-date-inactive-pick-foreground',
			color:
				customTheme?.date?.inactive?.picked?.foreground ||
				customTheme?.theme_color ||
				defaultTheme.date.inactive.picked.foreground
		},
		date_inactive_picked_background: {
			cssVar: '--mc-date-inactive-pick-background',
			color:
				customTheme?.date?.inactive?.picked?.background ||
				customTheme?.theme_color ||
				defaultTheme.date.inactive.picked.background
		},
		date_inactive_today_foreground: {
			cssVar: '--mc-date-inactive-today-foreground',
			color:
				customTheme?.date?.inactive?.today?.foreground ||
				customTheme?.inactive_text_color ||
				defaultTheme.date.inactive.today.foreground
		},
		date_inactive_today_background: {
			cssVar: '--mc-date-inactive-today-background',
			color:
				customTheme?.date?.inactive?.today?.background ||
				customTheme?.inactive_text_color ||
				defaultTheme.date.inactive.today.background
		},
		date_marcked_foreground: {
			cssVar: '--mc-date-marcked-foreground',
			color:
				customTheme?.date?.marcked?.foreground ||
				customTheme?.theme_color ||
				defaultTheme.date.marcked.foreground
		},
		month_year_preview_active_default_foreground: {
			cssVar: '--mc-prev-active-def-foreground',
			color:
				customTheme?.month_year_preview?.active?.default?.foreground ||
				customTheme?.active_text_color ||
				defaultTheme.month_year_preview.active.default.foreground
		},
		month_year_preview_active_picked_foreground: {
			cssVar: '--mc-prev-active-pick-foreground',
			color:
				customTheme?.month_year_preview?.active?.picked?.foreground ||
				customTheme?.active_text_color ||
				defaultTheme.month_year_preview.active.picked.foreground
		},
		month_year_preview_active_picked_background: {
			cssVar: '--mc-prev-active-pick-background',
			color:
				customTheme?.month_year_preview?.active?.picked?.background ||
				defaultTheme.month_year_preview.active.picked.background
		},
		month_year_preview_inactive_default_foreground: {
			cssVar: '--mc-prev-inactive-def-foreground',
			color:
				customTheme?.month_year_preview?.inactive?.default?.foreground ||
				customTheme?.inactive_text_color ||
				defaultTheme.month_year_preview.inactive.default.foreground
		},
		month_year_preview_inactive_picked_foreground: {
			cssVar: '--mc-prev-inactive-pick-foreground',
			color:
				customTheme?.month_year_preview?.inactive?.picked?.foreground ||
				customTheme?.inactive_text_color ||
				defaultTheme.month_year_preview.inactive.picked.foreground
		},
		month_year_preview_inactive_picked_background: {
			cssVar: '--mc-prev-inactive-pick-background',
			color:
				customTheme?.month_year_preview?.inactive?.picked?.background ||
				customTheme?.inactive_text_color ||
				defaultTheme.month_year_preview.inactive.picked.background
		}
	};
};
