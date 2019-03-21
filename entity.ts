class Entity {
  private _x: number;
  private _y: number;
  public vx: number;
  public vy: number;
  private _lastPos: { x: number; y: number };
  public spriteOffset: { x: number; y: number };
  public sprite: PIXI.DisplayObject & { width: number; height: number };
  public width: number;
  public height: number;
  constructor(x: number, y: number, sprite: PIXI.DisplayObject & { width: number; height: number }) {
    this._x = x;
    this._y = y;
    this.vx = 0;
    this.vy = 0;
    this._lastPos = { x: x, y: y };
    this.sprite = sprite;
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.pivot.x = 0.5;
    this.sprite.pivot.y = 0.5;
    this.spriteOffset = { x: 0, y: 0 };
    this.width = this.sprite.width;
    this.height = this.sprite.height;
    app.stage.addChild(sprite);
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  //set the anchor of the entity (for scaling, rotation etc.) - adjusts the sprite to avoid changing position
  //x and y should each be between 0 and 1
  setAnchor(x: number, y: number) {
    let sprite = this.sprite as PIXI.Sprite;
    if (sprite.anchor) {
      sprite.anchor.x = x;
      sprite.anchor.y = y;
      this.spriteOffset.x = x * this.sprite.width;
      this.spriteOffset.y = y * this.sprite.height;
    }
  }
  //only call for sudden movement, like teleportation, where the entity should jump to a new postion
  //without interpolation
  teleport(x: number, y: number) {
    this._x = x;
    this._y = y;
    this._lastPos = { x: x, y: y };
    this.sprite.y = y;
    this.sprite.x = x;
  }
  //call once and only once per physics update to move the entity
  move(delta: number) {
    this._lastPos = { x: this._x, y: this._y };
    this._x += this.vx * delta;
    this._y += this.vy * delta;
  }
  //call in draw to position the sprite smoothly
  interpolate(alpha: number) {
    this.sprite.x =
      Math.floor((this._lastPos.x + (this.x - this._lastPos.x) * alpha) * 4) /
      4 +
      this.spriteOffset.x;
    this.sprite.y =
      Math.floor((this._lastPos.y + (this.y - this._lastPos.y) * alpha) * 4) /
      4 +
      this.spriteOffset.y;
  }
}
