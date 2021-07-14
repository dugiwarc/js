/** @format */

function spiralize(size) {
	if (size == 2)
		return [
			[1, 1],
			[0, 1],
		];
	if (size == 3)
		return [
			[1, 1, 1],
			[0, 0, 1],
			[1, 1, 1],
		];
	var base = spiralize(size - 2);
	var res = [[], []];
	for (var i = 0; i < size; i++) res[0].push(1) && res[1].push(0);
	res[1][size - 1] = 1;
	for (var i = size - 3; i >= 0; i--) {
		res.push(base[i].reverse().concat([0, 1]));
	}
	res[size - 1][size - 2] = 1;
	return res;
}
