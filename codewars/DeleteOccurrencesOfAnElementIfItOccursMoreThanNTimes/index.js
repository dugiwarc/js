function deleteNth(arr, n) {
	return arr.reduce(
		(acc, item) => {
			return {
				...acc,
				res: acc[item] >= n ? acc.res : [...acc.res, item],
				[item]: ~~acc[item] + 1,
			};
		},
		{ res: [] },
	).res;
}
