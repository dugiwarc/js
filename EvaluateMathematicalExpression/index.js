/** @format */

function calc(expr) {
	var expressionToParse = expr.replace(/\s+/g, "").split("");

	function peek() {
		return expressionToParse[0] || "";
	}

	function get() {
		return expressionToParse.shift();
	}

	function number() {
		var result = get();
		while ((peek() >= "0" && peek() <= "9") || peek() == ".") {
			result += get();
		}
		return parseFloat(result);
	}

	function factor() {
		if (peek() >= "0" && peek() <= "9") {
			return number();
		} else if (peek() == "(") {
			get(); // '('
			var result = expression();
			get(); // ')'
			return result;
		} else if (peek() == "-") {
			get();
			return -factor();
		}
		return 0; // error
	}

	function term() {
		var result = factor();
		while (peek() == "*" || peek() == "/") {
			if (get() == "*") {
				result *= factor();
			} else {
				result /= factor();
			}
		}
		return result;
	}

	function expression() {
		var result = term();
		while (peek() == "+" || peek() == "-") {
			if (get() == "+") {
				result += term();
			} else {
				result -= term();
			}
		}
		return result;
	}

	return expression();
}
