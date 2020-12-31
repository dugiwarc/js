/** @format */

function spinWords(string) {
	return string.replace(/\w{5,}/g, function (w) {
		return w.split("").reverse().join("");
	});
}
