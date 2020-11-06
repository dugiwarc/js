/** @format */

function chooseBestSum(t, k, ls) {
  var biggestCount = 0;
  var recurseTowns = function (townsSoFar, lastIndex) {
    townsSoFar = townsSoFar || [];
    //base case
    if (townsSoFar.length === k) {
      var sumDistance = townsSoFar.reduce((a, b) => a + b);
      if (sumDistance <= t && sumDistance > biggestCount) {
        biggestCount = sumDistance;
      }
      return; //EJECT
    }
    //recursive case
    for (var i = lastIndex + 1 || 0; i < ls.length; i++) {
      recurseTowns(townsSoFar.concat(ls[i]), i);
    }
  };
  recurseTowns();

  return biggestCount || null;
}
