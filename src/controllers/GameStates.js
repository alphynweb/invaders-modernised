export default class GameStates {
    constructor(
        onIntro,
        onStartGame,
        onRunGame,
        onPauseGame,
        onStartLevel,
        onFinishLevel,
        onLoseLife,
        onEndGame
    ) {
        this.currentState = this.intro;

        // Functions passed in from main Game class
        this.onStartGame = onStartGame;
        this.onStartLevel = onStartLevel;
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

    finishLevel(currentTime) {
        this.onFinishLevel(currentTime);
    }

    startLevel() {
        this.onStartLevel();
    }

    lose(currentTime) {
        this.onLoseLife(currentTime);
    }

    over(currentTime) {
        this.onEndGame(currentTime);
    }
}