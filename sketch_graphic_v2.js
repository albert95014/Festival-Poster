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
  artistTextSize = Number(document.getElementById("artistTextSize").value);
  // console.log(artistTextSize);

  //Text Options
  textSize(artistTextSize); //should equal topBillingSize
  festivalNameSize = 96;
  topBillingSize = artistTextSize;
  midBillingSize = artistTextSize;
  btmBillingSize = artistTextSize;
  lineHeight = textSize();
  textFont(font);
  textAlign(CENTER);

  if (started) {
    background(180);

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

      // fill(200);
      drawText(lineup[x], xLoc, yLoc);
      yLoc += lineHeight;
    }

    //drawFestivalName(festivalName, btmPin, btmArcAmp, topPin, topArcAmp, wiggleLvl)
    //  btmPin = set lowest position of arc text
    //  btmArcAmp = amplitude of the upward bend (on bottom)
    //  topPin = set highest position of arc text
    //  topArcAmp = amplitude of the downward bend (on top)
    //  wiggleLvl = how wiggly the text is (from 0 to ~5)
    push();
      // rotate(random(-0.05, 0.05));
      for (var i=0; i<8; i++) {
          drawFestivalInfo(festivalName, 28, 0, 160, i*10, random(3));
          // drawFestivalInfo(festivalDate + separator + festivalLoc, height - 120, i*8, height - 36, 0, 0.4);
      }
    pop();
    // drawFestivalInfo(festivalDate + separator + festivalLoc, height - 80, 0, height - 36, 0);
    for (var i=0; i<4; i++) {
        drawFestivalInfo(festivalDate + separator + festivalLoc, height - 120, i*12, height - 32, 0, 0.6);
    }

  }

  started = false;

  //Copy drawing to buffer (myPoster) and render it in relation to browser width
  myPoster.clear();
  myPoster.copy(myCanvas,
                0, 0, myCanvas.width, myCanvas.height,
                0, 0, myPoster.width, myPoster.height);
  clear();

  image(myPoster,
        (width - myPoster.width)/2, 24,
        myPoster.width, myPoster.height);

  noLoop();
}

//ORIGINAL SIMPLE TEXT
function drawText(artist) {
  push();
    // noStroke();
    // fill(255);

    stroke(255);
    strokeWeight(1);

    let points = font.textToPoints(artist, xLoc, yLoc, textSize(), {
          sampleFactor: 0.8,
          simplifyThreshold: 0
        });

    let artistTextWidth = textWidth(artist);
    let counter = random(10);

      beginShape();
    for (var i=points.length-1; i>0; i--) {
      points[i].x = points[i].x + 0.5*sin(counter);
      points[i].y = points[i].y - 0.5*sin(counter);
      counter++;
      ellipse(points[i].x - artistTextWidth/2, points[i].y, 0.5);

      // let pointDistance = dist(points[i].x, points[i].y, points[i-1].x, points[i-1].y);
      //
      //
      //   if (pointDistance > 3) {
      //     endShape(CLOSE);
      //     beginShape();
      //   }
      //     vertex(points[i].x  - artistTextWidth/2, points[i].y);

      //subtract artistTextWidth/2 to center the text
      //ellipse(points[i].x - artistTextWidth/2, points[i].y, 0.5);
    }
    endShape(CLOSE);

    // text(artist, xLoc, yLoc);
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

function drawFestivalInfo(festivalName, btmPin, btmArcAmp, topPin, topArcAmp, wiggleLvl){
    points = font.textToPoints(festivalName, xLoc, yLoc, festivalNameSize, {
       sampleFactor: 0.9,
       simplifyThreshold: 0
      });
    bounds = font.textBounds(festivalName, xLoc, yLoc, festivalNameSize)

    push();
      fill(255, 150);
      noStroke();
      blendMode(SOFT_LIGHT);
      // noFill();
      // stroke(255, 240);
      // strokeWeight(2);

      let counter = random(10);

      //Method for cutting out contours/counters in letters (thank you!)
      //https://github.com/spacetypeco/generative-typography-SP22/blob/main/tutorials/glitching.md
      let drawingContour = false;

      beginShape();
        for (let pt of points) {

          //last two parameters are left and right of festival name box
          pt.x = map(pt.x, xLoc, xLoc + bounds.w, 20, width - 40)

          //yMapDest = map(points[i].x, 20, width-40, -100, 100)
          yMapDest = map(pt.x, 20, width-40, 0, PI)

          //last two parameters are top and bottom of festival name box
          pt.y = map(pt.y, yLoc-bounds.h, yLoc,
                     btmPin + btmArcAmp*sin(yMapDest), topPin - topArcAmp*sin(yMapDest));

          pt.x = pt.x + wiggleLvl*sin(counter);
          pt.y = pt.y - wiggleLvl*sin(counter);
          counter++;
        }

        let prevPt = points[0];

        for (let pt of points) {
          distance = dist(pt.x, pt.y,
                          prevPt.x, prevPt.y)

          if (distance > 16) {
            if (drawingContour) {
              endContour();
            }
            drawingContour = true;
            beginContour();
          }

          vertex(pt.x, pt.y);
          prevPt = pt;
        }

      if (drawingContour) {
        endContour();
      }

      endShape(CLOSE);
    pop();
}

function downloadPoster() {
  save(myPoster,"myMusicFestival.png");
}
