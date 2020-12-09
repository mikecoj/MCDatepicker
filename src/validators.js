export function validateOptions(customOptions, defaultOptions) {
	const instanceOptions = { ...defaultOptions, ...customOptions };
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
