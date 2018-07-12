var myFont;
var deadline;
function preload() {
  myFont = loadFont('/assets/fonts/visitor1.ttf');
}

function setup() {
  drawingCanvas = createCanvas(80, 16);
  deadline = moment("20180824", "YYYYMMDD");
  frameRate(30);
}

function draw() {
  background(60);
  var now = moment();
  var millis = deadline.diff(now, 'milliseconds');
  var countdown = "DUEEEEEEEEE";
  if (millis) {
    var days = int(millis / 86400000);
    var hours = int((millis - 86400000 * days) / 3600000)
    var rest = millis - 86400000 * days - 3600000 * hours;
    countdown = days + '/' + hours + '/' + rest;
  }
  fill('#FFF');
  textFont(myFont);
  textSize(12);
  text(countdown, 4, 11);
}
