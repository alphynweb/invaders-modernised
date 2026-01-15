// Config
import {
    CITY,
    TEXT,
    INVADER,
    INVADERS,
    LIVES,
    MOTHERSHIP,
    SCREEN,
    TANK,
    BULLET,
    BUTTON
} from './config';

//Utils
import collisionDetector from './utils/CollisionDetector';
import inputHandler from './utils/inputHandler';

// Modules
import Screen from './modules/Screen/Screen';
import Tank from './modules/Tank/Tank';
// import Invader from './modules/Invader/Invader';
import Invaders from './modules/invaders/Invaders';
import Bullets from './modules/Bullets/Bullets';
import Cities from './modules/Cities/Cities';
import Mothership from './modules/Mothership/Mothership';
import Score from './modules/Score/Score';
import Lives from './modules/Lives/Lives';
import GameLoop from './GameLoop';
import GameStates from './controllers/GameStates';

import IntroScreen from './states/IntroScreen';
import GameOver from './states/GameOver';
import FinishLevel from './states/FinishLevel';
import CollisionSystem from './systems/CollisionSystem';
import SoundManager from './systems/SoundManager';
import GraphicsManager from './systems/GraphicsManager';

export default class Game {
    constructor() {
        this.cityConfig = CITY;
        this.textConfig = TEXT;
        this.invaderConfig = INVADER;
        this.invadersConfig = INVADERS;
        this.bulletConfig = BULLET;
        this.mothershipConfig = MOTHERSHIP;
        this.tankConfig = TANK;
        this.buttonConfig = BUTTON;
        this.livesConfig = LIVES;
        this.screenConfig = SCREEN;


        this.livesLeft = this.livesConfig.lives;

        this.screen = Screen();
        this.screen.render();


        // this.score = 0;
        this.lives = null;
        this.tank = null;
        this.invaders = null;
        this.bullets = null;
        this.cities = null;
        this.mothership = null;
        this.mothershipOldTime = 0;
        this.mothershipNewTime = null;
        this.collisionInfo = null;
        this.now = null;
        this.invaderMoveTime = this.invadersConfig.configs['wave1'].moveTime;
        this.isTankBullet = false;
        this.invaderGroupY = null;
        this.currentLevel = 1;
        this.collisionDetector = collisionDetector;

        this.screenCanvas = document.getElementById('screenCanvas');

        this.gameLoop = new GameLoop(this.onTick);

        this.gameStates = new GameStates(
            this.onIntro,
            this.onStartGame,
            this.onRunGame,
            this.onFinishLevel,
            this.onLoseLife,
            this.onEndGame
        );

        this.gameOver = new GameOver(
            this.gameTextConfig,
            this.screen
        );


        this.volumeControlContainer = document.getElementById('volume');
        this.volumeControl = document.getElementById('volumeControl');

        this.init();
    }

    init = async () => {
        await this.setupGraphics('/graphics/graphicsSprite.png');
        await this.graphicsManager.init();

        await this.setupAudio('/audio/audioSprite.mp3');
        await this.soundManager.init();

        this.soundManager.mute();

        this.invaderGroupY = this.invadersConfig.configs['wave1'].y;
        this.livesLeft = this.livesConfig.lives;

        this.score = new Score();
        this.lives = new Lives(this.livesConfig.configs);

        this.tank = new Tank(
            this.tankConfig.type,
            'main',
            this.tankConfig.configs,
            this.tankConfig.configs['main'].x,
            this.tankConfig.configs['main'].y,
            this.screen
        );

        this.invaders = new Invaders(
            this.invaderGroupY,
            this.invadersConfig,
            this.invaderConfig

        );

        this.bullets = new Bullets();

        this.cities = new Cities(
            [
                this.screenConfig,
                this.cityConfig,
                this.invaderConfig,
                this.tankConfig,
                this.bulletConfig
            ]
        );

        this.mothership = new Mothership(
            this.mothershipConfig.type,
            'main',
            this.mothershipConfig.configs,
            this.mothershipConfig.configs['main'].x,
            this.mothershipConfig.configs['main'].y
        );

        inputHandler.init();

        this.now = 0;
        this.invaderMoveTime = this.invadersConfig.configs['wave1'].moveTime - this.invadersConfig.configs['wave1'].speedIncrease;

        this.invaders.build(this.invaderGroupY);

        // this.mothershipNewTime = Math.floor((Math.random() * 30000) + 10000); // TODO - Move to Mothership Class
        this.mothershipNewTime = 0;

        this.collisionSystem = new CollisionSystem(
            this.collisionDetector,
            this.tankConfig,
            this.invaderConfig,
            this.cityConfig,
            this.tank,
            this.invaders,
            this.mothership,
            this.bullets,
            this.cities
        );

        this.introScreen = new IntroScreen(
            this.graphicsManager,
            this.screen,
            this.onStartGame,
            this.textConfig,
            this.mothershipConfig,
            this.invaderConfig,
            this.buttonConfig
        );

        this.gameStates.currentState = this.gameStates.intro;
        this.gameStates.currentState();
    }

    setupGraphics = async (graphicsSpriteUrl) => {
        const ctx = document.getElementById('screenCanvas').getContext('2d');

        const entityMap = new Map([
            ['tank', this.tankConfig],
            ['invader', this.invaderConfig],
            ['mothership', this.mothershipConfig],
            ['bullet', this.bulletConfig],
            ['button', this.buttonConfig]
        ]);

        this.graphicsManager = new GraphicsManager(
            graphicsSpriteUrl,
            entityMap,
            ctx
        );
    }

    setupAudio = async (audioSpriteUrl) => {
        const soundsMap = new Map([
            ['invaderExplosion', { start: 1.305, stop: 1.680 }],
            ['tankExplosion', { start: 7.05, stop: 7.95 }],
            ['tankBulletFired', { start: 0.008, stop: 0.307 }],
            ['invadersMoved', { start: 2.676, stop: 2.768 }],
            ['mothershipExplosion', { start: 7.05, stop: 7.95 }]
        ]);

        this.soundManager = new SoundManager(
            audioSpriteUrl,
            soundsMap
        );
    }

    update = (currentTime) => {
        this.purge();
        this.checkCollisions();
        this.bullets.move();
        this.moveInvaders(currentTime);
        this.moveMothership(currentTime);

        if (inputHandler.isKeyPressed('Space')) {
            this.onTankBulletFired();
        }
        if (inputHandler.isKeyPressed('ArrowRight')) {
            this.tank.move('right');
        }
        if (inputHandler.isKeyPressed('ArrowLeft')) {
            this.tank.move('left');
        }

        const delta = this.gameLoop.delta;
        this.invaders.update(delta);
        this.mothership.update(delta);
    }

    checkCollisions = () => {
        this.collisionSystem.checkCollisions();
        const collisions = this.collisionSystem.collisions;

        const collisionHandlers = {
            "Tank vs Invader": (collision) => {
                const invader = collision.target;
                this.score.increase(collision.target.score);
                this.invaderMoveTime -= this.invadersConfig.configs['wave1'].speedIncrease;
                this.bullets.removeBullet(collision.bulletIndex);
                this.soundManager.play('invaderExplosion');
                invader.destroy();
            },
            "Tank vs City": (collision) => {
                collision.target.damage(collision.bullet);
                this.bullets.removeBullet(collision.bulletIndex);
            },
            "Tank vs Mothership": (collision) => {
                this.mothership.destroy();
                this.resetMothershipTime();
                this.bullets.removeBullet(collision.bulletIndex);
                this.score.increase(collision.target.score);
                this.soundManager.play('mothershipExplosion');
            },
            "Invader vs Tank": (collision) => {
                inputHandler.currentKeysPressed = [];
                this.bullets.removeBullet(collision.bulletIndex);
                this.tank.destroy();
                this.lives.loseLife();
                if (this.lives.currentLives === 0) {
                    this.gameStates.currentState = this.gameStates.over;
                    return;
                }
                this.soundManager.play('tankExplosion');
                this.gameStates.currentState = this.gameStates.lose;
            },
            "Invader vs City": (collision) => {
                const city = collision.target;
                city.damage(collision.bullet);
                this.bullets.removeBullet(collision.bulletIndex);
            },
            "Mothership vs Tank": (collision) => {
                inputHandler.currentKeysPressed = [];
                this.bullets.removeBullet(collision.bulletIndex);
                this.tank.destroy();
                this.lives.lose();
                if (this.lives.currentLives === 0) {
                    this.gameStates.currentState = this.gameStates.over;
                    return;
                }
                this.soundManager.play('tankExplosion');
                this.gameStates.currentState = this.gameStates.lose;
            },
            "Mothership vs City": (collision) => {

            }
        }

        if (collisions.length) {
            collisions.forEach((collision) => {
                const handlerType = collisionHandlers[collision.type];
                if (handlerType) {
                    handlerType(collision);
                }
            });
        }
    }

    render = () => {
        this.screen.clear();
        this.graphicsManager.render(this.tank);
        this.invaders.invaderList.forEach((invader) => {
            this.graphicsManager.render(invader);
        });
        this.graphicsManager.render(this.mothership);

        if (this.mothership.animationType === 'exploding') {
            const textX = this.mothership.x + (this.mothership.width / 2);
            const textY = this.mothership.y + (this.mothership.height / 2);

            this.graphicsManager.renderText(
                this.textConfig.configs['gameText'].font,
                this.textConfig.configs['gameText'].fillStyle,
                textX,
                textY,
                this.mothership.score
            );
        }

        this.bullets.bulletList.forEach((bullet) => {
            this.graphicsManager.render(bullet);
        });


        const scoreTextConfig = this.textConfig.configs['score'];
        this.graphicsManager.renderText(
            scoreTextConfig.font,
            scoreTextConfig.fillStyle,
            scoreTextConfig.x,
            scoreTextConfig.y,
            'Score: ' + this.score.currentScore
        );

        this.renderLives();
    }

    renderLives = () => {
        const config = this.livesConfig.configs['main'];
        let x = config.x;
        const y = config.y;
        const livesGap = config.livesGap;
        const livesLeft = this.lives.livesLeft;
        const spriteInfo = config.spriteInfo['normal'];
        const width = spriteInfo.width;

        for (let i = 0; i < livesLeft; i++) {
            this.graphicsManager.renderSprite(
                spriteInfo,
                x,
                y
            )
            x += livesGap + width;
        }
    }

    purge = () => {
        this.invaders.purge(); // Get rid of any invaders that are destroyed.
        this.mothership.purge(); // Get rid of mothership if destroyed

        if (this.invaders.invaderList.length < 1) {
            this.gameStates.currentState = this.gameStates.finish;
        }
    }

    onTick = (currentTime) => {
        this.gameStates.currentState(currentTime);
    }

    onIntro = () => {
        this.introScreen.render();
        this.startButton = document.getElementById('startButton');
    }

    onStartGame = async () => {
        this.volumeControlContainer.style.visibility = "visible";
        this.volumeControl.oninput = () => {
            this.soundManager.onSetVolume(this.volumeControl.value);
        }

        this.cities.build();
        this.cities.render();

        this.gameStates.currentState = this.gameStates.run;
        this.gameLoop.start();
    }

    onRunGame = (currentTime) => {
        this.update(currentTime);
        this.render();
    }

    onFinishLevel = () => {
        const finishLevel = new FinishLevel(
            this.invaderConfig,
            this.invadersConfig,
            this.invaders,
            this.cities,
            this.tank
        );

        finishLevel.reset(this.currentLevel);
        finishLevel.render();

        this.currentLevel++;
        this.gameStates.currentState = this.gameStates.run;
    }

    onLoseLife = () => {
        // Check to see if tank destroy animation has finished
        if (!this.tank.animationType) {
            this.gameStates.currentState = this.gameStates.run;
            this.tank.reset();
        }
        this.graphicsManager.render(this.tank);
    }

    onEndGame = () => {
        this.gameLoop.stop();
        this.gameOver.endGame(this.cities);
        this.gameOver.render(this.score, this.startButton);
    }

    createInvaderBullets = () => {
        // Check how many invader bullets are currently in play
        let invaderBullets = this.bullets.bulletList.filter((bullet) => bullet.subType.slice(0, 7) === 'invader');

        let invaderIndex;
        let invader;
        let bottomInvIndex;
        let bottomInv;

        // If it's less than 2(? Arbitrary) for example, then create more randomly so there are always 2
        let noBulletsToCreate = 0 - invaderBullets.length;

        for (let i = 0; i < noBulletsToCreate; i++) {
            // Choose random invader - the bottom one of whatever column
            invaderIndex = Math.floor((Math.random() * this.invaders.invaderList.length));

            invader = this.invaders.invaderList[invaderIndex];

            this.invaders.invaderList.forEach((inv, index) => {
                if (inv.x === invader.x) {
                    bottomInvIndex = index;
                }
            });

            bottomInv = this.invaders.invaderList[bottomInvIndex];

            const subType = bottomInv.subType;

            if (!bottomInv.isAnimating) {
                this.bullets.addBullet(
                    'bullet',
                    subType,
                    this.bulletConfig.configs,
                    bottomInv.x + (bottomInv.width / 2),
                    bottomInv.y + bottomInv.height
                );
            }
        }
    }

    createMothershipBullets = () => {
        // Create mothership bomb (Fired when mothership is above tank)
        const mothershipCenter = this.mothership.x + (this.mothership.width / 2);
        const tankCenter = this.tank.x + (this.tank.width / 2);

        if (mothershipCenter === tankCenter || (mothershipCenter < tankCenter + 4 && mothershipCenter > tankCenter - 4)) {
            // Create mothership bomb in bullets list if there isn't already one
            const mothershipBullets = this.bullets.bulletList.filter((bullet) => bullet.subType === 'mothership');

            if (mothershipBullets.length === 0) {
                this.bullets.addBullet(
                    'bullet',
                    'mothership',
                    this.bulletConfig.configs,
                    mothershipCenter,
                    this.mothership.y + this.mothership.height
                );
            }
        }
    }

    onTankBulletFired() {
        const isTankBullet = this.bullets.bulletList.find((bullet) => {
            return bullet.subType === 'tank';
        });
        if (!isTankBullet) { // If no tank bullet currently in play
            const type = 'bullet';
            const subType = 'tank';
            const x = this.tank.x + (this.tankConfig.configs['main'].width / 2) - (this.bulletConfig.configs[subType].width / 2);
            const y = this.tank.y - this.bulletConfig.configs[subType].height;
            this.bullets.addBullet(
                type,
                subType,
                this.bulletConfig.configs,
                x,
                y
            );
            this.tank.animationType = 'shooting';
            this.soundManager.play('tankBulletFired');
        }
    }

    moveMothership = (currentTime) => {
        if (this.mothership.isActive && !this.mothership.animationType !== 'exploding') {
            this.createMothershipBullets();
            this.mothership.move();
            if (this.mothership.x > this.screenConfig.configs['main'].width) {
                this.mothership.remove();
                this.resetMothershipTime();
            }
        } else {
            if (currentTime > this.mothershipOldTime + this.mothershipNewTime) {
                this.mothershipOldTime = currentTime;
                this.mothership.reset();
                this.resetMothershipTime();
            }
        }
    }

    moveInvaders = (currentTime) => {
        if (currentTime > this.now + this.invaderMoveTime) {
            // Only move invaders etc if none of them are currently being destroyed
            let areInvadersExploding = this.invaders.invaderList.filter((invader) => {
                return invader.isExploding;
            });
            if (!areInvadersExploding.length) {
                this.invaders.move();
                this.createInvaderBullets();
                this.soundManager.play("invadersMoved");
            }
            this.now = currentTime;

            // Check for invaders reaching bottom of screen
            this.invaders.invaderList.forEach((invader) => {
                if (invader.y + invader.height > TANK.y) {
                    this.gameStates.currentState = this.gameStates.over;
                }
            });
        }
    }

    resetMothershipTime = () => {
        // this.mothershipNewTime = Math.floor((Math.random() * 30000) + 10000);
        this.mothershipNewTime = 0;
    }
}