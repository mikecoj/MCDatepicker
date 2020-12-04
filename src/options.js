const optionsDefault = {
	el: null,
	dateFormat: 'DD-MMM-YYYY',
	bodyType: 'popup', // ['popup', 'inline', 'static']
	showCalendarDisplay: true,
	customWeekDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	customMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	selectedDate: new Date(),
	disableWeekends: false,
	sisableDays: false,
	disableDates: [], // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	markDates: [], // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	markDatesCustom: null, // ex: (day) => (date.getDay() === 10)
	daterange: false,
	events: [
		{
			date: '5-Dec-2020',
			title: `mom's Birth Day`,
			description: `Don't forget to congratulate her`
		},
		{
			date: '25-Dec-2020',
			title: 'Christmas',
			description: 'Merry Christmas everyone'
		}
	]
};
