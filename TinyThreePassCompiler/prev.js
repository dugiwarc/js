/** @format */

function isNumber(token) {
	return !isNaN(token);
}

function isOperator(token) {
	return "*/+-".indexOf(token) !== -1;
}

function Compiler() {}

Compiler.prototype.compile = function (program) {
	return this.pass3(this.pass2(this.pass1(program)));
};

Compiler.prototype.tokenize = function (program) {
	// Turn a program string into an array of tokens.  Each token
	// is either '[', ']', '(', ')', '+', '-', '*', '/', a variable
	// name or a number (as a string)
	var regex = /\s*([-+*/\(\)\[\]]|[A-Za-z]+|[0-9]+)\s*/g;
	return program
		.replace(regex, ":$1")
		.substring(1)
		.split(":")
		.map(function (tok) {
			return isNaN(tok) ? tok : tok | 0;
		});
};

Compiler.prototype.pass1 = function (program) {
	var tokens = this.tokenize(program);

	function getNextToken() {
		token = tokens.shift();
	}

	function precedenceIsNotGreater(o1, o2) {
		var precedences = {
			"/": 4,
			"*": 3,
			"+": 2,
			"-": 1,
		};
		return precedences[o1] <= precedences[o2];
	}

	var token;
	var outputQueue = [];
	var operatorStack = [];
	var args = [];

	do {
		getNextToken();
		if (token === "[") {
			for (getNextToken(); token !== "]"; getNextToken()) {
				args.push(token);
			}
		} else if (isNumber(token) || args.includes(token)) {
			outputQueue.push(token);
		} else if (isOperator(token)) {
			var o1 = token;
			for (
				var o2 = operatorStack[operatorStack.length - 1];
				operatorStack.length &&
				isOperator(o2) &&
				precedenceIsNotGreater(o1, o2);
				o2 = operatorStack[operatorStack.length - 1]
			) {
				outputQueue.push(operatorStack.pop());
			}
			operatorStack.push(o1);
		} else if (token === "(") {
			operatorStack.push(token);
		} else if (token === ")") {
			for (
				var nextOperator = operatorStack[operatorStack.length - 1];
				operatorStack.length && nextOperator !== "(";
				nextOperator = operatorStack[operatorStack.length - 1]
			) {
				outputQueue.push(operatorStack.pop());
			}
			operatorStack.pop();
		}
	} while (tokens.length);

	while (operatorStack.length) {
		outputQueue.push(operatorStack.pop());
	}

	var output;

	function getNextOutput() {
		output = outputQueue.pop();
	}

	function buildAst(outputQueue) {
		getNextOutput();
		var node = {};

		if (isNumber(output)) {
			node.op = "imm";
			node.n = output;
		} else if (args.includes(output)) {
			node.op = "arg";
			node.n = args.indexOf(output);
		} else if (isOperator(output)) {
			node.op = output;
			var b = buildAst(outputQueue);
			var a = buildAst(outputQueue);
			node.a = a;
			node.b = b;
		}

		return node;
	}

	const res = buildAst(outputQueue);
	return res;
};

Compiler.prototype.pass2 = function (ast) {
	function reduceTree(ast) {
		if (ast.op === "imm" || ast.op === "arg") {
			return ast;
		}
		ast.a = reduceTree(ast.a);
		ast.b = reduceTree(ast.b);

		if (ast.a.op === "imm" && ast.b.op === "imm") {
			var n = eval("" + ast.a.n + ast.op + ast.b.n);
			return {
				op: "imm",
				n: n,
			};
		}

		return ast;
	}

	const reducedTree = reduceTree(ast);

	return reducedTree;
};

Compiler.prototype.pass3 = function (ast) {
	var operatorMap = {
		"+": "AD",
		"-": "SU",
		"*": "MU",
		"/": "DI",
	};

	var operationDepths = {};
	var maxDepth = -Infinity;

	function markDepth(ast, depth = 0) {
		if (ast.a && ast.b) {
			maxDepth = Math.max(maxDepth, depth);
			if (!operationDepths[depth]) {
				operationDepths[depth] = [];
			}
			operationDepths[depth].push(ast);
			markDepth(ast.a, depth + 1);
			markDepth(ast.b, depth + 1);
		}
	}

	markDepth(ast);
	var asm = [];

	var currentDepth = maxDepth;
	while (currentDepth >= 0) {
		currentDepthOperations = operationDepths[currentDepth];
		while (currentDepthOperations.length) {
			var currentOperation = currentDepthOperations.shift();

			// Handle right branch
			if (currentOperation.b.op === "imm") {
				asm.push("IM " + currentOperation.b.n);
			} else if (currentOperation.b.op === "arg") {
				asm.push("AR " + currentOperation.b.n);
			} else {
				asm.push("PO");
			}

			asm.push("SW");

			// Handle left branch
			if (currentOperation.a.op === "imm") {
				asm.push("IM " + currentOperation.a.n);
			} else if (currentOperation.a.op === "arg") {
				asm.push("AR " + currentOperation.a.n);
			} else {
				asm.push("PO");
			}

			// Apply operation
			asm.push(operatorMap[currentOperation.op]);

			// Push result to stack
			asm.push("PU");
		}
		currentDepth--;
	}

	return asm;
};

function simulate(asm, args) {
	var r0 = undefined;
	var r1 = undefined;
	var stack = [];
	asm.forEach(function (instruct) {
		var match = instruct.match(/(IM|AR)\s+(\d+)/) || [0, instruct, 0];
		var ins = match[1];
		var n = match[2] | 0;

		if (ins == "IM") {
			r0 = n;
		} else if (ins == "AR") {
			r0 = args[n];
		} else if (ins == "SW") {
			var tmp = r0;
			r0 = r1;
			r1 = tmp;
		} else if (ins == "PU") {
			stack.push(r0);
		} else if (ins == "PO") {
			r0 = stack.pop();
		} else if (ins == "AD") {
			r0 += r1;
		} else if (ins == "SU") {
			r0 -= r1;
		} else if (ins == "MU") {
			r0 *= r1;
		} else if (ins == "DI") {
			r0 /= r1;
		}
	});
	return r0;
}
