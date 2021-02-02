import { CALENDAR_HIDE, CALENDAR_SHOW, CHANGE_MONTH, CHANGE_YEAR, DATE_PICK } from './events';

export const dispatchCalendarShow = (elem, input) => {
	elem.dispatchEvent(
		new CustomEvent(CALENDAR_SHOW, {
			bubbles: true,
			detail: {
				input: input
			}
		})
	);
};

export const dispatchCalendarHide = (elem) => {
	elem.dispatchEvent(new CustomEvent(CALENDAR_HIDE, { bubbles: true }));
};

export const dispatchDatePick = (elem) => {
	elem.dispatchEvent(
		new CustomEvent(DATE_PICK, {
			bubbles: true,
			detail: {
				date: new Date(elem.getAttribute('data-val-date'))
			}
		})
	);
};

export const dispatchChangeMonth = (elem, direction) => {
	elem.dispatchEvent(
		new CustomEvent(CHANGE_MONTH, {
			bubbles: true,
			detail: {
				direction: direction
			}
		})
	);
};

export const dispatchChangeYear = (elem, direction) => {
	elem.dispatchEvent(
		new CustomEvent(CHANGE_YEAR, {
			bubbles: true,
			detail: {
				direction: direction
			}
		})
	);
};
