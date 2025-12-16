import { GAME_TEXT } from '../config';

export default class GameOver {
    constructor(screen) {
        this.screen = screen;
    }

    endGame(gameLoop, cities) {
        this.screen.clear();
        gameLoop.stop();
        cities.clear();
    }

    render(score = 0, startButton) {
        const gameTextConfig = GAME_TEXT;
        this.screen.ctx.fillStyle = 'white';
        this.screen.ctx.font = gameTextConfig.font;
        this.screen.ctx.fillText("GAME OVER", 10, 30);
        this.screen.ctx.fillText("YOU SCORED " + score.currentScore, 10, 60);
        startButton.classList.remove('hide');
    }

}