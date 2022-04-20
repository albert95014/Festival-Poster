//References
//https://p5js.org/reference/#/p5/join
//https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks

function preload() {
   font = loadFont('SpaceMono-Bold.ttf');
}

var started = false;

function start() {
  started = true;
  redraw();
}

function setup() {
  //18x24 poster size
  w = windowWidth/2 - 48;
  h = w*(24/18);
  myCanvas = createCanvas(w, h);
  myCanvas.parent("canvasContainer");
}

function draw() {
  //Initializations
  xLoc = width/2;
  yLoc = height/2;
  divider = " • "
  names = [];
  lineup = [];
  lineNumber = 0;
  index = 0;
  stringWidth = 0;

  //Input Fields
  festivalName = document.getElementById("name").value;
  festivalName = festivalName.toUpperCase();
  festivalDate = document.getElementById("date").value;
  festivalLoc = document.getElementById("location").value;

  //Text Options
  textSize(36); //should equal topBillingSize
  festivalNameSize = 28;
  topBillingSize = 36;
  midBillingSize = 20;
  btmBillingSize = 12;
  lineHeight = textSize();
  textFont(font);
  textAlign(CENTER);

  if (started) {
    background(245);

    names = artistNames;

    for (var i=0; i<names.length; i++) {
      names[i] = names[i].toUpperCase();
    }


    for (var y=0; y<5; y++) {
      drawBackground(random(width), random(height), color(random(255), random(255), random(255)))
    }

    for (var i=0; i<names.length; i++) {

      //If the length of the current name pushes a line width past the canvas edge,
      //create a string in lineup[] of the names up to the current one and start a new line
      if (stringWidth + textWidth(names[i] + divider) > width) {


        lineup[lineNumber] = names.slice(index, i)
        index = i;

        stringWidth = 0;
        lineNumber += 1;

        //Calculate respective text sizes for each line
        if (lineNumber == 0) {
          textSize(topBillingSize);
        } else if (lineNumber == 1 || lineNumber == 2) {
          textSize(midBillingSize);
        } else {
          textSize(btmBillingSize)
        }
      }

      stringWidth += textWidth(names[i] + divider)
    }

    //Include this last assignment to take care of the final line of artists
    lineup[lineNumber] = names.slice(index, names.length)

    //Vertically centering the lineup names (approximately)
    yLoc = height/2 - (lineNumber*lineHeight)/2

    for (var x=0; x<lineup.length; x++) {
      lineup[x] = join(lineup[x], divider);

      //Draw respective text sizes for each line
      if (x == 0) {
        textSize(topBillingSize);
      } else if (x == 1 || x == 2) {
        textSize(midBillingSize);
      } else {
        textSize(btmBillingSize)
      }

      text(lineup[x], xLoc, yLoc);
      yLoc += lineHeight;
    }

    // text(festivalName, xLoc, 32);
    drawFestivalName(festivalName, width/2, 48);
    text(festivalDate + divider + festivalLoc, xLoc, height-24);
  }

  started = false;
  noLoop();
}

function drawText(artists) {
  text(artists, xLoc, yLoc);
}

function drawBackground(x, y, bgColor) {
  ellipseMode(RADIUS)
  noStroke();

  for (var i=0; i < width/2; i+=5) {
    push();
      blendMode(MULTIPLY);
      bgColor.setAlpha(2);
      fill(bgColor)
      ellipse(x, y, i)
    pop();
  }
}

function drawFestivalName(festivalName, xLoc, yLoc){

  startPoint = 0;
  letterSpacing = 20;

  push();
    textSize(festivalNameSize);

  //Return total length of festival name to use as a way of centering horizontally
  for (var i=0; i<festivalName.length; i++) {
    startPoint += (textWidth(festivalName[i]))
    startPoint += (letterSpacing - textWidth(festivalName[i]))
  }

  for (var x=0; x<festivalName.length; x++) {
    fill(random(100))
    text(festivalName[x], xLoc - (startPoint/2) + (x*letterSpacing), yLoc + random(-5,5))
  }


  pop();

}
