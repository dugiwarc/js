/** @format */

const topThreeWords = (text) => {
	let total = (text.toLowerCase().match(/\b[a-z']+\b/g) || []).reduce(
		(acc, cur) => ((acc[cur] = (acc[cur] || 0) + 1), acc),
		{}
	);
	return Object.keys(total)
		.sort((a, b) => total[b] - total[a])
		.slice(0, 3);
};
