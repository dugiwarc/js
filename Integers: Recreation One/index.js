/** @format */

function listSquared(m, n) {
  var arr = [];
  for (var i = m; i <= n; i++) {
    var temp = 0;
    for (var j = 1; j <= i; j++) {
      if (i % j == 0) temp += j * j;
    }
    if (Math.sqrt(temp) % 1 == 0) arr.push([i, temp]);
  }
  return arr;
}
