const defaultOptions = {
	el: null,
	dateFormat: 'DD-MMM-YYYY',
	bodyType: 'modal', // ['modal', 'inline', 'permanent']
	showCalendarDisplay: true,
	customWeekDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	customMonths: [
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
	],
	selectedDate: new Date(),
	disableWeekends: false,
	disableWeekDays: [], // ex: [0,2,5] accept numbers 0-6;
	disableDates: [], // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	markDates: [], // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	markDatesCustom: null, // ex: (day) => (date.getDay() === 10)
	daterange: false,
	events: [],
	eventColorScheme: []
};

export const defaultEventObject = {
	date: new Date(),
	title: 'Title',
	description: ''
};

export const defaultEventColorType = [
	{ type: 'high', color: '#f03048' },
	{ type: 'medium', color: '#008E84' },
	{ type: 'low', color: '#f0d818' },
	{ type: 'slight', color: '#00DDFF' }
];

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

export default defaultOptions;
