import { valueOfDate } from './utils';

export const isLessThanMinDate = (targetDate, prevMinDate) => {
	if (targetDate && prevMinDate) return valueOfDate(targetDate) < valueOfDate(prevMinDate);
	return false;
};

export const isMoreThanMaxDate = (targetDate, nextMaxDate) => {
	if (targetDate && nextMaxDate) return valueOfDate(targetDate) > valueOfDate(nextMaxDate);
	return false;
};

export const isActiveMonth = (options, monthTarget) => {
	const { allowedMonths, disableMonths } = options;
	return allowedMonths.length
		? allowedMonths.includes(monthTarget)
		: !disableMonths.includes(monthTarget);
};

export const isActiveYear = (options, YearTarget) => {
	const { disableYears, allowedYears } = options;
	return allowedYears.length
		? allowedYears.includes(YearTarget)
		: !disableYears.includes(YearTarget);
};

export const isSelectable = (instance, dayObject) => {
	const { prevLimitDate, nextLimitDate } = instance;
	const { date } = dayObject;
	const smallerTanMin = prevLimitDate ? valueOfDate(date) < valueOfDate(prevLimitDate) : false;
	const biggerTanMax = nextLimitDate ? valueOfDate(nextLimitDate) < valueOfDate(date) : false;
	return smallerTanMin || biggerTanMax;
};

export const isInActiveMonth = (activeMonth, dayObject) => {
	const { month } = dayObject;
	return month !== activeMonth ? false : true;
};

export const isExcludedWeekend = (options, dayObject) => {
	const { disableWeekends } = options;
	const { day } = dayObject;
	if (!disableWeekends) return false;
	return day === 0 || day === 6 ? true : false;
};

export const isDisabledWeekDay = (options, dayObject) => {
	const { disableWeekDays } = options;
	const { day } = dayObject;
	if (!disableWeekDays.length) return false;
	return disableWeekDays.some((weekDay) => weekDay === day);
};

export const isDisabledDate = (options, dayObject) => {
	const { disableDates } = options;
	const { date } = dayObject;
	if (!disableDates.length) return false;
	return disableDates.some((disabledDate) => valueOfDate(disabledDate) === valueOfDate(date));
};

export const isPicked = (pickedDate, dayObject) => {
	const { date } = dayObject;

	if (pickedDate === null) return false;

	return valueOfDate(pickedDate) === valueOfDate(date) ? true : false;
};

export const isMarked = (instance, dayObject) => {
	const { options, markCustomCallbacks } = instance;
	const { date } = dayObject;
	const optionMark = options.markDates.some(
		(markedDate) => valueOfDate(markedDate) === valueOfDate(date)
	);
	const customMark = markCustomCallbacks.some((callback) => callback.apply(null, [date]));

	return optionMark || customMark;
};

export const isToday = (dayObject) => {
	const { date } = dayObject;
	return valueOfDate(date) === valueOfDate(new Date()) ? true : false;
};
