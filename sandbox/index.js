import MCDatepicker from '../src/js/mc-calendar';
import './style.css';

window.MCDatepicker = MCDatepicker;

const firstDatePicker = MCDatepicker.create({
	el: '#datepicker_one',
	bodyType: 'inline',
	dateFormat: 'dddd, dd mmmm.yyyy',
	disableDates: [new Date(2021, 1, 12), new Date(2021, 3, 15)]
});

firstDatePicker.onSelect((date) => console.log('this is onSelect method'));
firstDatePicker.onSelect((date) => console.log(date));

const secundDatePicker = MCDatepicker.create({
	el: '#datepicker_two',
	bodyType: 'modal'
});
const thirdDatePicker = MCDatepicker.create({ el: '#datepicker_three', bodyType: 'permanent' });
