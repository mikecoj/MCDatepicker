export const methods = {
	open() {},
	close() {},
	onOpen() {},
	onClose() {},
	onSelect() {},
	getDay() {},
	getDate() {},
	getMonth() {},
	getYear() {},
	getFullDate() {}
};

export const name = 'Mike';

slide(activeElem, newElem, dir) {
		let value = activeElem.offsetWidth;
		// console.log(value);
		dir == 'prev' ? -1 * value : null;
		// if (dir == 'next') {
		// 	value;
		// } else if (dir == 'prev') {
		// 	value = -1 * value;
		// }
		let animationOptions = {
			// timing options
			duration: 1000,
			easing: 'ease-in-out'
		};
		Promise.all([
			activeElem.animate(
				[
					// keyframes
					{ transform: 'translateX(0px)' },
					{ transform: `translateX(${value}px)` }
				],
				animationOptions
			).finished,
			newElem.animate(
				[
					// keyframes
					{ transform: `translateX(${-1 * value}px)` },
					{ transform: 'translateX(0px)' }
				],
				animationOptions
			).finished
		]).then(() => {
			activeElem.style.transform = 'translateX(100px)';
			newElem.style.transform = 'translateX(0)';
			activeElem.remove();
		});
	}
