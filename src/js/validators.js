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

export const dateFormatValidator = (format) => {
	const validator = /^(?:(d{1,4}|m{1,4}|y{4}|y{2})?\b(?:(?:,\s)|[-\s\/]{1})?(d{1,4}|m{1,4}|y{4}|y{2})?\b(?:(?:,\s)|[-\s\/]{1})?(d{1,4}|m{1,4}|y{4}|y{2})\b(?:(?:,\s)|[-\s\/]{1})?(d{1,4}|m{1,4}|y{2}|y{4})?\b)$/gi;
	const isValid = () => {
		const test = validator.test(format);
		if (!test) return console.error(new Error(`"${format}" format is not supported`));
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

const validateRequired = (object, schema) => {
	const errors = Object.keys(schema)
		.filter((key) => !schema[key](object[key]))
		.map((key) => new Error(`Data does not match the schema for property: "${key}"`));
	if (errors.length === 0) return true;
	errors.forEach((error) => console.error(error));
	return false;
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

const optionsSchema = {
	el: (value) => /^[#][-\w]+$/.test(value),
	dateFormat: (value) => dateFormatValidator(value).isValid(),
	bodyType: (value) => {
		const types = ['modal', 'inline', 'range', 'permanent'];
		return types.includes(value);
	},
	showCalendarDisplay: (value) => Is(value).boolean(),
	customWeekDays: (value) => {
		// ['S', 'M', 'T', 'W', 'T', 'F', 'S']
		return (
			Is(value).array() &&
			value.length === 7 &&
			value.every((elem) => /^[A-Za-z]+$|^[0-9]{1,2}$/.test(elem))
		);
	},
	customMonths: (value) => {
		return (
			Is(value).array() &&
			value.length === 12 &&
			value.every((elem) => /^[A-Za-z]+$|^[0-9]{1,2}$/.test(elem))
		);
	},
	selectedDate: (value) => Is(value).date(),
	disableWeekends: (value) => Is(value).boolean(),
	disableWeekDays: (value) => Is(value).array() && value.every((elem) => /^[0-6]{1}$/.test(elem)), // ex: [0,2,5] accept numbers 0-6;
	disableDates: (value) => Is(value).array() && value.every((elem) => Is(elem).date()), // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	markDates: (value) => Is(value).array() && value.every((elem) => Is(elem).date()), // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	markDatesCustom: (value) => Is(value).func(), // ex: (day) => (date.getDay() === 10)
	daterange: (value) => Is(value).boolean(),
	events: (value) => {
		return (
			Is(value).array() &&
			value.every((elem) => Is(elem).object() && validateRequired(elem, eventSchema))
		);
	},
	eventColorScheme: (value) => {
		return (
			Is(value).array() &&
			value.every((elem) => Is(elem).object() && validateRequired(elem, eventColorTypeSchema))
		);
	}
};

const validateOptions = (customOptions, defaultOptions) => {
	const errors = Object.keys(customOptions)
		.filter((key) => !defaultOptions.hasOwnProperty(key))
		.map((key) => new Error(`Property "${key}" is not recognized`));
	if (!customOptions.hasOwnProperty('el'))
		errors.unshift(new Error(`Missing required property: "el"`));
	const schemaErrors = Object.keys(customOptions)
		.filter((key) => defaultOptions.hasOwnProperty(key) && !optionsSchema[key](customOptions[key]))
		.map((key) => new Error(`Data does not match the schema for property: "${key}"`));
	if (schemaErrors.length > 0) errors.push(...schemaErrors);
	if (errors.length > 0) return errors.forEach((error) => console.error(error));
	return { ...defaultOptions, ...customOptions };
};

export default validateOptions;
