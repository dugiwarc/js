/** @format */

// Bomb #1: Bomb.key => 42
Bomb.diffuse(42);

// Bomb #2: Call it five times
for (i = 0; i < 5; ++i) Bomb.diffuse();

// Bomb #3: Global variable
Bomb.diffuse(BombKey);

// Bomb #4: Manually define the global function
function diffuseTheBomb() {
	return 1;
}
Bomb.diffuse();

// Bomb #5: base64 decode on the Net
Bomb.diffuse(3.14159);

// Bomb #6: Today minus 4 years
date = new Date();
date.setFullYear(date.getFullYear() - 4);
Bomb.diffuse(date);

// Bomb #7: Freeze it, so the value does not change with assignment
code = { key: 43 };
Object.freeze(code);
Bomb.diffuse(code);

// Bomb #8: Compare (>,<) ops call valueOf(), so we can use outer state to satisfy both
value = 9;
obj = {
	valueOf: function () {
		ret = value;
		value = 11;
		return ret;
	},
};
Bomb.diffuse(obj);

// Bomb #9: Same by modifying Math.random (0.5 ** 1/3 does not work, so we need state machine again)
cnt = 0;
Math.random = function () {
	if (cnt++ == 2) return 0.5;
	else return 1;
};
Bomb.diffuse(42);

// Bomb #10: I enjoyed the challenge, so I entered 'yes' in base64 :)
Array.prototype.valueOf = function () {
	return this.reduce(function (x, y) {
		return x + y;
	}, 0);
};
Bomb.diffuse("eWVz");
