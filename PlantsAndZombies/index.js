/** @format */

function plantsAndZombies(lawn, zombies) {
	const map = lawn.map((line) =>
		line
			.split("")
			.map((cell) =>
				cell === "S"
					? { type: "S", damage: 1 }
					: cell !== " "
					? { type: "N", damage: parseInt(cell) }
					: undefined
			)
	);

	const isZombiesLose = () =>
		zombies.length === 0 &&
		map.every((row) => row.every((cell) => !cell || cell.type !== "Z"));

	const isZombiesWin = () => map.some((row) => row[0] && row[0].type === "Z");

	const fireBullet = (direction, x, y) => {
		while (true) {
			if (map[y][x] && map[y][x].type === "Z") {
				map[y][x].hp--;
				if (map[y][x].hp <= 0) map[y][x] = undefined;
				break;
			} else {
				x++;
				y += direction;
			}
			if (x > map[0].length - 1 || y < 0 || y > map.length - 1) break;
		}
	};

	let step = -1;

	while (true) {
		step++;

		if (isZombiesWin()) {
			break;
		}

		// Zombies
		map.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell && cell.type === "Z") {
					map[y][x - 1] = cell;
					map[y][x] = undefined;
				}
			});
		});

		zombies
			.filter(([needStep]) => needStep === step)
			.forEach(
				([needStep, row, hp]) =>
					(map[row][map[row].length - 1] = { type: "Z", hp })
			);
		zombies = zombies.filter(([needStep]) => needStep !== step);

		// Plants
		map.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell && cell.type === "N") {
					for (let i = 0; i < cell.damage; i++) {
						fireBullet(0, x, y);
					}
				}
			});
		});

		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[0].length; x++) {
				if (map[y][x] && map[y][x].type === "S") {
					for (let i = 0; i < map[y][x].damage; i++) {
						fireBullet(0, x, y);
						fireBullet(1, x, y);
						fireBullet(-1, x, y);
					}
				}
			}
		}

		if (isZombiesLose()) {
			break;
		}
	}

	return isZombiesWin() ? step : null;
}
