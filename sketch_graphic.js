//References
//https://p5js.org/reference/#/p5/join
//https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks

function preload() {
   font = loadFont('Satoshi-Bold.otf');
}

var started = false;

function start() {
  started = true;
  redraw();
}

function setup() {
  //18x24 poster size
  // w = windowWidth/2 - 48;
  // h = w*(24/18);
  w = 900;
  h = w*24/18;
  myCanvas = createCanvas(w, h);
  myCanvas.parent("canvasContainer");

  // myPoster = createGraphics(windowWidth/2 - 48, (windowWidth/2 - 48)*(24/18))
  myPoster = createGraphics((windowHeight-48)*(18/24), windowHeight - 48)
}

function draw() {
  //Initializations
  xLoc = width/2;
  yLoc = height/2;
  names = [];
  lineup = [];
  lineNumber = 0;
  index = 0;
  stringWidth = 0;

  //Input Fields
  festivalName = document.getElementById("name").value.toUpperCase();
  festivalDate = document.getElementById("date").value.toUpperCase();
  festivalLoc = document.getElementById("location").value.toUpperCase();
  separator = document.getElementById("separator").value;

  //Text Options
  textSize(64); //should equal topBillingSize
  festivalNameSize = 96;
  topBillingSize = 64;
  midBillingSize = 40;
  btmBillingSize = 24;
  lineHeight = textSize();
  textFont(font);
  textAlign(CENTER);

  if (started) {
    background(200);

    names = artistNames;

    for (var i=0; i<names.length; i++) {
      names[i] = names[i].toUpperCase();
    }


    for (var y=0; y<6; y++) {
      drawBackground(random(width), random(height), color(random(255), random(255), random(255)))
    }

    for (var i=0; i<names.length; i++) {

      //If the length of the current name pushes a line width past the canvas edge,
      //create a string in lineup[] of the names up to the current one and start a new line
      if (stringWidth + textWidth(names[i] + separator) > width - 24) {

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

      stringWidth += textWidth(names[i] + separator)
    }

    //Include this last assignment to take care of the final line of artists
    lineup[lineNumber] = names.slice(index, names.length)

    //Vertically centering the lineup names (approximately)
    //last number added is for top margin (hard-coded)
    yLoc = height/2 - (lineNumber*lineHeight)/2 + 48

    for (var x=0; x<lineup.length; x++) {
      lineup[x] = join(lineup[x], separator);

      //Draw respective text sizes for each line
      if (x == 0) {
        textSize(topBillingSize);
      } else if (x == 1 || x == 2) {
        textSize(midBillingSize);
      } else {
        textSize(btmBillingSize)
      }

      // fill(255);
      drawText(lineup[x], xLoc, yLoc);
      yLoc += lineHeight;
    }

    //drawFestivalName(festivalName, btmPin, btmArcAmp, topPin, topArcAmp)
    //  btmPin = set lowest position of arc text
    //  btmArcAmp = amplitude of the upward bend (on bottom)
    //  topPin = set highest position of arc text
    //  topArcAmp = amplitude of the downward bend (on top)
    drawFestivalInfo(festivalName, 24, 0, 250, 150);
    drawFestivalInfo(festivalDate + separator + festivalLoc, height - 200, 100, height - 36, 0);
  }

  started = false;

  //Copy drawing to buffer (myPoster) and render it in relation to browser width
  myPoster.clear();
  myPoster.copy(myCanvas,
                0, 0, myCanvas.width, myCanvas.height,
                0, 0, myPoster.width, myPoster.height);
  clear();

  // resizeCanvas(800, 800, true);


  image(myPoster,
        (width - myPoster.width)/2, 24,
        myPoster.width, myPoster.height);

  noLoop();
}

//ORIGINAL SIMPLE TEXT
function drawText(artist) {
  push();
    noStroke();
    fill(255);
    text(artist, xLoc, yLoc);
  pop();
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

function drawFestivalInfo(festivalName, btmPin, btmArcAmp, topPin, topArcAmp){
    points = font.textToPoints(festivalName, xLoc, yLoc, festivalNameSize, {
       sampleFactor: 0.8,
       simplifyThreshold: 0
      });
    bounds = font.textBounds(festivalName, xLoc, yLoc, festivalNameSize)

    push();
      // fill(255);
      noFill();
      stroke(255);
      strokeWeight(1);

      beginShape();
        for (var i=1; i<points.length; i++) {

          //last two parameters are left and right of festival name box
          points[i].x = map(points[i].x,
                            xLoc, xLoc + bounds.w,
                            20, width - 40)

          //yMapDest = map(points[i].x, 20, width-40, -100, 100)
          yMapDest = map(points[i].x, 20, width-40, 0, PI)

          //last two parameters are top and bottom of festival name box
          points[i].y = map(points[i].y,
                            yLoc-bounds.h, yLoc,
                            btmPin + btmArcAmp*sin(yMapDest), topPin - topArcAmp*sin(yMapDest));

          distance = dist(points[i].x, points[i].y,
                          points[i-1].x, points[i-1].y)

          if (distance > 5) {
            endShape(CLOSE);
            beginShape();
          }

          vertex(points[i].x, points[i].y);
        }
      endShape(CLOSE);
    pop();
}

function downloadPoster() {
  save(myPoster,"myMusicFestival.png");
}
