/** @format */

function pathFinder(maze) {
	let map = maze.split("\n").map((s) => [...s].map((x) => +x));
	let n = map.length;
	let m = map[0].length;
	let space = [...Array(n)].map((i) => [...Array(m)].fill(Infinity));

	function Node(i, j, cost) {
		this.i = i;
		this.j = j;
		this.cost = cost;
	}

	let nodes = [new Node(0, 0, 0)];
	space[0][0] = 0;

	let di = [0, -1, 0, 1];
	let dj = [-1, 0, 1, 0];
	while (nodes.length > 0) {
		let min = nodes[0].cost;
		let minIndex = 0;
		for (let k = 1; k < nodes.length; k++) {
			if (nodes[k].cost < min) {
				min = nodes[k].cost;
				minIndex = k;
			}
		}
		let cur = nodes.splice(minIndex, 1)[0];
		if (cur.i == n - 1 && cur.j == m - 1) {
			return cur.cost;
		}
		for (let k = 0; k < 4; k++) {
			let i1 = cur.i + di[k];
			let j1 = cur.j + dj[k];
			let t = space[i1];
			if (!t || t[j1] === undefined) {
				continue;
			}
			let cost = cur.cost + Math.abs(map[i1][j1] - map[cur.i][cur.j]);
			if (cost < t[j1]) {
				t[j1] = cost;
				nodes.push(new Node(i1, j1, cost));
			}
		}
	}

	return space[n - 1][m - 1];
}
