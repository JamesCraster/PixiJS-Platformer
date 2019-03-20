PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const app = new PIXI.Application({ width: 128, height: 128, autoStart: false, forceCanvas:true });
document.body.appendChild(app.view);

let stopped = false;
let frameCount = 0;
let fps = 30;
let fpsInterval = 1000/fps;
let startTime = Date.now();
let then = startTime;
let now = Date.now();
let elapsed = now - then;

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
  PIXI.Texture.fromImage("knight.png").baseTexture,
  new PIXI.Rectangle(0, 0, 8, 8),
);
let knightTexture2 = new PIXI.Texture(
  PIXI.Texture.fromImage("knight.png").baseTexture,
  new PIXI.Rectangle(0, 8, 8, 8),
);
let brickTexture = PIXI.Texture.fromImage("brick.png");
let doorTexture = PIXI.Texture.fromImage("door.png");

class Player extends Entity {
  public grounded: boolean = false;
  public jumps: number = 2;
  public jump: boolean = false;
  public direction: number = 0;
  public speed: number = 2;
  constructor() {
    super(0, 0, new PIXI.Sprite(knightTexture));
    this.teleport(50, 50);
  }
}

const player = new Player();

class Collider extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(0, 0, new PIXI.extras.TilingSprite(brickTexture, width, height));
    this.teleport(x, y);
    this.sprite.width = width;
    this.sprite.height = height;
  }
}

class Door extends Entity {
  constructor() {
    super(0, 0, new PIXI.Sprite(doorTexture));
  }
}
let door = new Door();
const colliders: Array<Collider> = [];
colliders.push(new Collider(0, 0, 128, 8));
colliders.push(new Collider(0, 0, 8, 128));
//colliders.push(new Collider(0, 1418, 128, 8));
colliders.push(new Collider(120, 0, 8, 128));
//colliders.push(new Collider(120, 0, 16, 128));
colliders.push(new Collider(0, 120, 128, 8));
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

function update(delta: number) {
  if (player.direction > 0) {
    if (player.vx < 0) {
      player.vx *= 0.9;
    }
    //player.sprite.scale.x = 1;
    player.vx = player.speed;
  } else if (player.direction < 0) {
    if (player.vx > 0) {
      player.vx *= 0.75;
    }
    //player.sprite.scale.x = -1;
    player.vx = -player.speed;
  } else {
    player.vx *= 0.75;
  }
  //jumping
  if (player.jump && player.grounded) {
    player.vy = -2;
  }
  player.jump = false;
  //gravity
  player.vy += 0.05;
  //limit speeds
  player.vy = Math.max(player.vy, -4);
  player.vy = Math.min(player.vy, 6);
  player.vx = Math.min(player.vx, player.speed);
  player.vx = Math.max(player.vx, -player.speed);
  player.dx = player.vx;
  player.dy = player.vy;

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
  player.sprite.x = player.x;
  player.sprite.y = player.y;
  //player.interpolate(alpha);
  app.render();
}

//MainLoop.setSimulationTimestep(1000 / 120)
  //.setUpdate(update)
  //.setDraw(draw)
  //.start();
  function animate() {

    // stop
    if (stopped) {
        return;
    }

    // request another frame

    requestAnimationFrame(animate);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        then = now - (elapsed % fpsInterval);

        // draw stuff here
        update(8);
        draw(2);

    }
}

animate();
