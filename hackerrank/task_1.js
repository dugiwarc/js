function solution(n) {
	// write your code in JavaScript (Node.js 8.9.4)

	let finalGap = 0;

	// 1 is 0
	if (n === 1) {
		return 0;
	}
	// use the unsigned right shift bitwise operator to coerce n to unsigned int
	let binaryRep = (n >>> 0).toString(2);

	let tempGap = 0;

	// the binary representation must start with 1 we continue counting the 0 while
	// we found a new one, and then return the longest binary gap
	// the binary numbers ending on 0 cant be counted because it should be 1 0000..1
	// to be a valid gap
	for (let x = 0; x < binaryRep.length; x++) {
		if (binaryRep[x] == "1") {
			if (tempGap > finalGap) {
				finalGap = tempGap;
			}

			tempGap = 0;
			continue;
		}

		if (binaryRep[x] == "0") {
			tempGap++;
		}
	}

	return finalGap;
}
