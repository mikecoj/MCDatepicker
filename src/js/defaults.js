export const defaultEventColorType = [
	{ type: 'high', color: '#f03048' },
	{ type: 'medium', color: '#008E84' },
	{ type: 'low', color: '#f0d818' },
	{ type: 'slight', color: '#00DDFF' }
];

export const defaultTheme = {
	theme_color: '#38ada9',
	main_background: '#f5f5f6',
	active_text_color: 'rgb(0, 0, 0)',
	inactive_text_color: 'rgba(0, 0, 0, 0.2)',
	display: {
		foreground: 'rgba(255, 255, 255, 0.8)',
		background: '#38ada9'
	},
	picker: {
		foreground: 'rgb(0, 0, 0)',
		background: '#f5f5f6'
	},
	picker_header: {
		active: '#818181',
		inactive: 'rgba(0, 0, 0, 0.2)'
	},
	weekday: {
		foreground: '#38ada9'
	},
	button: {
		success: {
			foreground: '#38ada9'
		},
		danger: {
			foreground: '#e65151'
		}
	},
	date: {
		active: {
			default: {
				foreground: 'rgb(0, 0, 0)'
			},
			picked: {
				foreground: '#ffffff',
				background: '#38ada9'
			},
			today: {
				foreground: 'rgb(0, 0, 0)',
				background: 'rgba(0, 0, 0, 0.2)'
			}
		},
		inactive: {
			default: {
				foreground: 'rgba(0, 0, 0, 0.2)'
			},
			picked: {
				foreground: '#38ada9',
				background: '#38ada9'
			},
			today: {
				foreground: 'rgba(0, 0, 0, 0.2)',
				background: 'rgba(0, 0, 0, 0.2)'
			}
		},
		marcked: {
			foreground: '#38ada9'
		}
	},
	month_year_preview: {
		active: {
			default: {
				foreground: 'rgb(0, 0, 0)'
			},
			picked: {
				foreground: 'rgb(0, 0, 0)',
				background: 'rgba(0, 0, 0,0.2)'
			}
		},
		inactive: {
			default: {
				foreground: 'rgba(0, 0, 0, 0.2)'
			},
			picked: {
				foreground: 'rgba(0, 0, 0, 0.2)',
				background: 'rgba(0, 0, 0, 0.2)'
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
	context: null,
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
