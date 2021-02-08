/** @format */

// Stringify a piece of cake
function stringify(cake) {
	return cake.map((e) => e.join("")).join("\n");
}

// Check if this cut is a valid slice
function isAValidSlice(cake, x, y, width, height) {
	// Is not valid if we exceed in width or height
	if (x + width > cake[0].length) return false;
	if (y + height > cake.length) return false;

	console.log("Trying with", x, y, width, height);

	// Do a real slice and convert it to a string
	const slice = cake.slice(y, y + height).map((e) => e.slice(x, x + width));
	const slice_str = stringify(slice);
	console.log("The slice is ");
	console.log(slice_str);

	// If this string has X, we cutted an already cutted cake
	if (slice_str.match(/x/)) {
		console.log("Already cut");
		return false;
	}

	// If this string has exactly one O, then this is valid slice!
	const numberOfO = (slice_str.match(/o/g) || []).length;
	if (numberOfO != 1) {
		console.log("Invalid", numberOfO);
		return false;
	}

	// And return this slice to append to the list of slices
	return slice_str;
}

// Do a cut by inserting X when cake is cutted
function doCut(cake, x, y, width, height) {
	console.log("Cutting", x, y, width, height);
	for (let i = y; i < y + height; i++) {
		for (let j = x; j < x + width; j++) {
			cake[i][j] = "x";
		}
	}
	return cake;
}

// Simply find a top left corner where cake is not cutted
function findFirstTopLeftCorner(cake) {
	for (let i = 0; i < cake.length; i++) {
		for (let j = 0; j < cake[i].length; j++) {
			if (cake[i][j] !== "x") {
				return [i, j];
			}
		}
	}
}

function run(cake, size, slices) {
	console.log("RUN", slices);
	console.log(stringify(cake));

	// First of all, find a top-left corner
	const corner = findFirstTopLeftCorner(cake);
	console.log("Corner", corner);
	// If a corner is not found, the cake is cutted completely
	if (null == corner) return slices;

	let x = corner[1];
	let y = corner[0];

	// Otherwise, cycle over all possibile combination of how we can write SIZE = WIDTH * HEIGHT,
	// but start when Width is the maximum value (for the rules of the Kata)
	for (let width = size; width >= 1; width--) {
		for (let height = 1; height <= size; height++) {
			if (height * width !== size) continue;

			// If this is not valid slice, interrupt this cycle
			const slice = isAValidSlice(cake, x, y, width, height);
			if (!slice) continue;

			// Instead if a valid slice append to the slices
			const newSlices = Object.assign([], slices);
			newSlices.push(slice);

			// And cut the cake (before making a copy)
			let newCake = doCut(
				JSON.parse(JSON.stringify(cake)),
				x,
				y,
				width,
				height
			);

			// And run the algorithm again
			let r = run(newCake, size, newSlices);

			// If the result slice are not empty, we found a result
			if (r.length) {
				console.log("Found", r);
				return r;
			}
		}
	}

	// Otherwise, there's no way to solve this problem bro.
	console.log("Not found");
	return [];
}

function cut(cake) {
	// How many O
	const num = cake.match(/o/g).length;
	// Convert to array
	const cake_array = cake.split("\n").map((e) => e.split(""));

	// Calculate rows and cols
	const rows = cake_array.length;
	const cols = cake_array[0].length;
	// And then determine the size
	const size = (rows * cols) / num;

	// And run the algorithm
	return run(cake_array, size, []);
}
