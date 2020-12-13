/** @format */

const operators = {
	"=": (l, r) => l === r,
	"<>": (l, r) => l !== r,
	">": (l, r) => l > r,
	">=": (l, r) => l >= r,
	"<": (l, r) => l < r,
	"<=": (l, r) => l <= r,
};

const parseClauses = (query) => {
	const fromIdx = query.search(/ from /gi);
	let whereIdx = query.search(/ where /gi);
	whereIdx = whereIdx === -1 ? query.length : whereIdx;

	return {
		select: query.slice(0, fromIdx),
		from: query.slice(fromIdx, whereIdx),
		where: query.slice(whereIdx),
	};
};

const parseSelect = (select) =>
	select
		.slice(6)
		.replace(" ", "")
		.split(",")
		.map((s) => s.trim());

const parseFrom = (from) => from.slice(5).split(/ join /gi);

const parseWhere = (where) => {
	const opIdx = where.search(new RegExp(Object.keys(operators).join("|")));

	if (opIdx === -1) {
		return () => true;
	}

	const left = where.slice(7, opIdx).trim();
	const op = where.slice(opIdx, opIdx + 2).trim();
	const right = parseValue(where.slice(opIdx + 2).trim());

	return (row) => operators[op](row[left], right);
};

const selectTable = (database, tableName) =>
	database[tableName.trim()].map((row) => prependNameToKeys(row, tableName));

const parseValue = (str, asInt = parseInt(str)) =>
	isNaN(asInt) ? str.slice(1, -1).replace(`''`, `'`) : asInt;

const parseJoinStatement = (join) => {
	const [targetTable, ...keys] = join.split(/on|=/gi).map((s) => s.trim());

	const rightKey = keys.find((k) => k.slice(0, k.indexOf(".")) === targetTable);

	return {
		targetTable,
		rightKey,
		leftKey: keys.find((k) => k !== rightKey),
	};
};

const prependNameToKeys = (row, tableName) =>
	Object.keys(row).reduce(
		(result, key) => ({ ...result, [`${tableName.trim()}.${key}`]: row[key] }),
		Object.create(null)
	);

const pluckRow = (row, locations) =>
	Object.keys(row).reduce(
		(result, key) =>
			locations.includes(key) ? { ...result, [key]: row[key] } : result,
		Object.create(null)
	);

function SQLEngine(database) {
	this.execute = function (query) {
		const { select, from, where } = parseClauses(query);

		const [tableName, ...joins] = parseFrom(from);

		return joins
			.reduce((table, nextJoin) => {
				const { targetTable, rightKey, leftKey } = parseJoinStatement(nextJoin);

				return table.reduce(
					(output, leftRow) =>
						output.concat(
							database[targetTable]
								.map((row) => prependNameToKeys(row, targetTable))
								.filter((rightRow) => rightRow[rightKey] === leftRow[leftKey])
								.map((rightRow) => ({ ...leftRow, ...rightRow }))
						),
					[]
				);
			}, selectTable(database, tableName))
			.filter(parseWhere(where))
			.map((row) => pluckRow(row, parseSelect(select)));
	};
}
