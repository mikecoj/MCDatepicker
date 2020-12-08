/* eslint-disable node/no-unsupported-features/es-syntax */
import Datepicker from '../src/mc-calendar.js';
// import { dispatchPick } from '../src/utils.js';
const picker = new Datepicker();
const options = { el: '#box', something: 'test' };
picker.init(options);
const btn = document.querySelector('#calendar-btn');
btn.onclick = () => {
	// alert();
	picker.open();
};
