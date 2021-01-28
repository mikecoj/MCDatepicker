export const validateOptions = (customOptions, defaultOptions) => {
	const allParametersInclouded = Object.keys(customOptions).every((key) =>
		defaultOptions.hasOwnProperty(item)
	);
	if (!allParametersInclouded) throw new Error('Unrecognized option!');

	return { ...defaultOptions, ...customOptions };
};

export function eventValidator(event, eventDefaults) {}

export const dateFormatValidator = (format) => {
	const validator = /^(?:(d{1,4}|m{1,4}|y{4}|y{2})?\b(?:(?:,\s)|[-\s\/]{1})?(d{1,4}|m{1,4}|y{4}|y{2})?\b(?:(?:,\s)|[-\s\/]{1})?(d{1,4}|m{1,4}|y{4}|y{2})\b(?:(?:,\s)|[-\s\/]{1})?(d{1,4}|m{1,4}|y{2}|y{4})?\b)$/gi;
	const isValid = () => {
		const test = validator.test(format);
		if (!test) throw new TypeError(format + ' Is not a supported format!');
		return test;
	};
	const replaceMatch = (flags) => {
		return format.replace(validator, (match, ...groups) => {
			groups.forEach((group) => {
				if (group) match = match.replace(group, flags[group]);
			});
			return match;
		});
	};
	return { isValid, replaceMatch };
};

export const Is = (variable) => {
	const type = Object.prototype.toString
		.call(variable)
		.match(/\s([a-zA-Z]+)/)[1]
		.toLowerCase();
	const object = () => {
		return type === 'object' ? true : false;
	};
	const array = () => {
		return type === 'array' ? true : false;
	};
	const date = () => {
		return type === 'date' ? true : false;
	};
	const number = () => {
		return type === 'number' ? true : false;
	};
	const string = () => {
		return type === 'string' ? true : false;
	};
	const boolean = () => {
		return type === 'boolean' ? true : false;
	};
	const func = () => {
		return type === 'function' ? true : false;
	};
	return { object, array, date, number, string, boolean, func };
};

const optionsSchema = {
	el: (value) => /^[#][-\w]+$/.test(value),
	dateFormat: (value) => {
		const validator = /^(?:(d{1,4}|m{1,4}|y{4}|y{2})?\b(?:(?:,\s)|[-\s\/]{1})?(d{1,4}|m{1,4}|y{4}|y{2})?\b(?:(?:,\s)|[-\s\/]{1})?(d{1,4}|m{1,4}|y{4}|y{2})\b(?:(?:,\s)|[-\s\/]{1})?(d{1,4}|m{1,4}|y{2}|y{4})?\b)$/i;
		return validator.test(value);
	},
	bodyType: (value) => {
		const types = ['modal', 'inline', 'range', 'permanent'];
		return types.includes(value);
	},
	showCalendarDisplay: (value) => (value) => Is(value).boolean(),
	customWeekDays: (value) => {
		// ['S', 'M', 'T', 'W', 'T', 'F', 'S']
		return (
			Is(value).array() &&
			vlaue.length == 7 &&
			value.every((elem) => /^[A-Za-z]+$|^[0-9]{1,2}$/.test(elem))
		);
	},
	customMonths: (value) => {
		return (
			Is(value).array() &&
			vlaue.length == 12 &&
			value.every((elem) => /^[A-Za-z]+$|^[0-9]{1,2}$/.test(elem))
		);
	},
	selectedDate: (value) => Is(value).date(),
	disableWeekends: (value) => (value) => Is(value).boolean(),
	disableWeekDays: (value) => Is(value).array() && value.every((elem) => /^[0-6]{1}$/.test(elem)), // ex: [0,2,5] accept numbers 0-6;
	disableDates: (value) => Is(value).array() && value.every((elem) => Is(elem).date()), // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	markDates: (value) => Is(value).array() && value.every((elem) => Is(elem).date()), // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	markDatesCustom: (value) => Is(value).func(), // ex: (day) => (date.getDay() === 10)
	daterange: (value) => Is(value).boolean(),
	events: (value) => {
		return Is(value).array() && value.every((elem) => Is(elem).object());
	},
	eventColorScheme: (value) => {
		return Is(value).array() && value.every((elem) => Is(elem).object());
	}
};

const eventSchema = {
	date: (value) => Is(value).date(),
	title: (value) => Is(value).string(),
	description: (value) => Is(value).string()
};

const eventColorTypeSchema = {
	type: (value) => Is(value).string(),
	color: (value) => /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(value)
};

// const schema = {
//   name: value => /^([A-Z][a-z\-]* )+[A-Z][a-z\-]*( \w+\.?)?$/.test(value),
//   age: value => parseInt(value) === Number(value) && value >= 18,
//   phone: value => /^(\+?\d{1,2}-)?\d{3}-\d{3}-\d{4}$/.test(value)
// };

// let info = {
//   name: 'John Doe',
//   age: 20,
//   phone: '123-456-7890'
// };

const validate = (object, schema) => {
	const errors = Object.keys(object)
		.filter((key) => !schema[key](object[key]))
		.map((key) => new Error(`${key} is invalid.`));
	if (errors.length > 0) {
		for (const { message } of errors) {
			console.log(message);
		}
	} else {
		console.log('info is valid');
	}
};
