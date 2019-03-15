class Entity {
  private _x: number;
  private _y: number;
  public vx: number;
  public vy: number;
  private _lastPos: { x: number; y: number };
  public sprite: PIXI.DisplayObject;
  constructor(x: number, y: number, sprite: PIXI.DisplayObject) {
    this._x = x;
    this._y = y;
    this.vx = 0;
    this.vy = 0;
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
    this.sprite.x = this._lastPos.x + (this.x - this._lastPos.x) * alpha;
    this.sprite.y = this._lastPos.y + (this.y - this._lastPos.y) * alpha;
  }
}
