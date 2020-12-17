/** @format */

function line(grid) {
	let is = (a, b) => b.includes(a),
		moves = [
			[-1, 0],
			[0, 1],
			[1, 0],
			[0, -1],
		],
		g; // `g` used for working grid

	let trav = ([r, c], dir) => {
		g[r][c] = " ";
		let X = moves.map(([R, C]) => [R + r, C + c]); // Coordinates
		let P = X.map(([R, C]) => (g[R] && g[R][C]) || " ").map((d, i) =>
				d != "-|-|"[i] ? d : " "
			),
			[U, R, D, L] = P; // Path pieces
		let go = (d) => trav(X["URDL".indexOf(d)], d); // Recurser

		switch (grid[r][c]) {
			case "X":
				return (
					(dir && g.every((w) => w.every((q) => q == " "))) || // Made it to the end!
					((P.join``.match(/\S/g) || []).length == 1 &&
						go("URDL"[P.findIndex((l) => l != " ")]))
				); // Start...
			case "|":
				return is(dir, "UD") && go(dir); // Keep moving vertically
			case "-":
				return is(dir, "RL") && go(dir); // Keep moving horizontally
			case "+":
				return is(dir, "RL")
					? (is(U, "|+X") && is(D, "- ") && go("U")) ||
							(is(D, "|+X") && is(U, "- ") && go("D")) // Turn from horiz or vert
					: (is(R, "-+X") && is(L, "| ") && go("R")) ||
							(is(L, "-+X") && is(R, "| ") && go("L")); // Turn from vert to horiz
		}
		return false; // Dead end
	};
	return grid.some((w, r) =>
		[...w].some(
			(s, c) => s == "X" && ((g = grid.map((y) => [...y])), trav([r, c]))
		)
	);
}
