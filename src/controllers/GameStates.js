export default class GameStates {
    constructor(
        onIntro,
        onStartGame,
        onRunGame,
        onPauseGame,
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
        this.onPauseGame = onPauseGame;
    }

    intro(currentTime) {
        this.onIntro(currentTime);
    }

    run(currentTime) {
        this.onRunGame(currentTime);
    }

    pause(currentTime) {
        this.onPauseGame();
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