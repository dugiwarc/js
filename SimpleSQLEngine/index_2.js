/** @format */

function tokenize(source) {
	const tokens = [];
	const patterns = {
		kw: /^(?:SELECT|FROM|JOIN|ON|WHERE)\b/i,
		number: /^-?\d+(?:\.\d+)?/,
		string: /^(?:'[^']*')+/,
		punct: /^[.,]/,
		name: /^[0-9A-Za-z_]+/,
		cmp: /^(?:<=|>=|<>|<|>|=)/,
		ws: /^\s+/,
	};
	lex: while (source.length > 0) {
		let matched = false;
		for (const type in patterns) {
			source = source.replace(patterns[type], (value) => {
				tokens.push({ type, value });
				matched = true;
				return "";
			});
			if (matched) {
				continue lex;
			}
		}
		throw new Error(`Unexpected character: ${source[0]}`);
	}
	return tokens
		.filter((token) => token.type !== "ws")
		.map((token) =>
			token.type === "kw"
				? { type: "kw", value: token.value.toUpperCase() }
				: token
		)
		.concat({ type: "other", value: "EOF" });
}

function parse(tokens) {
	let i = 0;
	const raise = (message) => {
		throw new Error(message);
	};
	const peek = () => tokens[i];
	const next = () => tokens[i++];
	const match = (value) => peek().value === value;
	const matchT = (type) => peek().type === type;
	const expect = (value) =>
		match(value) ? next() : raise(`Expected ${value}`);
	const expectT = (type) => (matchT(type) ? next() : raise(`Expected ${type}`));

	const parseSelect = () => {
		expect("SELECT");
		const columns = [parseColumn()];
		while (match(",")) {
			columns.push(expect(",") && parseColumn());
		}
		expect("FROM");
		const table = expectT("name").value;
		const joins = [];
		while (match("JOIN")) {
			expect("JOIN");
			joins.push({
				table: expectT("name").value,
				condition: expect("ON") && parseCondition(),
			});
		}
		let where;
		if (match("WHERE")) {
			where = next() && parseCondition();
		}
		return { columns, table, joins, where };
	};

	const parseCondition = () => ({
		lhs: parseValue(),
		op: expectT("cmp").value,
		rhs: parseValue(),
	});

	const parseColumn = () => ({
		table: expectT("name").value,
		column: expect(".") && expectT("name").value,
	});

	const parseValue = () =>
		matchT("number")
			? parseFloat(next().value)
			: matchT("string")
			? next().value.slice(1, -1).replace(/''/g, "'")
			: parseColumn();

	return parseSelect();
}

const comparators = {
	"=": (a, b) => a === b,
	"<": (a, b) => a < b,
	">": (a, b) => a > b,
	"<=": (a, b) => a <= b,
	">=": (a, b) => a >= b,
	"<>": (a, b) => a !== b,
};

function execute(db, query) {
	const get = (row, path) =>
		typeof path === "object" ? row[path.table][path.column] : path;

	let rows = db[query.table].map((row) => {
		return { [query.table]: row };
	});

	if (query.joins.length > 0) {
		for (const join of query.joins) {
			const result = [];
			for (const row of rows) {
				for (const other of db[join.table]) {
					const res = Object.assign({}, row, { [join.table]: other });
					const lhs = get(res, join.condition.lhs);
					const rhs = get(res, join.condition.rhs);
					if (comparators[join.condition.op](lhs, rhs)) {
						result.push(res);
					}
				}
			}
			rows = result;
		}
	}

	if (query.where) {
		rows = rows.filter((res) => {
			const lhs = get(res, query.where.lhs);
			const rhs = get(res, query.where.rhs);
			return comparators[query.where.op](lhs, rhs);
		});
	}

	return rows.map((row) => {
		const res = {};
		for (const path of query.columns) {
			res[`${path.table}.${path.column}`] = row[path.table][path.column];
		}
		return res;
	});
}

function SQLEngine(db) {
	return {
		execute(sql) {
			const tokens = tokenize(sql);
			const query = parse(tokens);
			return execute(db, query);
		},
	};
}
