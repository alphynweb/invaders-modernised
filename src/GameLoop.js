export default class GameLoop {
    constructor(onTick) {
        this.rafId = null;
        this.prevFrameTime = 0;
        this.fps = 60;
        this.frameDuration = 1000 / this.fps;
        this.delta = 0;

        this.onTick = onTick;
    }

    start() {
        const loop = (currentTime) => {
            this.delta = currentTime - this.prevFrameTime;

            if (this.delta >= this.frameDuration) {
                this.prevFrameTime = currentTime;
                this.onTick(currentTime);
            }

            this.rafId = requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    stop() {
        console.log("Stopping game loop");
        cancelAnimationFrame(this.rafId);
    }
}