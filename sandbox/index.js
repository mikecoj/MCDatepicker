import MCDatepicker from '../src/js/mc-calendar';
import './style.css';

window.MCDatepicker = MCDatepicker;

const firstDatePicker = MCDatepicker.create({
	el: '#datepicker_one',
	bodyType: 'inline',
	dateFormat: 'dddd, dd mmmm yyyy',

	// disableWeekDays: [3],
	disableDates: [new Date(2021, 1, 12), new Date(2021, 3, 15)]
	// disableWeekends: true
});

firstDatePicker.onSelect((date) => console.log('this is onSelect method'));
firstDatePicker.onSelect((date) => console.log(date));

console.log(firstDatePicker.linkedElement);
// firstDatePicker.onOpen(() => {
// 	firstDatePicker.destroy();
// });
// firstDatePicker.open();
const secundDatePicker = MCDatepicker.create({
	el: '#datepicker_two',
	bodyType: 'modal'
	// showCalendarDisplay: false
});
const thirdDatePicker = MCDatepicker.create({ el: '#datepicker_three', bodyType: 'permanent' });

// offsetTop: 128;
// offsetLeft: 261;
// offsetHeight: 19;
// offsetWidth: 173;
