/** @format */

device.decode = function (w) {
	var chars =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,? ";
	return w.replace(/./g, function (c, i) {
		var code = chars.indexOf(c) + 1;
		while (i-- >= 0) code = code % 2 ? (code + 67) / 2 : code / 2;
		return code ? chars[code - 1] : c;
	});
};
