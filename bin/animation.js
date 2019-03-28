"use strict";
//sprite animation class - doesn't use setInterval, instead evaluates what the frame should be every time it is called.
class SpriteAnimation {
    constructor(frames, loop = false) {
        this.frames = frames;
        this.loop = loop;
        this._frameNumber = 0;
        this.speed = 1000 / 30;
        this.startTime = Date.now();
        this.startFrame = 0;
        this._running = false;
    }
    ;
    set frameNumber(frameNumber) {
        this._frameNumber = frameNumber;
        this.stop();
        this.start();
    }
    get running() {
        return this._running;
    }
    get frameNumber() {
        return this._frameNumber;
    }
    getFrame() {
        if (this._running) {
            let currentFrame = (Math.floor((Date.now() - this.startTime) / this.speed) + this.startFrame);
            if (this.loop) {
                this._frameNumber = currentFrame % this.frames.length;
            }
            else {
                this._frameNumber = Math.min(this.frames.length, currentFrame);
            }
        }
        return this.frames[this._frameNumber];
    }
    start() {
        if (!this._running) {
            this._running = true;
            this.startTime = Date.now();
            this.startFrame = this._frameNumber;
        }
    }
    stop() {
        this._running = false;
    }
}
