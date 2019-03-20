class Entity {
  private _x: number;
  private _y: number;
  public vx: number;
  public vy: number;
  public dx: number;
  public dy: number;
  private _lastPos: { x: number; y: number };
  public sprite: PIXI.DisplayObject & { width: number; height: number };
  constructor(
    x: number,
    y: number,
    sprite: PIXI.DisplayObject & { width: number; height: number },
  ) {
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
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get width() {
    return this.sprite.width;
  }
  get height() {
    return this.sprite.height;
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
    this._x += this.dx;
    this._y += this.dy;
  }
  //call in draw to position the sprite smoothly
  interpolate(alpha: number) {
    this.sprite.x = Math.floor(this._lastPos.x * (1-alpha) + (this.x) * alpha + 0.01);
    this.sprite.y = Math.floor(this._lastPos.y * (1-alpha) + (this.y) * alpha + 0.01);
  }
}
