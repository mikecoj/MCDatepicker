import {
	CALENDAR_HIDE,
	CALENDAR_SHOW,
	CHANGE_MONTH,
	CHANGE_YEAR,
	DATE_PICK,
	TABLE_UPDATE
} from './events';

export function datepickerShow(elem, input) {
	elem.dispatchEvent(
		new CustomEvent(CALENDAR_SHOW, {
			bubbles: true,
			detail: {
				input: input
			}
		})
	);
}

export function datepickerHide(elem) {
	elem.dispatchEvent(new CustomEvent(CALENDAR_HIDE, { bubbles: true }));
}

export function tableUpdate(elem) {
	elem.dispatchEvent(new CustomEvent(TABLE_UPDATE, { bubbles: true }));
}

// export function datepickerPick(elem, date) {
// 	elem.dispatchEvent(
// 		new CustomEvent('datepicker-pick', {
// 			bubbles: true,
// 			detail: {
// 				date: date
// 			}
// 		})
// 	);
// }

export function dispatchPick(elem) {
	elem.dispatchEvent(
		new CustomEvent(DATE_PICK, {
			bubbles: true,
			detail: {
				date: new Date(elem.getAttribute('data-val-date'))
			}
		})
	);
}

export function monthChange(elem, direction) {
	elem.dispatchEvent(
		new CustomEvent(CHANGE_MONTH, {
			bubbles: true,
			detail: {
				direction: direction
			}
		})
	);
}

export function yearChange(elem, direction) {
	elem.dispatchEvent(
		new CustomEvent(CHANGE_YEAR, {
			bubbles: true,
			detail: {
				direction: direction
			}
		})
	);
}
