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
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, 0, 0, new PIXI.Graphics()
            .beginFill(0xde3249)
            .drawRect(0, 0, 8, 8)
            .endFill()) || this;
        _this.jumps = 2;
        _this.jump = false;
        _this.direction = 0;
        _this.speed = 0.07;
        return _this;
    }
    return Player;
}(Entity));
var player = new Player();
player.teleport(50, 50);
var Collider = /** @class */ (function (_super) {
    __extends(Collider, _super);
    function Collider(x, y, width, height) {
        var _this = _super.call(this, 0, 0, new PIXI.Graphics()
            .beginFill(0xde3249)
            .drawRect(0, 0, 8, 8)
            .endFill()) || this;
        _this.teleport(x, y);
        _this.sprite.width = width;
        _this.sprite.height = height;
        return _this;
    }
    return Collider;
}(Entity));
var colliders = [];
//colliders.push(new Collider(0, 0, 128, 8));
colliders.push(new Collider(0, 0, 4, 128));
//colliders.push(new Collider(0, 1418, 128, 8));
colliders.push(new Collider(124, 0, 4, 128));
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
function raycast(start, direction, obstacle) {
    //check that the obstacle is correct height
    if ((start.y >= obstacle.y && start.y <= obstacle.y + obstacle.height) ||
        (start.y + start.height >= obstacle.y &&
            start.y + start.height <= obstacle.y + obstacle.height)) {
        if (direction > 0) {
            if (obstacle.x >= start.x + start.width) {
                return obstacle.x - (start.x + start.width);
            }
        }
        else if (direction < 0) {
            if (obstacle.x + obstacle.width <= start.x) {
                return obstacle.x + obstacle.width - start.x;
            }
        }
    }
    if (direction > 0) {
        return Infinity;
    }
    else {
        return -Infinity;
    }
}
function flip(input) {
    return { x: input.y, y: input.x, width: input.height, height: input.width };
}
function update(delta) {
    if (player.direction > 0) {
        if (player.vx < 0) {
            player.vx *= 0.9;
        }
        player.vx += 0.005;
    }
    else if (player.direction < 0) {
        if (player.vx > 0) {
            player.vx *= 0.9;
        }
        player.vx -= 0.005;
    }
    else {
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
        for (var i = 0; i < colliders.length; i++) {
            player.dx = Math.min(raycast(player, player.dx, colliders[i]), player.dx);
        }
    }
    else {
        for (var i = 0; i < colliders.length; i++) {
            player.dx = Math.max(player.dx, raycast(player, player.dx, colliders[i]));
        }
    }
    if (player.dy < 0) {
        for (var i = 0; i < colliders.length; i++) {
            player.dy = Math.max(player.dy, raycast(flip(player), player.dy, flip(colliders[i])));
        }
    }
    else {
        for (var i = 0; i < colliders.length; i++) {
            player.dy = Math.min(player.dy, raycast(flip(player), player.dy, flip(colliders[i])));
        }
    }
    player.move(delta);
}
function draw(alpha) {
    player.interpolate(alpha);
    app.render();
}
MainLoop.setUpdate(update)
    .setDraw(draw)
    .start();
