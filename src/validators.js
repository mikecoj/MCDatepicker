export function validateOptions(customOptions, defaultOptions) {
	const allParametersInclouded = reqParams.every((item) =>
		defaultOptions.some((param) => param.name === item)
	);
	if (!allParametersInclouded) throw new Error('Unrecognized option!');

	return { ...defaultOptions, ...customOptions };
}
export function dateFormatValidator(format) {
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
}

export function eventValidator(event, eventDefaults) {}

const isArray = (variable) => {
	return Array.isArray(variable);
};

const isDate = (variable) => {
	return variable instanceof Date;
};

const isString = (variable) => {
	return typeof variable === 'string' || variable instanceof String ? true : false;
};

const Is = (variable) => {
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
	return { object, array, date, number, string, boolean };
};
