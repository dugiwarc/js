function smaller(arr) {
	const n = arr.length;
	if (n == 0) return [];
	const sorted = Array.from(new Set(arr)).sort((a, b) => a - b);
	const u = sorted.length;
	const ords = sorted.reduce((h, x, i) => ((h[x] = i), h), {});
	const tree = new Uint16Array(u + 1); // Binary Indexed Tree
	const xs = arr.slice();
	for (let i = n - 1; i >= 0; --i) {
		const k = ords[arr[i]];
		xs[i] = _count(tree, k); // count of visited values ordered before arr[i]
		_incr(tree, k + 1, u);
	}
	return xs;
}

function _count(tree, index) {
	var i = index + 1;
	var sum = 0;
	while (i > 0) (sum += tree[i]), (i -= i & -i);
	return sum;
}

function _incr(tree, index, n) {
	var i = index + 1;
	while (i <= n) ++tree[i], (i += i & -i);
}
