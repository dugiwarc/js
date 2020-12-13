/** @format */

class SQLEngine {
	constructor(database) {
		this.database = database;

		this.columnID = "\\w+\\.\\w+";
		this.num = "\\d+(?:\\.\\d+)?";
		this.str = "'(?:[^']|'{2})+'";

		this.columnIDReg = new RegExp(this.columnID);

		this.switchComp = {
			["="]: "=",
			["<"]: ">",
			[">"]: "<",
			["<="]: ">=",
			[">="]: "<=",
			["<>"]: "<>",
		};
	}

	execute(query) {
		const parsed = this.parse(query);
		console.log(this.database);
		console.log(query);

		let rows = this.padTable(parsed.from);

		parsed.joins.forEach((join) => {
			rows = this.join(rows, join);
		});

		if (parsed.where.length) {
			rows = rows.filter((row) => {
				const a = this.columnIDReg.test(parsed.where[0])
					? row[parsed.where[0]]
					: parsed.where[0];
				const b = this.columnIDReg.test(parsed.where[2])
					? row[parsed.where[2]]
					: parsed.where[2];

				return this.compare(a, b, parsed.where[1]);
			});
		}

		const result = rows.map((row) => {
			const out = {};
			for (let key of parsed.select) out[key] = row[key];
			return out;
		});

		return result;
	}

	padTable(table) {
		return this.database[table].map((row) => {
			const padded = {};

			for (let key in row) {
				padded[table + "." + key] = row[key];
			}

			return padded;
		});
	}

	join(rows, join) {
		const newRows = [];

		if (join[1].slice(0, join[1].indexOf(".")) == join[0]) {
			var [col, otherCol, comp] = [join[3], join[1], this.switchComp[join[2]]];
		} else {
			var [col, otherCol, comp] = [join[1], join[3], join[2]];
		}

		const otherRows = this.padTable(join[0]);

		rows.forEach((row) => {
			otherRows.forEach((otherRow) => {
				if (this.compare(row[col], otherRow[otherCol], comp)) {
					newRows.push(Object.assign({}, row, otherRow));
				}
			});
		});

		return newRows;
	}

	compare(a, b, comp) {
		a = !isNaN(a) ? Number(a) : a;
		b = !isNaN(b) ? Number(b) : b;

		switch (comp) {
			case "=":
				return a == b;
			case "<>":
				return a != b;
			case ">":
				return a > b;
			case "<":
				return a < b;
			case ">=":
				return a >= b;
			case "<=":
				return a <= b;
			default:
				return false;
		}
	}

	parse(query) {
		const constant = `${this.columnID}|${this.num}|${this.str}`;
		const comp = `(?:=|<|>|<=\>=|<>)`;
		const valueTest = `(${constant})\\s(${comp})\\s(${constant})`;
		const join = `join\\s(\\w+)\\son\\s${valueTest}`;

		const selectReg = new RegExp(
			`^select\\s((?:${this.columnID}(?:,\\s)?)+)`,
			"i"
		);
		const fromReg = new RegExp(`from\\s(\\w+)`, "i");
		const joinReg = new RegExp(join, "i");
		const joinsReg = new RegExp(join, "gi");
		const whereReg = new RegExp(`where\\s${valueTest}`, "i");

		return {
			select: query.match(selectReg)[1].split(", "),
			from: query.match(fromReg)[1],
			joins: (query.match(joinsReg) || []).map((j) =>
				j.match(joinReg).slice(1, 5)
			),
			where: (query.match(whereReg) || [])
				.slice(1, 4)
				.map((str) =>
					str.replace(/''/g, "'").replace(/^\s*'/, "").replace(/'\s*$/, "")
				),
		};
	}
}
