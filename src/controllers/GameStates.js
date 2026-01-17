export default class GameStates {
    constructor(
        onIntro,
        onStartGame,
        onRunGame,
        onFinishLevel,
        onLoseLife,
        onEndGame
    ) {
        this.currentState = this.intro;

        // Functions passed in from main Game class
        this.onStartGame = onStartGame;
        this.onFinishLevel = onFinishLevel;
        this.onLoseLife = onLoseLife;
        this.onIntro = onIntro;
        this.onEndGame = onEndGame;
        this.onRunGame = onRunGame;
    }

    intro(currentTime) {
        this.onIntro(currentTime);
    }

    run(currentTime) {
        this.onRunGame(currentTime);
    }

    finish(currentTime) {
        this.onFinishLevel(currentTime);
    }

    lose(currentTime) {
        this.onLoseLife(currentTime);
    }

    over(currentTime) {
        this.onEndGame(currentTime);
    }
}