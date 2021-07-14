/** @format */

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
	var token;
	var output;
	var outputQueue = [];
	var opStack = [];
	var args = [];

	var ops = {
		"/": 4,
		"*": 3,
		"+": 2,
		"-": 1,
	};

	var tokens = this.tokenize(program);

	function getNextToken() {
		token = tokens.shift();
	}

	function prevIsSmaller(op1, op2) {
		return ops[op1] <= ops[op2];
	}

	do {
		getNextToken();
		if (token === "[") {
			for (getNextToken(); token !== "]"; getNextToken()) {
				args = [...args, token];
			}
		} else if (!isNaN(token) || args.includes(token)) {
			outputQueue = [...outputQueue, token];
		} else if (isop(token)) {
			var op1 = token;

			for (
				var op2 = opStack[opStack.length - 1];
				opStack.length && isop(op2) && prevIsSmaller(op1, op2);
				op2 = opStack[opStack.length - 1]
			) {
				outputQueue = [...outputQueue, opStack.pop()];
			}
			opStack = [...opStack, op1];
		} else if (token === "(") {
			opStack = [...opStack, token];
		} else if (token === ")") {
			for (
				var nextOperator = opStack[opStack.length - 1];
				opStack.length && nextOperator !== "(";
				nextOperator = opStack[opStack.length - 1]
			) {
				outputQueue = [...outputQueue, opStack.pop()];
			}
			opStack.pop();
		}
	} while (tokens.length);

	while (opStack.length) {
		outputQueue = [...outputQueue, opStack.pop()];
	}

	function getNextOutput() {
		output = outputQueue.pop();
	}

	function buildAST(outputQueue) {
		getNextOutput();
		var node = {};

		if (!isNaN(output)) {
			node.op = "imm";
			node.n = output;
		} else if (args.includes(output)) {
			node.op = "arg";
			node.n = args.indexOf(output);
		} else if (isop(output)) {
			node.op = output;
			var b = buildAST(outputQueue);
			var a = buildAST(outputQueue);
			node.a = a;
			node.b = b;
		}

		return node;
	}

	const res = buildAST(outputQueue);

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

			// right
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

function isop(token) {
	return "*/+-".indexOf(token) !== -1;
}
