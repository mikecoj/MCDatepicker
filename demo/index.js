import MCDatepicker from '../src/js/mc-calendar';
import './style.css';

window.MCDatepicker = MCDatepicker;

const firstDatePicker = MCDatepicker.create({ el: '#modal_date', bodyType: 'permanent' });
firstDatePicker.onOpen(() => console.log('onOpen callback function works'));
firstDatePicker.open();
MCDatepicker.create({ el: '#inline_date', bodyType: 'permanent' });
MCDatepicker.create({ el: '#daterange', bodyType: 'modal' });
// MCDatepicker.test('It works!!!');
