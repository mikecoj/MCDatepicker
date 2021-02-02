import MCDatepicker from '../src/js/mc-calendar';
import './style.css';

window.MCDatepicker = MCDatepicker;

const firstDatePicker = MCDatepicker.create({
	el: '#modal_date',
	bodyType: 'permanent',
	dateFormat: 'dddd, dd mmmm yyyy',
	// disableWeekDays: [3],
	disableDates: [new Date(2021, 1, 12), new Date(2021, 3, 15)]
	// disableWeekends: true
});
firstDatePicker.onOpen(() => {
	firstDatePicker.destroy();
});
// firstDatePicker.open();
MCDatepicker.create({ el: '#inline_date', bodyType: 'permanent' });
MCDatepicker.create({ el: '#daterange', bodyType: 'modal' });
