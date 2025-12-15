import { GAME_TEXT, INVADER } from '../config';
import Screen from '../modules/Screen/Screen';
import Ctx from '../modules/Ctx/Ctx';
import Invader from '../modules/Invader/Invader';
import Mothership from '../modules/Mothership/Mothership';
import Button from '../modules/Button/Button';

export default class IntroScreen {
    constructor(startGame) {
        this.gameTextConfig = GAME_TEXT;
        this.invaderConfig = INVADER;
        this.screen = Screen();
        this.ctx = Ctx();
        this.ctx.font = this.gameTextConfig.font;
        this.ctx.fillStyle = this.gameTextConfig.fillStyle;
        this.x = 300;
        this.textX = 600;
        this.verticalSpacing = 60;
        this.currentYPost = 0;

        // Functions passed in from Game.js
        this.startGame = startGame;
    }

    render() {
        this.renderInvadersInfo();
        this.renderMothershipInfo();
        this.renderStartButton();
        this.renderInstructions();
    }

    renderInvadersInfo() {
        this.invaderConfig.forEach((invader, index) => {
            const y = (index + 1) * this.verticalSpacing;
            const type = invader.type;
            const invaderInfo = invader;
            const introInvader = new Invader(
                type,
                null,
                null,
                this.x,
                y,
                null
            )
            introInvader.x = this.x;
            introInvader.y = y;
            introInvader.spriteX = invader.spriteX;
            introInvader.spriteY = invader.spriteY;
            introInvader.score = invader.score;


            // Render invader
            introInvader.render();

            // Render text
            this.ctx.fillText("Score " + introInvader.score, this.textX, (index + 1) * this.verticalSpacing + introInvader.height);

            this.currentYPos = (index + 1) * this.verticalSpacing;
        });
    }

    renderMothershipInfo() {
        const mothership = new Mothership();

        mothership.x = this.x - 6;
        mothership.y = this.currentYPos + this.verticalSpacing + 6;
        mothership.isActive = true;

        mothership.render();

        this.ctx.fillText("Score ???", this.textX, this.currentYPos + this.verticalSpacing + mothership.height);

    }

    renderStartButton() {
        const startButton = Button(100, 200, 200, 60, 'START', '#0f0', 'startButton', 'button');
        startButton.render();

        const startButtonElement = document.getElementById('startButton');

        startButtonElement.addEventListener('click', () => {
            startButtonElement.classList.add('hide');
            this.startGame();
        });
    }

    renderInstructions() {
        let instructionsY = 550;

        this.ctx.font = this.gameTextConfig.introScreenArrowFont;

        this.ctx.fillText(String.fromCharCode('8592'), this.x, instructionsY);

        this.ctx.font = this.gameTextConfig.font;

        this.ctx.fillText("Move tank left", this.textX, instructionsY);

        instructionsY += this.verticalSpacing;

        this.ctx.font = this.gameTextConfig.introScreenArrowFont;

        this.ctx.fillText(String.fromCharCode('8594'), this.x, instructionsY);

        this.ctx.font = this.gameTextConfig.font;

        this.ctx.fillText("Move tank right", this.textX, instructionsY);

        instructionsY += this.verticalSpacing;

        this.ctx.fillText("Space bar", this.x, instructionsY);

        this.ctx.fillText("Fire", this.textX, instructionsY);
    }
}