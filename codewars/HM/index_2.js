const smaller = (a) => {
	const result = [];
	let root = null;
	for (let i = a.length - 1; i >= 0; i--)
		root = insert(a[i], root, result, i, 0);
	return result;
};

const insert = (n, node, r, i, s) => {
	if (node === null) {
		node = new Node(n, 0);
		r[i] = s;
	} else if (node.value === n) {
		node.count++;
		r[i] = s + node.sum;
	} else if (node.value > n) {
		node.sum++;
		node.left = insert(n, node.left, r, i, s);
	} else node.right = insert(n, node.right, r, i, s + node.count + node.sum);
	return node;
};

class Node {
	constructor(v, s) {
		this.value = v;
		this.sum = s;
		this.count = 1;
		this.right = null;
		this.left = null;
	}
}
