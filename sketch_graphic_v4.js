//References
//https://p5js.org/reference/#/p5/join
//https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks

function preload() {
   font = loadFont('Satoshi-Bold.otf');
   displayfont = loadFont('Stardom-Regular.otf');
}

var started = false;

function start() {
  started = true;
  signedInState = true;
  redraw();
}

function setup() {
  //18x24 poster size
  // w = windowWidth/2 - 48;
  // h = w*(24/18);
  w = (windowHeight-48)*(18/24);
  h = windowHeight - 48
  myCanvas = createCanvas(w, h);
  myCanvas.parent("canvasContainer");

  // myPoster = createGraphics(windowWidth/2 - 48, (windowWidth/2 - 48)*(24/18))
  backgroundLayer = createGraphics((windowHeight-48)*(18/24), windowHeight - 48);
  textLayer = createGraphics((windowHeight-48)*(18/24), windowHeight - 48);

  console.log(backgroundLayer.width);
  console.log(textLayer.width)

  drawBackground();
  checkSignInState();
  getSpotifyData();
}

function draw() {
  textLayer.clear();

  //Initializations
  xLoc = width/2; //xLoc = 24 if textAlign(LEFT);
  yLoc = height/2;
  names = [];
  lineup = [];
  lineNumber = 0;
  index = 0;
  stringWidth = 0;
  festivalNameSize = 48;
  festivalInfoSize = 24;
  baseTextSize = 16;


  //Input Fields
  festivalName = document.getElementById("name").value.toUpperCase();
  festivalDate = document.getElementById("date").value.toUpperCase();
  festivalLoc = document.getElementById("location").value.toUpperCase();
  separator = document.getElementById("separator").value;
  festivalNameTextSize = Number(document.getElementById("festivalNameTextSize").value)*festivalNameSize;
  festivalInfoTextSize = Number(document.getElementById("festivalInfoTextSize").value)*festivalInfoSize;
  artistTextSize = Number(document.getElementById("artistTextSize").value)*baseTextSize;
  textAlignment = document.getElementById("textAlignment").value;


  //Text Options
  textLayer.textSize(artistTextSize); //should equal topBillingSize

  topBillingSize = artistTextSize;
  midBillingSize = artistTextSize;
  btmBillingSize = artistTextSize;
  lineHeight = textLayer.textSize();
  textLayer.textFont(font);
  if (textAlignment == "CENTER") {
    textLayer.textAlign(CENTER, BOTTOM);
  } else {
    textLayer.textAlign(LEFT, BOTTOM);
    xLoc = 24;
  }

  if (started) {
    // background(180);


    names = artistNames;

    for (var i=0; i<names.length; i++) {
      names[i] = names[i].toUpperCase();
    }


    for (var i=0; i<names.length; i++) {

      //If the length of the current name pushes a line width past the canvas edge,
      //create a string in lineup[] of the names up to the current one and start a new line
      if (stringWidth + textLayer.textWidth(names[i] + separator) > width - 24) {

        lineup[lineNumber] = names.slice(index, i)
        index = i;

        stringWidth = 0;
        lineNumber += 1;

        //Calculate respective text sizes for each line
        if (lineNumber == 0) {
          textLayer.textSize(topBillingSize);
        } else if (lineNumber == 1 || lineNumber == 2) {
          textLayer.textSize(midBillingSize);
        } else {
          textLayer.textSize(btmBillingSize)
        }
      }

      stringWidth += textLayer.textWidth(names[i] + separator)
    }

    //Include this last assignment to take care of the final line of artists
    lineup[lineNumber] = names.slice(index, names.length)

    //Vertically centering the lineup names (approximately)
    //last number added is for top margin (hard-coded)
    yLoc = height/2 - (lineNumber*lineHeight)/2 + 16

    for (var x=0; x<lineup.length; x++) {
      lineup[x] = join(lineup[x], separator);

      //Draw respective text sizes for each line
      if (x == 0) {
        textLayer.textSize(topBillingSize);
      } else if (x == 1 || x == 2) {
        textLayer.textSize(midBillingSize);
      } else {
        textLayer.textSize(btmBillingSize)
      }

      // fill(200);
      drawText(lineup[x], xLoc, yLoc);
      yLoc += lineHeight;
    }

    drawFestivalName();
    drawFestivalInfo();


  }

  image(backgroundLayer, 0, 0);
  image(textLayer, 0, 0);
}

function drawText(artist) {
  textLayer.fill(255);
  textLayer.text(artist, xLoc, yLoc);
}


function drawBackground() {
  backgroundLayer.clear();
  backgroundLayer.ellipseMode(RADIUS)
  backgroundLayer.noStroke();
  backgroundLayer.background(180);

  for (var j=0; j<5; j++) {
    bgColor = color(random(255), random(255), random(255));
    x = random(width);
    y = random(height);

    for (var i=0; i < width/2; i+=5) {
      push();
        backgroundLayer.blendMode(MULTIPLY);
        bgColor.setAlpha(2);
        backgroundLayer.fill(bgColor);
        backgroundLayer.ellipse(x, y, i)
      pop();
    }
  }
}

function drawFestivalName(){
  push();
    textLayer.textSize(festivalNameTextSize);
    textLayer.textLeading(festivalNameTextSize);
    textLayer.textFont(displayfont);
    if (textAlignment == "CENTER") {
      textLayer.textAlign(CENTER, TOP);
    } else {
      textLayer.textAlign(LEFT, TOP);
    }
    textLayer.text(festivalName, 24, 24, width - 48, height - 48)
  pop();
}

function drawFestivalInfo() {
  push();
    textLayer.textSize(festivalInfoTextSize);
    textLayer.textLeading(festivalInfoTextSize);
    textLayer.textFont(displayfont);
    if (textAlignment == "CENTER") {
      textLayer.textAlign(CENTER, BOTTOM);
    } else {
      textLayer.textAlign(LEFT, BOTTOM);
    }
    textLayer.text(festivalDate + "\n" + festivalLoc, 24, 24, width - 48, height - 48)
  pop();
}

function downloadPoster() {
  save(myCanvas,"myMusicFestival.png");
}
