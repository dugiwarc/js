/** @format */

// Returns number of complete beeramid levels
var beeramid = function (bonus, price) {
  var beers = Math.floor(bonus / price),
    levels = 0;
  while (beers >= ++levels * levels) {
    beers -= levels * levels;
  }
  return levels - 1;
};
