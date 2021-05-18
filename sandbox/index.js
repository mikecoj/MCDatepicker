import MCDatepicker from '../src/js/mc-calendar';
import './style.css';

window.MCDatepicker = MCDatepicker;

const datepickerBTN = document.querySelector('#datepicker_btn');
const inputFourDatepicker = document.querySelector('#datepicker_four');
const setDateInput = document.querySelector('#set_date_input_two');
const setDayInput = document.querySelector('#set_day_input_two');
const setMonthInput = document.querySelector('#set_month_input_two');
const setYearInput = document.querySelector('#set_year_input_two');
const setDateBtn = document.querySelector('#set_date_btn');
const setDayBtn = document.querySelector('#set_day_btn');
const setMonthBtn = document.querySelector('#set_month_btn');
const setYearBtn = document.querySelector('#set_year_btn');

let setDateValue = null;
let setDayValue = null;
let setMonthValue = null;
let setYearValue = null;

const firstDatePicker = MCDatepicker.create({
	el: '#datepicker_one',
	bodyType: 'inline',
	autoClose: true,
	closeOnBlur: true,
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
	minDate: new Date(2019, 2, 22),
	maxDate: new Date(2023, 3, 22),
	markDates: [new Date(2021, 2, 21), new Date(2021, 3, 1)],
	disableYears: [2020],
	disableMonths: [8]
});

firstDatePicker.markDatesCustom((date) => date.getDate() == 5);

firstDatePicker.onSelect((date) => console.log('OK button clicked!'));
firstDatePicker.onSelect((date) => console.log(date));
firstDatePicker.onCancel(() => console.log('Cancel button clicked!'));

const secundDatePicker = MCDatepicker.create({
	el: '#datepicker_two',
	// dateFormat: 'yyyy',
	// dateFormat: 'mm-yyyy',
	bodyType: 'modal',
	// closeOndblclick: false,
	// showCalendarDisplay: false,
	minDate: new Date(2020, 11, 5),
	maxDate: new Date(2021, 0, 16)
});
const thirdDatePicker = MCDatepicker.create({
	el: '#datepicker_three',
	dateFormat: 'mm-yyyy',
	autoClose: true,
	// dateFormat: 'dd-mm-yyyy',
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
	// jumpOverDisabled: false,
	selectedDate: new Date('2020-03-22'),
	disableMonths: [5, 7]
});

const forthDatePicker = MCDatepicker.create({
	dateFormat: 'yyyy',
	selectedDate: new Date('2020-04-04'),
	closeOndblclick: false,
	closeOnBlur: true,
	allowedMonths: [5, 7, 9],
	allowedYears: [2016, 2018, 2020, 2022, 2024, 2026]
});

forthDatePicker.onSelect((date, formatedDate) => {
	inputFourDatepicker.value = formatedDate;
});

datepickerBTN.onclick = () => {
	forthDatePicker.open();
};

forthDatePicker.onCancel(() => alert('The datepicker was closed using CANCEL button'));

// ---------------------

setDateInput.onchange = (e) => {
	// converts string into code ex: new Date(2021, 0, 1)
	setDateValue = eval(e.target.value);
};

setDateBtn.onclick = () => {
	setDateValue !== null && secundDatePicker.setFullDate(setDateValue);
};

// ---------------------

setDayInput.onchange = (e) => {
	setDayValue = Number(e.target.value);
};

setDayBtn.onclick = () => {
	setDayValue !== null && secundDatePicker.setDate(setDayValue);
};

// ---------------------

setMonthInput.onchange = (e) => {
	setMonthValue = Number(e.target.value);
};

setMonthBtn.onclick = () => {
	console.log(setMonthValue);
	setMonthValue !== null && secundDatePicker.setMonth(setMonthValue);
};

// ---------------------

setYearInput.onchange = (e) => {
	setYearValue = Number(e.target.value);
};

setYearBtn.onclick = () => {
	setYearValue !== null && secundDatePicker.setYear(setYearValue);
};
