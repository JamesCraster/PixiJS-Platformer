"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
var app = new PIXI.Application({ width: 128, height: 128, autoStart: false, forceCanvas: true });
document.body.appendChild(app.view);
var stopped = false;
var frameCount = 0;
var fps = 30;
var fpsInterval = 1000 / fps;
var startTime = Date.now();
var then = startTime;
var now = Date.now();
var elapsed = now - then;
app.stage.interactiveChildren = false;
app.stage.scale.x = 4;
app.stage.scale.y = 4;
app.renderer.resize(128 * 4, 128 * 4);
var score = 0;
var scoreText = new PIXI.Text("0", {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0xff1010,
    align: "center",
});
scoreText.scale.x = 0.25;
scoreText.scale.y = 0.25;
app.stage.addChild(scoreText);
var knightTexture = new PIXI.Texture(PIXI.Texture.fromImage("knight.png").baseTexture, new PIXI.Rectangle(0, 0, 8, 8));
var knightTexture2 = new PIXI.Texture(PIXI.Texture.fromImage("knight.png").baseTexture, new PIXI.Rectangle(0, 8, 8, 8));
var brickTexture = PIXI.Texture.fromImage("brick.png");
var doorTexture = PIXI.Texture.fromImage("door.png");
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, 0, 0, new PIXI.Sprite(knightTexture)) || this;
        _this.grounded = false;
        _this.jumps = 2;
        _this.jump = false;
        _this.direction = 0;
        _this.speed = 2;
        _this.teleport(50, 50);
        return _this;
    }
    return Player;
}(Entity));
var player = new Player();
var Collider = /** @class */ (function (_super) {
    __extends(Collider, _super);
    function Collider(x, y, width, height) {
        var _this = _super.call(this, 0, 0, new PIXI.extras.TilingSprite(brickTexture, width, height)) || this;
        _this.teleport(x, y);
        _this.sprite.width = width;
        _this.sprite.height = height;
        return _this;
    }
    return Collider;
}(Entity));
var Door = /** @class */ (function (_super) {
    __extends(Door, _super);
    function Door() {
        return _super.call(this, 0, 0, new PIXI.Sprite(doorTexture)) || this;
    }
    return Door;
}(Entity));
var door = new Door();
var colliders = [];
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
document.body.addEventListener("keydown", function (event) {
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
document.body.addEventListener("keyup", function (event) {
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
function update(delta) {
    if (player.direction > 0) {
        if (player.vx < 0) {
            player.vx *= 0.9;
        }
        //player.sprite.scale.x = 1;
        player.vx = player.speed;
    }
    else if (player.direction < 0) {
        if (player.vx > 0) {
            player.vx *= 0.75;
        }
        //player.sprite.scale.x = -1;
        player.vx = -player.speed;
    }
    else {
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
