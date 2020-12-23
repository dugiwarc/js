/** @format */

function persistence(num) {
	return num < 10
		? 1
		: 1 +
				persistence(
					num
						.toString()
						.split("")
						.reduce((total, item) => {
							return total * item;
						}, 1)
				);
}
