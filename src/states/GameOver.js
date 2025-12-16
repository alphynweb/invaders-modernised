export default class GameOver {
    constructor(gameTextConfig, screen) {
        this.gameTextConfig = gameTextConfig;
        this.screen = screen;
    }

    endGame(cities) {
        this.screen.clear();
        cities.clear();
    }

    render(score = 0, startButton) {
        this.screen.ctx.fillStyle = 'white';
        this.screen.ctx.font = this.gameTextConfig.font;
        this.screen.ctx.fillText("GAME OVER", 10, 30);
        this.screen.ctx.fillText("YOU SCORED " + score.currentScore, 10, 60);
        startButton.classList.remove('hide');
    }

}