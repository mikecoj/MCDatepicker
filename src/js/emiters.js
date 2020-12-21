export function datepickerShow(elem) {
	elem.dispatchEvent(new CustomEvent('show-calendar', { bubbles: true }));
}

export function datepickerHide(elem) {
	elem.dispatchEvent(new CustomEvent('hide-calendar', { bubbles: true }));
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
		new CustomEvent('date-pick', {
			bubbles: true,
			detail: {
				date: new Date(elem.getAttribute('data-val-date'))
			}
		})
	);
}

export function monthChange(elem, direction) {
	elem.dispatchEvent(
		new CustomEvent('month-change', {
			bubbles: true,
			detail: {
				direction: direction
			}
		})
	);
}

export function yearChange(elem, direction) {
	elem.dispatchEvent(
		new CustomEvent('year-change', {
			bubbles: true,
			detail: {
				direction: direction
			}
		})
	);
}
