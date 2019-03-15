"use strict";
var Entity = /** @class */ (function () {
    function Entity(x, y, sprite) {
        this._x = x;
        this._y = y;
        this.vx = 0;
        this.vy = 0;
        this.dx = 0;
        this.dy = 0;
        this._lastPos = { x: x, y: y };
        this.sprite = sprite;
        app.stage.addChild(sprite);
    }
    Object.defineProperty(Entity.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "width", {
        get: function () {
            return this.sprite.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "height", {
        get: function () {
            return this.sprite.height;
        },
        enumerable: true,
        configurable: true
    });
    //only call for sudden movement, like teleportation, where the entity should jump to a new postion
    //without interpolation
    Entity.prototype.teleport = function (x, y) {
        this._x = x;
        this._y = y;
        this._lastPos = { x: x, y: y };
        this.sprite.y = y;
        this.sprite.x = x;
    };
    //call once and only once per physics update to move the entity
    Entity.prototype.move = function (delta) {
        this._lastPos = { x: this._x, y: this._y };
        this._x += this.dx;
        this._y += this.dy;
    };
    //call in draw to position the sprite smoothly
    Entity.prototype.interpolate = function (alpha) {
        this.sprite.x = this._lastPos.x + (this.x - this._lastPos.x) * alpha;
        this.sprite.y = this._lastPos.y + (this.y - this._lastPos.y) * alpha;
    };
    return Entity;
}());
