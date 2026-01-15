export default class Score {
    constructor() {
        this.currentScore = 0;
    }

    increase = (scoreIncrease) => {
        this.currentScore += scoreIncrease;
    }

    reset = () => {
        this.currentScore = 0;
    }
}