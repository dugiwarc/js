/** @format */

var UP = [-1, 0],
	DOWN = [1, 0],
	LEFT = [0, -1],
	RIGHT = [0, 1];

function interpret(code) {
	var grid = extractGrid(code),
		row = 0,
		col = 0,
		direction = RIGHT,
		stringMode = false,
		stack = [],
		output = "";

	while (true) {
		var instr = grid[row][col];

		if (stringMode && instr !== '"') {
			stack.pushNumber(instr.charCodeAt(0));
		} else if (/[0-9]/.test(instr)) {
			stack.pushNumber(instr);
		} else {
			switch (instr) {
				case "+":
					stack.pushNumber(stack.pop() + stack.pop());
					break;
				case "-":
					stack.pushNumber(stack.skipPop() - stack.pop());
					break;
				case "*":
					stack.pushNumber(stack.pop() * stack.pop());
					break;
				case "/":
					stack.pushNumber(stack.skipPop() / stack.pop());
					break;
				case "%":
					stack.pushNumber(stack.skipPop() % stack.pop());
					break;
				case "!":
					stack.pushNumber(stack.pop() ? 0 : 1);
					break;
				case "`":
					stack.pushNumber(stack.skipPop() > stack.pop() ? 1 : 0);
					break;
				case ">":
					direction = [0, 1];
					break;
				case "<":
					direction = [0, -1];
					break;
				case "^":
					direction = [-1, 0];
					break;
				case "v":
					direction = [1, 0];
					break;
				case "?":
					direction = [UP, DOWN, LEFT, RIGHT][Math.floor(Math.random() * 4)];
					break;
				case "_":
					direction = stack.pop() ? LEFT : RIGHT;
					break;
				case "|":
					direction = stack.pop() ? UP : DOWN;
					break;
				case '"':
					stringMode = !stringMode;
					break;
				case ":":
					stack.pushNumber(stack.peek() ? stack.peek() : 0);
					break;
				case "\\":
					stack.pushNumber(stack.skipPop());
					break;
				case "$":
					stack.pop();
					break;
				case ".":
					output += stack.pop();
					break;
				case ",":
					output += String.fromCharCode(stack.pop());
					break;
				case "#":
					advance();
					break;
				case "p":
					grid[stack.pop()][stack.pop()] = String.fromCharCode(stack.pop());
					break;
				case "g":
					stack.pushNumber(grid[stack.pop()][stack.pop()].charCodeAt(0));
					break;
				case "@":
					return output;
				case " ":
					break;
				default:
					throw new Error(
						"Unknown instruction: " + instr.charCodeAt(0) + ' ("' + instr + '")'
					);
			}
		}

		advance();
	}

	function advance() {
		row += direction[0];
		col += direction[1];

		if (row < 0) {
			row = grid.length - 1;
		} else if (row >= grid.length) {
			row = 0;
		}

		if (col < 0) {
			col = grid[row].length - 1;
		} else if (col >= grid[row].length) {
			col = 0;
		}
	}
}

Array.prototype.pushNumber = function (n) {
	if (typeof n === "string") n = parseInt(n, 10);
	if (!Number.isFinite(n)) n = 0;
	this.push(Math.floor(n));
};

Array.prototype.skipPop = function () {
	return this.length > 1 && this.splice(this.length - 2, 1)[0];
};

Array.prototype.peek = function () {
	return this[this.length - 1];
};

function extractGrid(codeString) {
	return codeString.split("\n").map(function (line) {
		return line.split("");
	});
}
