PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const app = new PIXI.Application({ width: 940, height: 360, autoStart: false });
document.body.appendChild(app.view);

let scoreText = new PIXI.Text("0", {
  fontFamily: "Arial",
  fontSize: 24,
  fill: 0xff1010,
  align: "center",
});
let score = 0;

//let square = PIXI.Sprite.fromImage("BlueKnight.png");
//square.scale.x = 3;
//square.scale.y = 3;

let square = new PIXI.Graphics();
square.beginFill(0xde3249);
square.drawRect(0, 0, 40, 40);
square.endFill();
player = new Entity(0, 0, square);

square.vx = 0;
square.vy = 0;
square.px = 0;
square.py = 0;
square.lastPos = {};
square.lastPos.y = app.view.height - square.height;
square.py = app.view.height - square.height;
square.lastPos.y = 0;
//locks player to start going right
square.vx = 0.1;
square.jumps = 2;

app.stage.addChild(square);
app.stage.addChild(scoreText);

const INFINITY = 1000;

class Collider {
  constructor() {
    this.sprite = new PIXI.Graphics();
    this.sprite.beginFill(0xafafaf);
    this.sprite.drawRect(0, 0, 40, 40);
    this.sprite.endFill();
    this.sprite.alpha = 1;
    app.stage.addChild(this.sprite);
  }
  containsPoint(x, y) {
    return (
      x <= this.sprite.x + this.sprite.width &&
      x >= this.sprite.x &&
      y <= this.sprite.y + this.sprite.height &&
      y >= this.sprite.y
    );
  }
  intersectX(x, y, width, height, dx) {
    //correct height for collision
    if (dx > 0 && x + width <= this.sprite.x) {
      if (
        (y + height > this.sprite.y && y + height < this.sprite.y + height) ||
        (y > this.sprite.y && y < this.sprite.y + height)
      ) {
        return this.sprite.x - (x + width);
      }
    } else if (dx < 0 && x + width >= this.sprite.x + width) {
      if (
        (y + height >= this.sprite.y && y + height <= this.sprite.y + height) ||
        (y >= this.sprite.y && y <= this.sprite.y + height)
      ) {
        return this.sprite.x + this.sprite.width - x;
      }
    }
    return INFINITY;
  }
  intersectY(x, y, width, height) {
    if (this.containsPoint(x, y)) {
      return this.sprite.y + this.sprite.height;
    }
    if (this.containsPoint(x, y + height)) {
      return this.sprite.y - this.sprite.height;
    } else {
      return undefined;
    }
  }
}
let x = new Collider();
x.sprite.x = 500;
x.sprite.y = 300;
const colliders = [x];

document.body.addEventListener("keydown", event => {
  //console.log(event.keyCode);
  switch (event.keyCode) {
    case 38:
      square.jump = true;
      break;
    case 40:
      break;
    case 37:
      //square.vx = -0.3;
      break;
    case 39:
      //square.vx = 0.3;
      break;
  }
});

function update(delta) {
  square.lastPos.x = square.px;
  square.lastPos.y = square.py;
  //square.px += square.vx * delta;
  square.py += square.vy * delta;
  if (square.jump && square.jumps > 0) {
    square.vy = -1.3;
    square.jumps -= 1;
  }

  if (square.vx * delta > 0) {
    if (
      square.vx * delta >
      colliders[0].intersectX(
        square.px,
        square.py,
        square.width,
        square.height,
        square.vx * delta,
      )
    ) {
      square.px += colliders[0].intersectX(
        square.px,
        square.py,
        square.width,
        square.height,
        square.vx * delta,
      );
    } else {
      square.px += square.vx * delta;
    }
  } else if (square.vx * delta < 0) {
    /*console.log(
      colliders[0].intersectX(
        square.px,
        square.py,
        square.width,
        square.height,
        square.vx * delta,
      ),
    );*/
    square.px += square.vx * delta;
  }
  /*collided = false;
  square.px += square.vx * delta;
  for (c of colliders) {
    if (c.intersectX(square.px, square.py, square.width, square.height)) {
      collided = true;
      square.px = c.intersectX(
        square.px,
        square.py,
        square.width,
        square.height,
      );
      square.vx *= -1;
      break;
    }
  }
  if (collided) {
    square.px += square.vx * delta;
  }
  collided = false;
  square.py += square.vy * delta;
  for (c of colliders) {
    if (c.intersectY(square.px, square.py, square.width, square.height)) {
      collided = true;
      square.py = c.intersectY(
        square.px,
        square.py,
        square.width,
        square.height,
      );
      break;
    }
  }
  if (collided) {
    square.py -= square.vy * delta;
    square.vy = 0;
    square.jumps = 2;
  }*/
  square.vy += 0.1;
  if (square.vy > 0.5) {
    square.vy = 0.5;
  }
  square.jump = false;

  if (square.px < 0) {
    square.px = 0;
    square.vx = 0.3;
  }
  if (square.px > app.view.width - square.width) {
    square.px = app.view.width - square.width;
    square.vx = -0.3;
    score += 1;
    scoreText.text = `${score}`;
  }
  if (square.py < 0) {
    square.py = 0;
    if (square.vy < 0) {
      square.vy = 0;
    }
  }
  if (square.py > app.view.height - square.height) {
    square.py = app.view.height - square.height;
    square.jumps = 2;
    if (square.vy > 0) {
      square.vy = 0;
    }
  }
}

function draw(interp) {
  //square.x = square.px;
  //square.y = square.py;
  (square.x = square.lastPos.x + (square.px - square.lastPos.x) * interp), //Math.floor(
    //);
    (square.y = square.lastPos.y + (square.py - square.lastPos.y) * interp), //Math.floor(
    //);
    app.render();
}

MainLoop.setUpdate(update)
  .setDraw(draw)
  .start();
