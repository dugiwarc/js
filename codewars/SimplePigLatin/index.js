/** @format */

function pigIt(str) {
	//Code here
	const punctuations = "!,.:?";
	return str
		.split(" ")
		.reduce((acc, item) => {
			if (!punctuations.includes(item))
				return [...acc, `${item.substring(1, item.length)}${item.charAt(0)}ay`];
			else return [...acc, item];
		}, [])
		.join(" ");
}

// Something more elegant
function pigIt(str) {
	return str.replace(/(\w)(\w*)/g, "$2$1ay");
}
