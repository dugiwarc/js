/** @format */

function toCamelCase(str) {
	var regExp = /[-_]\w/gi;
	return str.replace(regExp, function (match) {
		return match.charAt(1).toUpperCase();
	});
}
