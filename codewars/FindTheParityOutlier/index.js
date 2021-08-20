function findOutlier(integers) {
	return integers.slice(0, 3).filter(even).length >= 2
		? integers.find(odd)
		: integers.find(even);
}
function even(num) {
	return num % 2 == 0;
}
function odd(num) {
	return !even(num);
}
