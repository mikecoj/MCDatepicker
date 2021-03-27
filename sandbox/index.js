import MCDatepicker from '../src/js/mc-calendar';
import './style.css';

window.MCDatepicker = MCDatepicker;

const firstDatePicker = MCDatepicker.create({
	el: '#datepicker_one',
	bodyType: 'inline',
	dateFormat: 'dddd, dd mmmm yyyy',
	disableDates: [new Date(2021, 1, 12), new Date(2021, 4, 15)],
	customWeekDays: ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'],
	customMonths: [
		'Ianuarie',
		'Februarie',
		'Martie',
		'Aprilie',
		'Mai',
		'Iunie',
		'Iulie',
		'August',
		'Septembrie',
		'Octombrie',
		'Noiembrie',
		'Decembrie'
	],
	customOkBTN: 'ok',
	customClearBTN: 'Șterge',
	customCancelBTN: 'Anulează',
	selectedDate: new Date(2021, 1, 18),
	firstWeekday: 1,
	minDate: new Date(2020, 2, 22),
	maxDate: new Date(2021, 3, 22),
	markDates: [new Date(2021, 2, 21), new Date(2021, 3, 1)]
});

firstDatePicker.markDatesCustom((date) => date.getDate() == 5);

firstDatePicker.onSelect((date) => console.log('this is onSelect method'));
firstDatePicker.onSelect((date) => console.log(date));

const secundDatePicker = MCDatepicker.create({
	el: '#datepicker_two',
	bodyType: 'modal',
	showCalendarDisplay: false,
	minDate: new Date(2020, 11, 5),
	maxDate: new Date(2021, 0, 16)
});
const thirdDatePicker = MCDatepicker.create({
	el: '#datepicker_three',
	dateFormat: 'dddd, dd mmmm yyyy',
	customWeekDays: ['Søndag', 'Måneder', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
	customMonths: [
		'Januar',
		'Februar',
		'Marts',
		'April',
		'Maj',
		'Juni',
		'Juli',
		'August',
		'September',
		'Oktober',
		'November',
		'December'
	],
	minDate: new Date('2017-09-25'),
	maxDate: new Date('2020-03-22'),
	jumpToMinMax: false,
	selectedDate: new Date('2020-03-22')
});
