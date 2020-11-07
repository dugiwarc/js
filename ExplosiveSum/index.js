/** @format */

function sum(num) {
	const memo = {};

	function sumRecursive(target, max) {
		let partitions = 0;
		for (let i = Math.min(target, max); i > 0; i--) {
			if (i === target || i === 1) partitions++;
			else
				partitions += memo[`${target - i}-${i}`] || sumRecursive(target - i, i);
		}

		memo[`${target}-${max}`] = partitions;
		return partitions;
	}

	return sumRecursive(num, num);
}
