export default class GameStates {
    constructor(introScreen, startGame, runGame, finishLevel, loseLife, gameOver,) {
        this.currentState = this.intro;

        // Functions passed in from main Game class
        this.startGame = startGame;
        this.finishLevel = finishLevel;
        this.loseLife = loseLife;
        this.introScreen = introScreen;
        this.gameOver = gameOver;
        this.runGame = runGame;
    }

    intro(currentTime) {
        this.introScreen(currentTime);
    }

    run(currentTime) {
        this.runGame(currentTime);
    }

    finish(currentTime) {
        this.finishLevel(currentTime);
    }

    lose(currentTime) {
        this.loseLife(currentTime);
    }

    over(currentTime) {
        this.gameOver(currentTime);
    }
}