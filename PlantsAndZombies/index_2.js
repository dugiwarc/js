/** @format */

function plantsAndZombies(m, z) {
	var // init board map callback
		im = (s, r) => [...s].map((x, c) => (x == " " ? 0 : { s: +x || 10, r, c })),
		// init shooters reduce callback
		sr = (a, o) => (o && a.push(o), a),
		// shooters sort fn: n-shooters first, then s-shhoters r2l & t2b
		sp = (a, b) => (9 < a.s ? b.c - a.c || a.r - b.r : -1),
		// delete x from shooter list
		sd = (x) => s.splice(s.indexOf(x), 1),
		// shooters split reduce cb: o.n n-shoots by rows, o.m s-shooters
		sn = (o, x) => (
			9 < x.s ? o.m.push(x) : (o.n[x.r] = (o.n[x.r] | 0) + x.s), o
		),
		// zombies some callback: update z & m & s (true if defense broken)
		zs = (z, x) =>
			!z.c ||
			((x = m[z.r][--z.c]) && sd(x), (m[z.r][z.c] = z), (m[z.r][z.c + 1] = 0)),
		// zombies reduce callback: find 1st left-most positionned
		zr = (a, b) => (b.c < a.c ? b : a),
		// delete x from z & map
		zd = (z, x) => (z.splice(z.indexOf(x), 1), (m[x.r][x.c] = 0)),
		// zombies moves list
		zm = z.reduce(
			(a, [i, r, z]) => (
				(a[i] = a[i] || []).push({ z, r, c: m[0].length - 1 }), a
			),
			[]
		),
		// shooters list
		s = (m = m.map(im)).reduce((a, r) => r.reduce(sr, a), []).sort(sp),
		// move main reduce callback
		mv = (z, x, i) => {
			if (typeof z == "number") return z; // defense broken
			x && x.forEach((x) => z.push((m[x.r][x.c] = x)));
			return m.shoot(z, s), m.next(z, i);
		},
		sgn = Math.sign,
		isa = Array.isArray;
	// update map: move zombies one column to left => zlist | break time
	m.next = (z, i) =>
		s.length ? (z.some(zs) || !s.length ? ++i : z) : ++i + z.reduce(zr).c;
	// shoot and unpdate map
	m.shoot = (z) => {
		if (!z.length) return;
		var r,
			c,
			{ n, m } = s.reduce(sn, { n: [], m: [] }),
			// zombies reduce callback: n-shooter target select
			nt = (x, z) => (z.r == r && (!x || z.c < x.c) ? z : x),
			// zombies reduce callback: s-shooter targets select
			st = (
				x,
				z,
				i // [z.r<r,z.r==r,r<z.r]
			) => (
				(!(i = sgn(z.r - r)) ||
					(i < 0 ? z.c - c == r - z.r : z.c - c == z.r - r)) &&
					c <= z.c &&
					(!x[++i] || z.c < x[i].c) &&
					(x[i] = z),
				x
			),
			// s-target shoot forEach callback: --hp, update z & m if 0
			zx = (x) => --x.z || zd(z, x);
		n.forEach((n, i, x) => {
			if (((r = i), (x = z.reduce(nt, null))))
				do n < x.z ? ((x.z -= n), (n = 0)) : ((n -= x.z), zd(z, x));
				while (n && (x = z.reduce(nt, null)));
		});
		m.forEach((s) => (({ r, c } = s), z.reduce(st, []).forEach(zx)));
	};
	if (isa((z = [...zm].reduce(mv, []))) && z.length) {
		zm = zm.length;
		do z = mv(z, 0, zm++);
		while (isa(z) && z.length);
	}
	return isa(z) ? null : z;
}
