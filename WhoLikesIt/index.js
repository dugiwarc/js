/** @format */

function likes(names) {
	var templates = [
		"no one likes this",
		"{name} likes this",
		"{name} and {name} like this",
		"{name}, {name} and {name} like this",
		"{name}, {name} and {n} others like this",
	];
	var idx = Math.min(names.length, 4);

	return templates[idx].replace(/{name}|{n}/g, function (val) {
		return val === "{name}" ? names.shift() : names.length;
	});
}
