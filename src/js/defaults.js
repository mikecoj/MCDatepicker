export const defaultEventColorType = [
	{ type: 'high', color: '#f03048' },
	{ type: 'medium', color: '#008E84' },
	{ type: 'low', color: '#f0d818' },
	{ type: 'slight', color: '#00DDFF' }
];

export const defaultTheme = {
	theme_color: '#38ada9',
	main_background: '',
	active_text_color: '',
	inactive_text_color: '',
	display: {
		foreground: '',
		background: '#38ada9'
	},
	picker: {
		foreground: '',
		background: ''
	},
	picker_header: {
		active: '',
		inactive: ''
	},
	weekday: {
		foreground: '#38ada9'
	},
	button: {
		success: {
			foreground: '#38ada9'
		},
		danger: {
			foreground: ''
		}
	},
	date: {
		active: {
			default: {
				foreground: ''
			},
			picked: {
				foreground: '',
				background: '#38ada9'
			},
			today: {
				foreground: '',
				background: ''
			}
		},
		inactive: {
			default: {
				foreground: ''
			},
			picked: {
				foreground: '#38ada9',
				background: '#38ada9'
			},
			today: {
				foreground: '',
				background: ''
			}
		}
	},
	month_year_preview: {
		active: {
			default: {
				foreground: ''
			},
			picked: {
				foreground: '',
				background: ''
			}
		},
		inactive: {
			default: {
				foreground: ''
			},
			picked: {
				foreground: '',
				background: ''
			}
		}
	}
};

export const viewLayers = {
	DMY: ['calendar', 'month', 'year'],
	DY: ['calendar', 'month', 'year'],
	D: ['calendar', 'month', 'year'],
	MY: ['month', 'year'],
	M: ['month'],
	Y: ['year']
};

export const weekDays = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
];

export const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

const defaultOptions = {
	el: null,
	context: document,
	dateFormat: 'DD-MMM-YYYY',
	bodyType: 'modal', // ['modal', 'inline', 'permanent']
	autoClose: false,
	closeOndblclick: true,
	closeOnBlur: false,
	showCalendarDisplay: true,
	customWeekDays: weekDays,
	customMonths: months,
	customOkBTN: 'OK',
	customClearBTN: 'Clear',
	customCancelBTN: 'CANCEL',
	firstWeekday: 0, // ex: 1 accept numbers 0-6;
	selectedDate: null,
	minDate: null,
	maxDate: null,
	jumpToMinMax: true,
	jumpOverDisabled: true,
	disableWeekends: false,
	disableWeekDays: [], // ex: [0,2,5] accept numbers 0-6;
	disableDates: [], // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	allowedMonths: [], // ex: [0,1] accept numbers 0-11;
	allowedYears: [], // ex: [2022, 2023]
	disableMonths: [], /// ex: [3,11] accept numbers 0-11;
	disableYears: [], // ex: [2010, 2011]
	markDates: [], // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	theme: defaultTheme
	// TODO: Integrate Daterange Feature
	// daterange: false, // currently not supported
	// TODO: Integrate Events Feature
	// events: [], // currently not supported
	// eventColorScheme: defaultEventColorType // currently not supported
};

export default defaultOptions;
