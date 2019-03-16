PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const app = new PIXI.Application({ width: 128, height: 128, autoStart: false });
document.body.appendChild(app.view);

app.stage.scale.x = 4;
app.stage.scale.y = 4;
app.renderer.resize(128 * 4, 128 * 4);

let score = 0;
const scoreText = new PIXI.Text("0", {
  fontFamily: "Arial",
  fontSize: 24,
  fill: 0xff1010,
  align: "center",
});
scoreText.scale.x = 0.25;
scoreText.scale.y = 0.25;

app.stage.addChild(scoreText);
let knightTexture = new PIXI.Texture(
  PIXI.Texture.fromImage("knight.png").baseTexture,
  new PIXI.Rectangle(0, 0, 8, 8),
);
let knightTexture2 = new PIXI.Texture(
  PIXI.Texture.fromImage("knight.png").baseTexture,
  new PIXI.Rectangle(0, 8, 8, 8),
);
let brickTexture = PIXI.Texture.fromImage("brick.png");
class Player extends Entity {
  public jumps: number = 2;
  public jump: boolean = false;
  public direction: number = 0;
  public speed: number = 0.07;
  constructor() {
    super(0, 0, new PIXI.Sprite(knightTexture));
  }
}

const player = new Player();
player.teleport(50, 50);
class Collider extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(0, 0, new PIXI.extras.TilingSprite(brickTexture, width, height));
    this.teleport(x, y);
    this.sprite.width = width;
    this.sprite.height = height;
  }
}

const colliders: Array<Collider> = [];
//colliders.push(new Collider(0, 0, 128, 8));
//colliders.push(new Collider(0, 0, 8, 128));
//colliders.push(new Collider(0, 1418, 128, 8));
//colliders.push(new Collider(120, 0, 8, 128));
//colliders.push(new Collider(120, 0, 16, 128));
//colliders.push(new Collider(0, 120, 128, 8));
//colliders.push(new Collider(120, 0, 8, 128));
colliders.push(new Collider(20, 20, 8, 8));
colliders.push(new Collider(80, 20, 8, 8));
colliders.push(new Collider(100, 20, 8, 8));
//colliders.push(new Collider(20, 28 + 8, 8, 8));
document.body.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case 38:
      player.jump = true;
      break;
    case 40:
      player.vy = player.speed;
      break;
    case 37:
      player.direction = -1;
      break;
    case 39:
      player.direction = 1;
      break;
  }
});

document.body.addEventListener("keyup", event => {
  switch (event.keyCode) {
    case 38:
      break;
    case 40:
      break;
    case 37:
      if (player.direction < 0) {
        player.direction = 0;
      }
      break;
    case 39:
      if (player.direction > 0) {
        player.direction = 0;
      }
      break;
  }
});
function raycast(
  start: {
    x: number;
    y: number;
    height: number;
    width: number;
  },
  direction: number,
  obstacle: {
    x: number;
    y: number;
    height: number;
    width: number;
  },
) {
  //check that the obstacle is correct height
  if (
    (start.y >= obstacle.y && start.y <= obstacle.y + obstacle.height) ||
    (start.y + start.height >= obstacle.y &&
      start.y + start.height <= obstacle.y + obstacle.height)
  ) {
    if (direction > 0) {
      if (obstacle.x >= start.x + start.width) {
        return obstacle.x - (start.x + start.width);
      }
    } else if (direction < 0) {
      if (obstacle.x + obstacle.width <= start.x) {
        return obstacle.x + obstacle.width - start.x;
      }
    }
  }
  if (direction > 0) {
    return Infinity;
  } else {
    return -Infinity;
  }
}
function flip(input: { x: number; y: number; width: number; height: number }) {
  return { x: input.y, y: input.x, width: input.height, height: input.width };
}
function update(delta: number) {
  if (player.direction > 0) {
    if (player.vx < 0) {
      player.vx *= 0.9;
    }
    //player.sprite.scale.x = 1;
    player.vx += 0.005;
  } else if (player.direction < 0) {
    if (player.vx > 0) {
      player.vx *= 0.9;
    }
    //player.sprite.scale.x = -1;
    player.vx -= 0.005;
  } else {
    player.vx *= 0.9;
  }
  //jumping
  if (player.jump) {
    player.vy -= 0.3;
    player.jump = false;
  }
  //gravity
  player.vy += 0.01;
  //limit speeds
  player.vy = Math.max(player.vy, -0.3);
  player.vy = Math.min(player.vy, 0.06);
  player.vx = Math.min(player.vx, player.speed);
  player.vx = Math.max(player.vx, -player.speed);
  player.dx = player.vx * delta;
  player.dy = player.vy * delta;

  if (player.dx > 0) {
    let distances = [];
    for (let i = 0; i < colliders.length; i++) {
      distances.push(raycast(player, player.dx, colliders[i]));
    }
    player.dx = Math.min(Math.min(...distances), player.dx);
  } else {
    for (let i = 0; i < colliders.length; i++) {
      player.dx = Math.max(player.dx, raycast(player, player.dx, colliders[i]));
    }
  }
  if (player.dy < 0) {
    for (let i = 0; i < colliders.length; i++) {
      player.dy = Math.max(
        player.dy,
        raycast(flip(player), player.dy, flip(colliders[i])),
      );
    }
  } else {
    let distances = [];
    for (let i = 0; i < colliders.length; i++) {
      distances.push(raycast(flip(player), player.dy, flip(colliders[i])));
    }
    player.dy = Math.min(player.dy, Math.min(...distances));
  }
  player.move(delta);
}

function draw(alpha: number) {
  player.interpolate(alpha);
  app.render();
}

MainLoop.setUpdate(update)
  .setDraw(draw)
  .start();
