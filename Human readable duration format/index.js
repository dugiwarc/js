/** @format */

function formatDuration(seconds) {
  if (!seconds) return "now";
  var strout = "";
  var s = seconds % 60;
  seconds = (seconds - s) / 60;
  var m = seconds % 60;
  seconds = (seconds - m) / 60;
  var h = seconds % 24;
  seconds = (seconds - h) / 24;
  var d = seconds % 365;
  seconds = (seconds - d) / 365;
  var y = seconds;

  var english = [];
  if (y) english.push(y + " year" + (y > 1 ? "s" : ""));
  if (d) english.push(d + " day" + (d > 1 ? "s" : ""));
  if (h) english.push(h + " hour" + (h > 1 ? "s" : ""));
  if (m) english.push(m + " minute" + (m > 1 ? "s" : ""));
  if (s) english.push(s + " second" + (s > 1 ? "s" : ""));

  return english.join(", ").replace(/,([^,]*)$/, " and$1");
}
