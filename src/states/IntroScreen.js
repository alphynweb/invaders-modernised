import Invader from '../modules/Invader/Invader';
import Mothership from '../modules/Mothership/Mothership';
import Button from '../modules/Button/Button';

export default class IntroScreen {
    constructor(
        graphicsManager,
        screen,
        startGame,
        textConfig,
        mothershipConfig,
        invaderConfig,
        buttonConfig
    ) {
        this.graphicsManager = graphicsManager;
        this.textConfig = textConfig;
        this.mothershipConfig = mothershipConfig;
        this.invaderConfig = invaderConfig;
        this.buttonConfig = buttonConfig;
        this.screen = screen;
        this.ctx = screen.ctx;
        this.font = this.textConfig.configs['gameText'].font;
        this.arrowFont = this.textConfig.configs['gameText'].arrowFont;
        this.fillStyle = this.textConfig.configs['gameText'].fillStyle;
        this.x = 300;
        this.textX = 600;
        this.verticalSpacing = 60;
        this.y = this.verticalSpacing;
        this.currentYPost = 0;

        this.startGame = startGame;
    }

    render = () => {
        this.renderInvadersInfo();
        this.renderMothershipInfo();
        this.renderStartButton();
        this.renderInstructions();
    }

    renderInvadersInfo = () => {
        let index = 1;
        for (const [subType, config] of Object.entries(this.invaderConfig.configs)) {

            const invader = new Invader(
                this.invaderConfig.type,
                subType,
                this.invaderConfig.configs,
                this.x,
                this.y
            )

            this.graphicsManager.render(invader);

            this.graphicsManager.renderText(
                this.font,
                this.fillStyle,
                this.textX,
                this.y + (invader.height / 2),
                "Score " + invader.score
            );

            index++;
            this.y += this.verticalSpacing;
        }
    }

    renderMothershipInfo = () => {
        let index = 1;
        for (const [subType, config] of Object.entries(this.mothershipConfig.configs)) {
            const y = index * this.verticalSpacing;

            const mothership = new Mothership(
                this.mothershipConfig.type,
                subType,
                this.mothershipConfig.configs,
                this.x,
                this.y
            )

            this.graphicsManager.render(mothership);

            this.graphicsManager.renderText(
                this.font,
                this.fillStyle,
                this.textX,
                this.y + (mothership.height / 2),
                "Score ???"
            )

            index++;
        }
    }

    renderStartButton = () => {
        const x = 420;
        const y = 400;
        const subType = 'startButton';
        const animationType = 'normal';
        const startButtonConfigs = this.buttonConfig.configs[subType].spriteInfo[animationType];
        const width = startButtonConfigs.width;
        const height = startButtonConfigs.height;

        const startButton = new Button(
            this.buttonConfig.type,
            subType,
            this.buttonConfig.configs,
            x,
            y
        );

        this.graphicsManager.render(startButton);

        const clickListen = (event) => {
            const xClicked = event.clientX;
            const yClicked = event.clientY;

            console.log("Screen clicked. x", xClicked, 'y', yClicked);

            if (x < xClicked && (x + width) > xClicked && y < yClicked && (y + height) > yClicked) {
                event.currentTarget.removeEventListener('click', clickListen);
                this.startGame();
            }
        }

        this.screen.screen.addEventListener('click', clickListen);
    }

    renderInstructions = () => {
        let y = 550;

        this.graphicsManager.renderText(
            this.arrowFont,
            this.fillStyle,
            this.x,
            y,
            String.fromCharCode('8592')
        );

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.textX,
            y,
            'Move Tank Left'
        );

        y += this.verticalSpacing;

        this.graphicsManager.renderText(
            this.arrowFont,
            this.fillStyle,
            this.x,
            y,
            String.fromCharCode('8594')
        );

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.textX,
            y,
            'Move Tank Right'
        );

        y += this.verticalSpacing;

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.x,
            y,
            'Space Bar'
        );

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.textX,
            y,
            'Fire'
        );
    }
}