import MCDatepicker from '../src/js/mc-calendar';
import './style.css';

window.MCDatepicker = MCDatepicker;

MCDatepicker.create({ el: '#modal_date' });
MCDatepicker.test('It works!!!');
