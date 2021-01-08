/** @format */

const snail = (array) => {
	if (array.length === 1) return [...array[0]];

	return [
		...array[0].concat(snail(rotateLeftArray(array.slice(1, array.length)))),
	];
};

const rotateLeftArray = (array) => {
	const size = array[0].length;

	if (size === 1) return [array.reduce((acc, item) => [...acc, ...item], [])];

	const arrayToPassDown = array.reduce(
		(acc, item) => [...acc, item.slice(0, size - 1)],
		[]
	);

	return [array.reduce((acc, item) => [...acc, item[size - 1]], [])].concat(
		rotateLeftArray(arrayToPassDown)
	);
};
