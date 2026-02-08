export default class Lives {
    constructor(configs) {
        const config = configs['main'];
        this.livesLeft = config.lives;
    }

    lose = () => {
        this.livesLeft--;
    }
}