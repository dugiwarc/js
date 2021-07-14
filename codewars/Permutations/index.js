/** @format */

function permutations(string) {
	if (string.length <= 1) return [string];

	return Array.from(
		new Set(
			string
				.split("")
				.map((character, index) =>
					permutations(
						string.substring(0, index) + string.substring(index + 1)
					).map((returnChar) => character + returnChar)
				)
				.reduce((acc, item) => [...acc, ...item], [])
		)
	);
}
