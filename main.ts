PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const app = new PIXI.Application({ width: 128, height: 128, autoStart: false });
document.body.appendChild(app.view);

app.stage.interactiveChildren = false;
app.stage.scale.x = 4;
app.stage.scale.y = 4;
app.renderer.resize(128 * 4, 128 * 4);

let spriteSheet = PIXI.Texture.fromImage("s4m_ur4i-8x8-pico-8-free-tiles.png")
  .baseTexture;

let playerTexture = new PIXI.Texture(
  spriteSheet,
  new PIXI.Rectangle(8, 0, 8, 8),
);

let brickTexture = new PIXI.Texture(
  spriteSheet,
  new PIXI.Rectangle(0, 8, 8, 8),
);
let ladderTexture = new PIXI.Texture(
  spriteSheet,
  new PIXI.Rectangle(8 * 6, 0, 8, 8),
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

class Collider extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, new PIXI.extras.TilingSprite(brickTexture, width, height));
  }
}
class Ladder extends Entity {
  constructor(x: number, y: number) {
    super(x, y, new PIXI.Sprite(ladderTexture));
  }
}

const colliders: Array<Collider> = [];
const ladders: Array<Ladder> = [];
for (let x = 0; x < stage.length; x++) {
  for (let y = 0; y < stage.length; y++) {
    switch (stage[y][x]) {
      case 1:
        colliders.push(new Collider(x * 8, y * 8, 8, 8));
        break;
      case 2:
        ladders.push(new Ladder(x * 8, y * 8));
        break;
    }
  }
}

class Player extends Entity {
  public grounded: boolean = false;
  public jumps: number = 2;
  public jump: boolean = false;
  public direction: number = 0;
  public speed: number = 0.07;
  public up: boolean = false;
  constructor() {
    super(20, 100, new PIXI.Sprite(playerTexture));
  }
}

const player = new Player();
player.setAnchor(0.35, 0);

document.body.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case 38:
      player.jump = true;
      player.up = true;
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
      player.up = false;
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
  if (player.direction > 0) {
    if (player.vx < 0) {
      player.vx *= 0.9;
    }
    player.sprite.scale.x = 1;
    player.vx += 0.005;
  } else if (player.direction < 0) {
    if (player.vx > 0) {
      player.vx *= 0.9;
    }
    player.sprite.scale.x = -1;
    player.vx -= 0.005;
  } else {
    player.vx *= 0.9;
  }
  //jumping
  if (player.jump && player.grounded) {
    player.vy -= 0.27;
  }
  for (let l of ladders) {
    if (intersect(player, l)) {
      if (player.up) {
        player.vy = -0.05;
      }
    }
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

  let playerCollision = allowedMovement(player, colliders);
  player.dx = playerCollision.dx;
  player.dy = playerCollision.dy;
  
  player.grounded = false;

  if (playerCollision.down) {
    player.grounded = true;
    if (player.vy > 0) {
      player.vy = 0;
    }
  }
  
  player.move(delta);
}

function draw(alpha: number) {
  player.interpolate(alpha);
  app.render();
}

MainLoop.setSimulationTimestep(1000 / 120)
  .setUpdate(update)
  .setDraw(draw)
  .start();
