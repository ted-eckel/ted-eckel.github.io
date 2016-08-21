var CANVAS_WIDTH = 888;
var CANVAS_HEIGHT = 480;
var FPS = 30;
var newCanvas;
var currentElement;
var canvasElement;
var canvas;
var bluesDestroyed;
var blues;
var Lasers;
var stop;
var reds;
var spaceship;

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};

function wrapper(){

  stop = false;

  spaceship = {
    x: 50,
    y: 270,
    width: 26,
    height: 48,
  };

  Lasers = [];

  function Laser(el) {
    el.active = true;

    el.xVelocity = 0;
    el.yVelocity = -el.speed;
    el.width = 3;
    el.height = 3;
    el.color = "#FF0000";

    el.withinFrame = function() {
      return el.x >= 0 && el.x <= CANVAS_WIDTH &&
      el.y >= 0 && el.y <= CANVAS_HEIGHT;
    };

    el.draw = function() {
      canvas.fillStyle = this.color;
      canvas.fillRect(this.x, this.y, this.width, this.height);
    };

    el.update = function() {
      el.x += el.xVelocity;
      el.y += el.yVelocity;

      el.active = el.active && el.withinFrame();
    };

    el.explode = function() {
      this.active = false;
    };

    return el;
  }

  blues = [];

  function Blue(el) {
    el = el || {};

    el.active = true;
    el.age = Math.floor(Math.random() * 128);

    el.x = CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;
    el.y = 0;
    el.xVelocity = 0;
    el.yVelocity = 2;

    el.width = 54;
    el.height = 30;

    el.withinFrame = function() {
      return el.x >= 0 && el.x <= CANVAS_WIDTH &&
      el.y >= 0 && el.y <= CANVAS_HEIGHT;
    };

    el.draw = function() {
      canvas.drawImage(blueImage, this.x, this.y);
    };

    el.update = function() {
      el.x += el.xVelocity;
      el.y += el.yVelocity;

      el.xVelocity = 3 * Math.sin(el.age * Math.PI / 64);

      el.age++;

      el.active = el.active && el.withinFrame();
    };

    el.explode = function() {

      this.active = false;
    };

    return el;
  }

  reds = [];

  function Red(el) {
    el = el || {};

    el.active = true;
    el.age = Math.floor(Math.random() * 128);

    el.x = CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;
    el.y = 0;
    el.xVelocity = 0;
    el.yVelocity = 2;

    el.width = 54;
    el.height = 30;

    el.withinFrame = function() {
      return el.x >= 0 && el.x <= CANVAS_WIDTH &&
      el.y >= 0 && el.y <= CANVAS_HEIGHT;
    };

    el.draw = function() {
      canvas.drawImage(redImage, this.x, this.y);
    };

    el.update = function() {
      el.x += el.xVelocity;
      el.y += el.yVelocity;

      el.xVelocity = 3 * Math.sin(el.age * Math.PI / 64);

      el.age++;

      el.active = el.active && el.withinFrame();
    };

    el.explode = function() {

      this.active = false;
    };

    return el;
  }

  var backgroundReady = false;
  var backgroundImage = new Image();
  backgroundImage.onload = function() {
    backgroundReady = true;
  };
  backgroundImage.src =
  "assets/images/stockvault-simple-starry-space-background114093.jpg";

  var redReady = false;
  var redImage = new Image();
  redImage.onload = function() {
    redReady = true;
  };
  redImage.src = "assets/images/red.png";

  var blueReady = false;
  var blueImage = new Image();
  blueImage.onload = function() {
    blueReady = true;
  };
  blueImage.src = "assets/images/blue.png";

  var spaceshipReady = false;
  var spaceshipImage = new Image();
  spaceshipImage.onload = function() {
    spaceshipReady = true;
  };
  spaceshipImage.src = "assets/images/noflames.png";

  newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("id", "game");
  newCanvas.setAttribute("width", CANVAS_WIDTH);
  newCanvas.setAttribute("height", CANVAS_HEIGHT);
  currentElement = document.getElementById("paragraph");
  document.body.insertBefore(newCanvas, currentElement);
  canvasElement = document.getElementById('game');
  canvas = canvasElement.getContext('2d');


  setInterval(function() {
    update();
    draw();
  }, 1000/FPS);

  Number.prototype.between = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };

  var keysDown = {};

  addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
  }, false);

  addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  }, false);

  function update() {
    if (!stop) {
      if (32 in keysDown) {
        spaceship.shoot();
      }
      if (38 in keysDown) {
        spaceship.y -= 5;
      }
      if (40 in keysDown) {
        spaceship.y += 5;
      }
      if (37 in keysDown) {
        spaceship.x -= 5;
      }
      if (39 in keysDown) {
        spaceship.x += 5;
      }

      spaceship.x = spaceship.x.between(0, CANVAS_WIDTH - spaceship.width);
      spaceship.y = spaceship.y.between(0, CANVAS_HEIGHT - spaceship.height);

      Lasers.forEach(function(laser) {
        laser.update();
      });

      Lasers = Lasers.filter(function(laser) {
        return laser.active;
      });

      blues.forEach(function(blue) {
        blue.update();
      });

      blues = blues.filter(function(blue) {
        return blue.active;
      });

      reds.forEach(function(red) {
        red.update();
      });

      reds = reds.filter(function(red) {
        return red.active;
      });

      handleCollisions();

      if(Math.random() < 0.1) {
        blues.push(Blue());
      }

      if(Math.random() < 0.1) {
        reds.push(Red());
      }

      if (bluesDestroyed < 0) {
        gameOver();
        document.getElementById('paragraph').insertAdjacentHTML('beforebegin',
          "<div id=\"game-over\">\
            <h2>Game Over!</h2>\
            <a href=\"javascript:reloadCanvas();\" \
              class=\"button restart\">Try again?\
            </a>\
          </div>"
        );
      }
    }
  }

  spaceship.shoot = function() {

    var laserPosition = this.middletop();

    Lasers.push(Laser({
      speed: 5,
      x: laserPosition.x,
      y: laserPosition.y
    }));
  };

  spaceship.middletop = function() {
    return {
      x: this.x + this.width/2,
      y: this.y
    };
  };

  spaceship.explode = function() {
    this.active = false;
  };

  function draw(delta) {
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    canvas.drawImage(backgroundImage, 0, 0);

    canvas.drawImage(spaceshipImage, spaceship.x, spaceship.y);

    Lasers.forEach(function(laser) {
      laser.draw();
    });

    blues.forEach(function(blue) {
      blue.draw();
    });

    reds.forEach(function(red) {
      red.draw();
    });

    canvas.fillStyle = "rgb(250, 250, 250)";
    canvas.font = "24px Helvetica";
    canvas.textAlign = "left";
    canvas.textBaseline = "top";
    canvas.fillText("Points: " + bluesDestroyed, 32, 32);
  }

  function collides(a, b) {
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
  }

  bluesDestroyed = 0;

  function handleCollisions() {
    Lasers.forEach(function(laser) {
      blues.forEach(function(blue) {
        if(collides(laser, blue)) {
          blue.explode();
          laser.active = false;
        }
      });
      reds.forEach(function(red) {
        if(collides(laser, red)) {
          red.explode();
          laser.active = false;
        }
      });
    });

    blues.forEach(function(blue) {
      if(collides(blue, spaceship)) {

        blue.explode();
        ++bluesDestroyed;
      }
    });

    reds.forEach(function(red) {
      if(collides(red, spaceship)) {

        red.explode();
        spaceship.explode();
        --bluesDestroyed;
      }
    });
  }


  function gameOver() {
    stop = true;
  }
}

function reloadCanvas(){
  document.getElementById('game-over').remove();
  blues = [];
  reds = [];
  Lasers = [];
  bluesDestroyed = 0;
  spaceship.x = 50;
  spaceship.y = 270;
  stop = false;
}
