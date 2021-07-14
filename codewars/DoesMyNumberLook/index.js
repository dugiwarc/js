/** @format */

function narcissistic(value) {
	return (
		value
			.toString()
			.split("")
			.map((x, i, arr) => x ** arr.length)
			.reduce((a, b) => +a + +b) === value
	);
}
