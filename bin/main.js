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
var INFINITY = 10000;
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
        _this.speed = 0.04;
        return _this;
    }
    return Player;
}(Entity));
var player = new Player();
document.body.addEventListener("keydown", function (event) {
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
document.body.addEventListener("keyup", function (event) {
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
function update(delta) {
    if (player.jump) {
        player.vy -= 0.3;
        player.jump = false;
    }
    player.vy += 0.01;
    player.vy = Math.min(player.vy, 0.06);
    player.move(delta);
}
function draw(alpha) {
    player.interpolate(alpha);
    app.render();
}
MainLoop.setUpdate(update)
    .setDraw(draw)
    .start();
