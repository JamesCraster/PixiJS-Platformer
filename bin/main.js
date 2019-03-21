"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
var app = new PIXI.Application({ width: 128, height: 128, autoStart: false });
document.body.appendChild(app.view);
app.stage.interactiveChildren = false;
app.stage.scale.x = 4;
app.stage.scale.y = 4;
app.renderer.resize(128 * 4, 128 * 4);
var spriteSheet = PIXI.Texture.fromImage("s4m_ur4i-8x8-pico-8-free-tiles.png")
    .baseTexture;
var playerTexture = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(8, 0, 8, 8));
var brickTexture = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(0, 8, 8, 8));
var ladderTexture = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(8 * 6, 0, 8, 8));
var stage = [
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
var Collider = /** @class */ (function (_super) {
    __extends(Collider, _super);
    function Collider(x, y, width, height) {
        return _super.call(this, x, y, new PIXI.extras.TilingSprite(brickTexture, width, height)) || this;
    }
    return Collider;
}(Entity));
var Ladder = /** @class */ (function (_super) {
    __extends(Ladder, _super);
    function Ladder(x, y) {
        return _super.call(this, x, y, new PIXI.Sprite(ladderTexture)) || this;
    }
    return Ladder;
}(Entity));
var colliders = [];
var ladders = [];
for (var x = 0; x < stage.length; x++) {
    for (var y = 0; y < stage.length; y++) {
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
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, 20, 100, new PIXI.Sprite(playerTexture)) || this;
        _this.grounded = false;
        _this.jumps = 2;
        _this.jump = false;
        _this.direction = 0;
        _this.speed = 0.07;
        _this.up = false;
        return _this;
    }
    return Player;
}(Entity));
var player = new Player();
player.setAnchor(0.35, 0);
document.body.addEventListener("keydown", function (event) {
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
document.body.addEventListener("keyup", function (event) {
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
    }
    for (var _i = 0, ladders_1 = ladders; _i < ladders_1.length; _i++) {
        var l = ladders_1[_i];
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
    if (player.dx > 0) {
        var distances = [];
        for (var i = 0; i < colliders.length; i++) {
            distances.push(raycast(player, player.dx, colliders[i]));
        }
        player.dx = Math.min(Math.min.apply(Math, distances), player.dx);
    }
    else {
        var distances = [];
        for (var i = 0; i < colliders.length; i++) {
            distances.push(raycast(player, player.dx, colliders[i]));
        }
        player.dx = Math.max(Math.max.apply(Math, distances), player.dx);
    }
    player.grounded = false;
    if (player.dy < 0) {
        var distances = [];
        for (var i = 0; i < colliders.length; i++) {
            distances.push(raycast(flip(player), player.dy, flip(colliders[i])));
        }
        player.dy = Math.max(player.dy, Math.max.apply(Math, distances));
    }
    else {
        var distances = [];
        for (var i = 0; i < colliders.length; i++) {
            distances.push(raycast(flip(player), player.dy, flip(colliders[i])));
        }
        if (player.dy > Math.min.apply(Math, distances)) {
            player.grounded = true;
            if (player.vy > 0) {
                player.vy = 0;
            }
        }
        player.dy = Math.min(player.dy, Math.min.apply(Math, distances));
    }
    player.move(delta);
}
function draw(alpha) {
    player.interpolate(alpha);
    app.render();
}
MainLoop.setSimulationTimestep(1000 / 120)
    .setUpdate(update)
    .setDraw(draw)
    .start();
