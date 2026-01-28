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
        this.screenCenter = screen.width / 2;
        this.ctx = screen.ctx;
        this.font = this.textConfig.configs['gameText'].font;
        this.arrowFont = this.textConfig.configs['gameText'].arrowFont;
        this.fillStyle = this.textConfig.configs['gameText'].fillStyle;
        // this.x = 300;
        // this.textX = 600;
        this.lhVertical = this.screen.width / 2 - (this.screen.width / 4);
        this.rhVertical = this.screen.width / 2 + (this.screen.width / 4);
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
            const width = config.width;

            const type = this.invaderConfig.type;
            const configs = this.invaderConfig.configs;
            const x = this.lhVertical - (width / 2);
            const y = this.y;

            const invader = new Invader(
                type,
                subType,
                configs,
                x,
                y
            )

            this.graphicsManager.render(invader);

            this.graphicsManager.renderText(
                this.font,
                this.fillStyle,
                this.rhVertical,
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
            const width = config.width;
            const type = this.mothershipConfig.type;
            const configs = this.mothershipConfig.configs;
            const x = this.lhVertical - (width / 2);
            const y = this.y;

            const mothership = new Mothership(
                type,
                subType,
                configs,
                x,
                y
            )

            this.graphicsManager.render(mothership);

            this.graphicsManager.renderText(
                this.font,
                this.fillStyle,
                this.rhVertical,
                this.y + (mothership.height / 2),
                "Score ???"
            )

            index++;
            this.y += this.verticalSpacing;
        }
    }

    renderStartButton = () => {
        const subType = 'startButton';
        const animationType = 'normal';
        const startButtonConfigs = this.buttonConfig.configs[subType].spriteInfo[animationType];
        const width = startButtonConfigs.width;
        const height = startButtonConfigs.height;
        const x = this.screenCenter - (width / 2);
        const y = 400;

        const startButton = new Button(
            this.buttonConfig.type,
            subType,
            this.buttonConfig.configs,
            x,
            y
        );

        this.graphicsManager.render(startButton);

        const clickListen = (event) => {
            const rect = this.screen.screen.getBoundingClientRect();
            const xClicked = event.clientX - rect.left;
            const yClicked = event.clientY - rect.top;

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
            this.lhVertical,
            y,
            String.fromCharCode('8592')
        );

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.rhVertical,
            y,
            'Move Tank Left'
        );

        y += this.verticalSpacing;

        this.graphicsManager.renderText(
            this.arrowFont,
            this.fillStyle,
            this.lhVertical,
            y,
            String.fromCharCode('8594')
        );

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.rhVertical,
            y,
            'Move Tank Right'
        );

        y += this.verticalSpacing;

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.lhVertical,
            y,
            'Space Bar'
        );

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.rhVertical,
            y,
            'Fire'
        );
    }
}