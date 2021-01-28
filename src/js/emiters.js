import { CALENDAR_HIDE, CALENDAR_SHOW, CHANGE_MONTH, CHANGE_YEAR, DATE_PICK } from './events';

export function datepickerShow(elem) {
	elem.dispatchEvent(new CustomEvent(CALENDAR_SHOW, { bubbles: true }));
}

export function datepickerHide(elem) {
	elem.dispatchEvent(new CustomEvent(CALENDAR_HIDE, { bubbles: true }));
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
