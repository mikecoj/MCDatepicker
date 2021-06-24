import {
	CALENDAR_HIDE,
	CALENDAR_SHOW,
	CALENDAR_UPDATE,
	DISPLAY_UPDATE,
	PREVIEW_UPDATE,
	HEADER_UPDATE,
	CHANGE_MONTH,
	CHANGE_YEAR,
	DATE_PICK,
	PREVIEW_PICK,
	SET_DATE,
	CANCEL
} from './events';

export const dispatchCalendarShow = (elem, instance) => {
	elem.dispatchEvent(
		new CustomEvent(CALENDAR_SHOW, {
			bubbles: true,
			detail: {
				instance
			}
		})
	);
};

export const dispatchCalendarHide = (elem) => {
	elem.dispatchEvent(new CustomEvent(CALENDAR_HIDE, { bubbles: true }));
};

export const dispatchDisplayUpdate = (elem) => {
	elem.dispatchEvent(new CustomEvent(DISPLAY_UPDATE, { bubbles: true }));
};

export const dispatchCalendarUpdate = (elem) => {
	elem.dispatchEvent(new CustomEvent(CALENDAR_UPDATE, { bubbles: true }));
};

export const dispatchPreviewUpdate = (elem) => {
	elem.dispatchEvent(new CustomEvent(PREVIEW_UPDATE, { bubbles: true }));
};

export const dispatchHeaderUpdate = (elem) => {
	elem.dispatchEvent(new CustomEvent(HEADER_UPDATE, { bubbles: true }));
};

export const dispatchDatePick = (elem, dblclick = false) => {
	elem.dispatchEvent(
		new CustomEvent(DATE_PICK, {
			bubbles: true,
			detail: {
				dblclick,
				date: new Date(elem.getAttribute('data-val-date'))
			}
		})
	);
};

export const dispatchChangeMonth = (elem, direction) => {
	elem.dispatchEvent(
		new CustomEvent(CHANGE_MONTH, {
			bubbles: true,
			detail: { direction }
		})
	);
};

export const dispatchChangeYear = (elem, direction) => {
	elem.dispatchEvent(
		new CustomEvent(CHANGE_YEAR, {
			bubbles: true,
			detail: { direction }
		})
	);
};

export const dispatchPreviewCellPick = (elem, dblclick = false) => {
	elem.dispatchEvent(
		new CustomEvent(PREVIEW_PICK, {
			bubbles: true,
			detail: {
				dblclick,
				data: elem.children[0].innerHTML
			}
		})
	);
};

export const dispatchSetDate = (elem, detail = { instance: null, date: null }) => {
	elem.dispatchEvent(
		new CustomEvent(SET_DATE, {
			bubbles: true,
			detail
		})
	);
};

export const dispatchCancel = (elem) => {
	elem.dispatchEvent(new CustomEvent(CANCEL, { bubbles: true }));
};