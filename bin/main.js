"use strict";
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const app = new PIXI.Application({ width: 128, height: 128, autoStart: false });
document.body.appendChild(app.view);
app.stage.interactiveChildren = false;
app.stage.scale.x = 4;
app.stage.scale.y = 4;
app.renderer.resize(128 * 4, 128 * 4);
let spriteSheet = PIXI.Texture.fromImage("s4m_ur4i-8x8-pico-8-free-tiles.png")
    .baseTexture;
let playerSheet = PIXI.Texture.fromImage("player.png").baseTexture;
let playerTextures = [new PIXI.Texture(playerSheet, new PIXI.Rectangle(0, 0, 8, 8)), new PIXI.Texture(playerSheet, new PIXI.Rectangle(0, 8, 8, 8))];
let brickTexture = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(0, 8, 8, 8));
let ladderTexture = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(8 * 6, 0, 8, 8));
let batTexture = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(8 * 8, 8 * 2, 16, 8));
let torchTexture = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(8 * 6, 8 * 3, 8, 8));
let jumpSound = new Audio("341246__sharesynth__jump02.wav");
jumpSound.volume = 0.01;
let undergroundTheme = new Audio("Video Game Underground.wav");
undergroundTheme.volume = 0.05;
undergroundTheme.loop = true;
document.onclick = ev => {
    if (undergroundTheme) {
        undergroundTheme.play();
    }
};
const stage = [
    [1, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
];
const cosmeticStage = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
class Collider extends Entity {
    constructor(x, y, width, height) {
        super(x, y, new PIXI.extras.TilingSprite(brickTexture, width, height));
    }
}
class Ladder extends Entity {
    constructor(x, y) {
        super(x, y, new PIXI.Sprite(ladderTexture));
    }
}
const colliders = [];
const ladders = [];
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
for (let x = 0; x < cosmeticStage.length; x++) {
    for (let y = 0; y < cosmeticStage.length; y++) {
        switch (cosmeticStage[y][x]) {
            case 1:
                let torch = new PIXI.Sprite(torchTexture);
                torch.x = x * 8;
                torch.y = y * 8;
                app.stage.addChild(torch);
                break;
        }
    }
}
class Player extends Entity {
    constructor() {
        super(20, 100, new PIXI.Sprite(playerTextures[0]));
        this.grounded = false;
        this.jumps = 2;
        this.jump = false;
        this.direction = 0;
        this.speed = 0.5 / 8.333333333333;
        this.up = false;
        this.walkCycle = new SpriteAnimation(playerTextures, true);
        this.walkCycle.speed = 100;
        this.setAnchor(0.35, 0);
        this.width = 7;
        this.height = 7;
        this.spriteOffset.x -= 0.5;
        this.spriteOffset.y -= 1;
    }
}
class Bat extends Entity {
    constructor(x, y) {
        super(x, y, new PIXI.Sprite(batTexture));
    }
}
const player = new Player();
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
let camera = 0;
let initStage = app.stage.y;
let cameraX = 0;
let initStageX = app.stage.x;
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
function update(delta) {
    if (player.direction != 0) {
        player.walkCycle.start();
        player.setTexture(player.walkCycle.getFrame());
    }
    else {
        player.walkCycle.stop();
        player.walkCycle.frameNumber = 0;
    }
    if (player.direction > 0) {
        if (player.vx < 0) {
            player.vx *= 0.9;
        }
        player.sprite.scale.x = 1;
        player.vx += 0.005;
    }
    else if (player.direction < 0) {
        if (player.vx > 0) {
            player.vx *= 0.9;
        }
        player.sprite.scale.x = -1;
        player.vx -= 0.005;
    }
    else {
        player.vx *= 0.9;
    }
    //jumping
    if (player.jump && player.grounded) {
        player.vy -= 0.27;
        jumpSound.play();
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
    let playerCollision = collide(player, colliders, delta);
    player.vx = playerCollision.vx;
    player.vy = playerCollision.vy;
    player.grounded = false;
    if (playerCollision.down) {
        player.grounded = true;
        if (player.vy > 0) {
            player.vy = 0;
        }
    }
    camera -= player.vy * delta;
    let x = performance.now() / 10000;
    //cameraX = 5 * Math.sin(300 * x) * (1 - x / 5);
    player.move(delta);
}
function draw(alpha) {
    player.interpolate(alpha);
    app.stage.y = Math.floor(initStage + camera);
    app.stage.x = Math.floor(initStageX + cameraX);
    app.render();
}
MainLoop.setSimulationTimestep(1000 / 120)
    .setUpdate(update)
    .setDraw(draw)
    .start();
