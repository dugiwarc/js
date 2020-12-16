/** @format */

with (Math)
	circleIntersection = ([a, b], [c, d], r) =>
		((-sin((x = 2 * acos(hypot(a - c, b - d) / 2 / r))) + x) * r * r) | 0;

// circleIntersection = ([a, b], [c, d], r) =>
// 	(((m = Math), -m.sin((x = 2 * m.acos(m.hypot(a - c, b - d) / 2 / r))) + x) *
// 		r *
// 		r) |
// 	0;
