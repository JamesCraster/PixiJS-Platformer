PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const app = new PIXI.Application({ width: 128, height: 128, autoStart: false });
document.body.appendChild(app.view);

app.stage.interactiveChildren = false;
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
  PIXI.Texture.fromImage("s4m_ur4i-8x8-pico-8-free-tiles.png").baseTexture,
  new PIXI.Rectangle(8, 0, 8, 8),
);
const stage = [
  [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
];

let brickTexture = new PIXI.Texture(
  PIXI.Texture.fromImage("s4m_ur4i-8x8-pico-8-free-tiles.png").baseTexture,
  new PIXI.Rectangle(0, 8, 8, 8),
);
let ladderTexture = new PIXI.Texture(
  PIXI.Texture.fromImage("s4m_ur4i-8x8-pico-8-free-tiles.png").baseTexture,
  new PIXI.Rectangle(8 * 6, 0, 8, 8),
);
class Collider extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(0, 0, new PIXI.extras.TilingSprite(brickTexture, width, height));
    this.teleport(x, y);
    this.sprite.width = width;
    this.sprite.height = height;
  }
}
class Ladder extends Entity {
  constructor(x: number, y: number) {
    super(0, 0, new PIXI.Sprite(ladderTexture));
    this.teleport(x, y);
  }
}
const colliders: Array<Collider> = [];
for (let x = 0; x < stage.length; x++) {
  for (let y = 0; y < stage.length; y++) {
    if (stage[y][x] == 1) {
      colliders.push(new Collider(x * 8, y * 8, 8, 8));
    } else if (stage[y][x] == 2) {
      new Ladder(x * 8, y * 8);
    }
  }
}

let doorTexture = PIXI.Texture.fromImage("door.png");

class Player extends Entity {
  public grounded: boolean = false;
  public jumps: number = 2;
  public jump: boolean = false;
  public direction: number = 0;
  public speed: number = 0.07;
  constructor() {
    super(0, 0, new PIXI.Sprite(knightTexture));
    this.teleport(20, 100);
  }
}

const player = new Player();

class Door extends Entity {
  constructor() {
    super(0, 0, new PIXI.Sprite(doorTexture));
  }
}
let door = new Door();
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

function update(delta: number) {
  //console.log(delta);
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
  if (player.jump && player.grounded) {
    player.vy -= 0.27;
  }
  player.jump = false;
  //gravity
  player.vy += 0.01;
  //limit speeds
  player.vy = Math.max(player.vy, -0.5);
  player.vy = Math.min(player.vy, 0.09);
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
    let distances = [];
    for (let i = 0; i < colliders.length; i++) {
      distances.push(raycast(player, player.dx, colliders[i]));
    }
    player.dx = Math.max(Math.max(...distances), player.dx);
  }
  player.grounded = false;
  if (player.dy < 0) {
    let distances = [];
    for (let i = 0; i < colliders.length; i++) {
      distances.push(raycast(flip(player), player.dy, flip(colliders[i])));
    }
    player.dy = Math.max(player.dy, Math.max(...distances));
  } else {
    let distances = [];
    for (let i = 0; i < colliders.length; i++) {
      distances.push(raycast(flip(player), player.dy, flip(colliders[i])));
    }
    if (player.dy > Math.min(...distances)) {
      player.grounded = true;
      if (player.vy > 0) {
        player.vy = 0;
      }
    }
    player.dy = Math.min(player.dy, Math.min(...distances));
  }
  player.move(delta);
}

function draw(alpha: number) {
  //console.log(alpha);
  player.interpolate(alpha);
  app.render();
}

MainLoop.setSimulationTimestep(1000 / 120)
  .setUpdate(update)
  .setDraw(draw)
  .start();
