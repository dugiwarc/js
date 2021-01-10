/** @format */

const rgb = (r, g, b) => `${toHex(r)}${toHex(g)}${toHex(b)}`;

const toHex = (num) => {
	return num < 0
		? "00"
		: num > 255
		? "FF"
		: `0${Number(num).toString(16)}`.slice(-2).toUpperCase();
};
