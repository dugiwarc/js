/** @format */

function encodeRailFenceCipher(string, numberRails) {
	var s = "",
		count = 2 * numberRails - 3;
	for (var i = 0; i < numberRails; i++) {
		var a = count - i * 2,
			b = i * 2 - 1;
		var iterator = [a < 0 ? 0 : a + 1, b < 0 ? 0 : b + 1];
		for (
			var j = i, k = -1;
			j < string.length;
			j += iterator[k % 2] ? iterator[k % 2] : iterator[(k + 1) % 2]
		) {
			s += string[j];
			k++;
		}
	}
	return s;
}

function decodeRailFenceCipher(string, numberRails) {
	var s = [],
		count = 2 * numberRails - 3;
	var globalIndex = 0;
	for (var i = 0; i < numberRails; i++) {
		var a = count - i * 2,
			b = i * 2 - 1;
		var iterator = [a < 0 ? 0 : a + 1, b < 0 ? 0 : b + 1];
		for (
			var j = i, k = -1;
			j < string.length;
			j += iterator[k % 2] ? iterator[k % 2] : iterator[(k + 1) % 2]
		) {
			s[j] = string[globalIndex];
			globalIndex++;
			k++;
		}
	}
	return s.join("");
}
