export default class GameLoop {
    constructor(update, render, gameStates) {
        this.update = update;
        this.render = render;
        this.gameStates = gameStates;
        this.gameLoop = null;
        this.prevFrameTime = 0;
        this.fps = 300;
        this.frameDuration = 1000 / this.fps;
        this.delta = 0;
    }

    start() {
        const loop = (currentTime) => {
            this.delta = currentTime - this.prevFrameTime;

            if (this.delta >= this.frameDuration) {
                this.prevFrameTime = currentTime;
                this.gameStates.currentState(currentTime);
            }

            this.gameLoop = requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    stop() {
        cancelAnimationFrame(this.gameLoop);
    }
}