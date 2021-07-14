/** @format */

function toPostfix(infix) {
	var postFix = "";
	var operatorStack = [];
	var operators = new Operators();

	infix.split("").forEach(function (token) {
		var operator = operators.getOperator(token);

		if (!operator) {
			postFix += token;
			return;
		}

		if (operator.isLeftParenthesis()) {
			operatorStack.push(operator);
			return;
		}

		if (operator.isRightParenthesis()) {
			while (
				operatorStack.length &&
				!operatorStack[operatorStack.length - 1].isLeftParenthesis()
			)
				postFix += operatorStack.pop();
			operatorStack.pop();
			return;
		}

		while (
			operatorStack.length &&
			operator.isNotPreceding(operatorStack[operatorStack.length - 1])
		)
			postFix += operatorStack.pop();
		operatorStack.push(operator);
	});
	while (operatorStack.length) postFix += operatorStack.pop();
	return postFix;
}

var Operator = function (operatorSymbol, precedence, associativity) {
	this.operatorSymbol = operatorSymbol;
	this.precedence = precedence;
	this.associativity = associativity;

	this.isNotPreceding = function (operator) {
		return (
			(this.associativity === "left" &&
				this.precedence <= operator.precedence) ||
			(this.associativity === "right" && this.precedence < operator.precedence)
		);
	};

	this.isLeftParenthesis = function () {
		return this.operatorSymbol === "(";
	};

	this.isRightParenthesis = function () {
		return this.operatorSymbol === ")";
	};

	this.toString = function () {
		return this.operatorSymbol;
	};
};

var Operators = function () {
	this.operators = [
		new Operator("(", 1, ""),
		new Operator(")", 1, ""),
		new Operator("+", 2, "left"),
		new Operator("-", 2, "left"),
		new Operator("*", 3, "left"),
		new Operator("/", 3, "left"),
		new Operator("^", 4, "right"),
	];

	this.getOperator = function (operatorSymbol) {
		var filterredOperators = this.operators.filter(function (findOperator) {
			return findOperator.operatorSymbol === operatorSymbol;
		});

		return filterredOperators.length ? filterredOperators[0] : null;
	};
};
