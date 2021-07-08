import { valueOfDate } from './utils';

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
		const isNaN = Number.isNaN(variable);
		return type === 'number' && !isNaN ? true : false;
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

const isValidColor = (color) => {
	const validator = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/gi;
	return Is(color).string() && validator.test(color);
};

export const dateFormatValidator = (format) => {
	const validator = /^(?:(d{1,4}|m{1,4}|y{4}|y{2})?\b(?:(?:,\s)|[.-\s\/]{1})?(d{1,4}|m{1,4}|y{4}|y{2})?\b(?:(?:,\s)|[.-\s\/]{1})?(d{1,4}|m{1,4}|y{4}|y{2})\b(?:(?:,\s)|[.-\s\/]{1})?(d{1,4}|m{1,4}|y{2}|y{4})?\b)$/gi;

	const isValid = () => {
		// check if the value of the format property match the RegExp
		const test = validator.test(format);
		if (!test) return console.error(new Error(`"${format}" format is not supported`));
		return test;
	};
	const replaceMatch = (flags) => {
		// replace all matched groups with the value of flags
		return format.replace(validator, (match, ...groups) => {
			groups.forEach((group) => {
				if (group) match = match.replace(group, flags[group]);
			});
			return match;
		});
	};
	return { isValid, replaceMatch };
};

const objectKeysValidator = (keys, object) => {
	return (
		Is(object).object() &&
		Is(keys).array() &&
		Object.keys(object).every((key) => keys.includes(key))
	);
	// Is(object).object() && Is(keys).array() && keys.every((key) => object.hasOwnProperty(key))
	// Object.keys(object).every((key) => keys.includes(key))
};

const keyColorValidator = (keys, object) => {
	const hasKeys = objectKeysValidator(keys, object);
	return hasKeys && Object.keys(object).every((key) => isValidColor(object[key]));
};

export const validateRequired = (object, schema) => {
	// check if all object properied match the schema and return a new Error for the property that doesn't match the schema
	const errors = Object.keys(schema)
		.filter((key) => !schema[key](object[key]))
		.map((key) => new Error(`Data does not match the schema for property: "${key}"`));
	if (errors.length === 0) return true;
	errors.forEach((error) => console.error(error));
	return false;
};

const validateOptional = (object, schema) => {
	const schemaErrors = Object.keys(object)
		.filter((key) => schema.hasOwnProperty(key) && !schema[key](object[key]))
		.map((key) => new Error(`Data does not match the schema for property: "${key}"`));
	if (schemaErrors.length === 0) return true;
	schemaErrors.forEach((error) => console.error(error));
	return false;
};

export const eventSchema = {
	date: (value) => Is(value).date(),
	title: (value) => Is(value).string(),
	description: (value) => Is(value).string()
};

export const eventColorTypeSchema = {
	type: (value) => Is(value).string(),
	color: (value) => /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(value)
};

const themeColorSchema = {
	theme_color: (value) => isValidColor(value),
	main_background: (value) => isValidColor(value),
	active_text_color: (value) => isValidColor(value),
	inactive_text_color: (value) => isValidColor(value),
	display: (obj) => keyColorValidator(['foreground', 'background'], obj),
	picker: (obj) => keyColorValidator(['foreground', 'background'], obj),
	picker_header: (obj) => keyColorValidator(['active', 'inactive'], obj),
	weekday: (obj) => keyColorValidator(['foreground'], obj),
	button: (obj) => {
		const objKeys = ['success', 'danger'];
		const validObjectKeys = objectKeysValidator(objKeys, obj);
		return (
			validObjectKeys &&
			Object.keys(obj).every((key) => keyColorValidator(['foreground'], obj[key]))
		);
	},
	date: (obj) => {
		const objKeys = ['active', 'inactive', 'marcked'];
		const validObjectKeys = objectKeysValidator(objKeys, obj);

		const chainValidate = Object.keys(obj).every((key) => {
			const chainObject = obj[key];
			const chainObjKeys = ['default', 'picked', 'today'];
			const validChainObjectKeys = objectKeysValidator(chainObjKeys, chainObject);
			if (key === 'marcked') return keyColorValidator(['foreground'], chainObject);
			const hasValidColors = Object.keys(chainObject).every((key) => {
				const colorTypeArray = key === 'default' ? ['foreground'] : ['foreground', 'background'];
				return keyColorValidator(colorTypeArray, chainObject[key]);
			});
			return validChainObjectKeys && hasValidColors;
		});
		return validObjectKeys && chainValidate;
	},
	month_year_preview: (obj) => {
		const objKeys = ['active', 'inactive'];
		const validObjectKeys = objectKeysValidator(objKeys, obj);

		const chainValidate = Object.keys(obj).every((key) => {
			const chainObject = obj[key];
			const chainObjKeys = ['default', 'picked'];
			const validChainObjectKeys = objectKeysValidator(chainObjKeys, chainObject);
			const hasValidColors = Object.keys(chainObject).every((key) => {
				const colorTypeArray = key === 'default' ? ['foreground'] : ['foreground', 'background'];
				return keyColorValidator(colorTypeArray, chainObject[key]);
			});
			return validChainObjectKeys && hasValidColors;
		});
		return validObjectKeys && chainValidate;
	}
};

const optionsSchema = {
	el: (value) => /^[#][-\w]+$/.test(value),
	context: (value) =>
		value.nodeType == Node.ELEMENT_NODE || value.nodeType == Node.DOCUMENT_FRAGMENT_NODE,
	dateFormat: (value) => dateFormatValidator(value).isValid(),
	bodyType: (value) => {
		const types = ['modal', 'inline', 'permanent'];
		return types.includes(value);
	},
	autoClose: (value) => Is(value).boolean(),
	closeOndblclick: (value) => Is(value).boolean(),
	closeOnBlur: (value) => Is(value).boolean(),
	showCalendarDisplay: (value) => Is(value).boolean(),
	customWeekDays: (value) => {
		// ['S', 'M', 'T', 'W', 'T', 'F', 'S']
		return (
			Is(value).array() && value.length === 7 && value.every((elem) => /^[^\d\s]{2,}$/.test(elem))
		);
	},
	customMonths: (value) => {
		return (
			Is(value).array() && value.length === 12 && value.every((elem) => /^[^\d\s]{2,}$/.test(elem))
		);
	},
	customOkBTN: (value) => Is(value).string(),
	customClearBTN: (value) => Is(value).string(),
	customCancelBTN: (value) => Is(value).string(),
	firstWeekday: (value) => Is(value).number() && /^[0-6]{1}$/.test(value),
	selectedDate: (value) => Is(value).date(),
	minDate: (value) => Is(value).date(),
	maxDate: (value) => Is(value).date(),
	jumpToMinMax: (value) => Is(value).boolean(),
	jumpOverDisabled: (value) => Is(value).boolean(),
	disableWeekends: (value) => Is(value).boolean(),
	disableWeekDays: (value) => Is(value).array() && value.every((elem) => /^[0-6]{1}$/.test(elem)), // ex: [0,2,5] accept numbers 0-6;
	disableDates: (value) => Is(value).array() && value.every((elem) => Is(elem).date()), // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	allowedMonths: (value) =>
		Is(value).array() && value.length < 12 && value.every((elem) => Is(elem).number() && elem < 12),
	allowedYears: (value) => Is(value).array() && value.every((elem) => Is(elem).number()),
	disableMonths: (value) =>
		Is(value).array() && value.length < 12 && value.every((elem) => Is(elem).number() && elem < 12),
	disableYears: (value) => Is(value).array() && value.every((elem) => Is(elem).number()),
	markDates: (value) => Is(value).array() && value.every((elem) => Is(elem).date()), // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
	markDatesCustom: (value) => Is(value).func(), // ex: (day) => (date.getDay() === 10)
	daterange: (value) => Is(value).boolean(),
	theme: (themeObject) =>
		Is(themeObject).object() && validateOptional(themeObject, themeColorSchema),
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

export const validateOptions = (customOptions, defaultOptions) => {
	// filter the object kays and return a new Error for the kays that not match the schema
	const errors = Object.keys(customOptions)
		.filter((key) => !defaultOptions.hasOwnProperty(key))
		.map((key) => new Error(`Property "${key}" is not recognized`));
	// check if the customOption object has the property "el", that is required
	if (
		customOptions.hasOwnProperty('allowedMonths') &&
		customOptions.hasOwnProperty('disableMonths')
	)
		errors.unshift(
			new Error(`"disableMonths" option cannot be used along with "allowedMonths" option`)
		);
	if (customOptions.hasOwnProperty('allowedYears') && customOptions.hasOwnProperty('disableYears'))
		errors.unshift(
			new Error(`"disableYears" option cannot be used along with "allowedYears" option`)
		);
	// check if all object properied match the schema
	const schemaErrors = Object.keys(customOptions)
		.filter((key) => defaultOptions.hasOwnProperty(key) && !optionsSchema[key](customOptions[key]))
		.map((key) => new Error(`Data does not match the schema for property: "${key}"`));

	if (customOptions.hasOwnProperty('minDate') && customOptions.hasOwnProperty('maxDate')) {
		valueOfDate(customOptions.minDate) >= valueOfDate(customOptions.maxDate) &&
			errors.push(new Error('maxDate should be greater than minDate'));
	}
	// merge all errors in one array
	if (schemaErrors.length > 0) errors.push(...schemaErrors);
	// log all errors if the array is not empty
	if (errors.length > 0) return errors.forEach((error) => console.error(error));
	// replace the default properties with the custom ones
	defaultOptions.context = document.body;
	return { ...defaultOptions, ...customOptions };
};
