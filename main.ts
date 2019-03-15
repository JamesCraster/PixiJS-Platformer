PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const app = new PIXI.Application({ width: 128, height: 128, autoStart: false });
document.body.appendChild(app.view);

const INFINITY = 10000;

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

class Player extends Entity {
  public jumps: number = 2;
  public jump: boolean = false;
  public speed: number = 0.04;
  constructor() {
    super(
      0,
      0,
      new PIXI.Graphics()
        .beginFill(0xde3249)
        .drawRect(0, 0, 8, 8)
        .endFill(),
    );
  }
}

const player = new Player();

document.body.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case 38:
      player.jump = true;
      break;
    case 40:
      player.vy = player.speed;
      break;
    case 37:
      player.vx = -player.speed;
      break;
    case 39:
      player.vx = player.speed;
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
      if (player.vx < 0) {
        player.vx = 0;
      }
      break;
    case 39:
      if (player.vx > 0) {
        player.vx = 0;
      }
      break;
  }
});

function update(delta: number) {
  if (player.jump) {
    player.vy -= 0.3;
    player.jump = false;
  }
  player.vy += 0.01;
  player.vy = Math.min(player.vy, 0.06);
  player.move(delta);
}

function draw(alpha: number) {
  player.interpolate(alpha);
  app.render();
}

MainLoop.setUpdate(update)
  .setDraw(draw)
  .start();
