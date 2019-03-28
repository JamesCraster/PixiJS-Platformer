//sprite animation class - doesn't use setInterval, instead evaluates what the frame should be every time it is called.
class SpriteAnimation{
    private _frameNumber: number = 0;
    public speed:number = 1000/30;
    private startTime:number = Date.now();
    private startFrame:number = 0;
    public _running:boolean = false;
    constructor(private readonly frames : Readonly<Array<PIXI.Texture>>, public loop = false){};
    set frameNumber(frameNumber:number){
      this._frameNumber = frameNumber;
      this.stop();
      this.start();
    }
    get running(){
        return this._running;
    }
    get frameNumber(){
        return this._frameNumber;
    }
    getFrame(){
        if(this._running){
            let currentFrame = (Math.floor((Date.now() - this.startTime)/this.speed) + this.startFrame);
            if(this.loop){
                this._frameNumber = currentFrame % this.frames.length;
            }else{
                this._frameNumber = Math.min(this.frames.length, currentFrame);
            }
        }
        return this.frames[this._frameNumber];
    }
    start(){
        if(!this._running){
            this._running = true;
            this.startTime = Date.now();
            this.startFrame = this._frameNumber;
        }
    }
    stop(){
        this._running = false;
    }
}

