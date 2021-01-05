/** @format */
const permutations = (str) => {
	if (str.length <= 1) return [str];

	return Array.from(
		new Set(
			str
				.split("")
				.map((char, index) =>
					permutations(str.substring(0, index) + str.substring(index + 1)).map(
						(p) => char + p
					)
				)
				.reduce((acc, item) => [...acc, item], [])
		)
	);
};
