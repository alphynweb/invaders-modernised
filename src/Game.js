// Config
import { CITY, GAME_TEXT, INVADER, INVADERS, LIVES, MOTHERSHIP, SCREEN, TANK } from './config';

// Assets
import gameSprite from './assets/images/sprite-2.png';
import gameSounds from './assets/audio/gamesounds.mp3';

//Utils
import collisionDetector from './utils/CollisionDetector';
import inputHandler from './utils/inputHandler';

// Modules
import Screen from './modules/Screen/Screen';
import Tank from './modules/Tank/Tank';
import Invader from './modules/Invader/Invader';
import Invaders from './modules/invaders/Invaders';
import Bullets from './modules/Bullets/Bullets';
import Cities from './modules/Cities/Cities';
import Mothership from './modules/Mothership/Mothership';
import Score from './modules/Score/Score';
import Lives from './modules/Lives/Lives';
import Button from './modules/Button/Button';
import GameLoop from './GameLoop';
import GameStates from './controllers/GameStates';
import button from './modules/Button/Button';

import IntroScreen from './states/IntroScreen';
import GameOver from './states/GameOver';
import FinishLevel from './states/FinishLevel';
import CollisionSystem from './systems/CollisionSystem';

export default class Game {
    constructor() {
        this.cityConfig = CITY;
        this.gameTextConfig = GAME_TEXT;
        this.invaderConfig = INVADER;
        this.invadersConfig = INVADERS;
        this.livesConfig = LIVES;
        this.mothershipConfig = MOTHERSHIP;
        this.screenConfig = SCREEN;
        this.tankConfig = TANK;

        this.livesLeft = this.livesConfig.lives;

        this.screen = Screen();
        this.screen.render();


        this.score = 0;
        this.lives = null;
        this.tank = null;
        this.invaders = null;
        this.bullets = null;
        this.bulletType = null;
        this.bulletSubType = null;
        this.bulletX = null;
        this.bulletY = null;
        this.cities = null;
        this.mothership = null;
        this.mothershipOldTime = 0;
        this.mothershipNewTime = null;
        this.collisionInfo = null;
        this.now = null;
        this.invaderMoveTime = this.invadersConfig.moveTime;
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

        this.introScreen = new IntroScreen(
            this.gameTextConfig,
            this.invaderConfig,
            this.screen,
            this.onStartGame
        );

        this.gameOver = new GameOver(
            this.gameTextConfig,
            this.screen
        );

        const img = new Image();
        img.onload = () => {
            console.log("Images loaded");
            const sounds = new Audio(gameSounds);
            sounds.preload = true;
            sounds.oncanplaythrough = () => {
                console.log("Sounds loaded");
                // setup();
                // const game = new Game();

                this.gameStates.currentState = this.gameStates.intro;
                this.gameStates.currentState();
            };
        };
        img.src = gameSprite;
    }

    init = () => {
        this.invaderGroupY = this.invadersConfig.y;
        this.livesLeft = this.livesConfig.lives;

        this.score = Score();
        this.lives = Lives();

        this.tank = new Tank();
        this.invaders = new Invaders(this.invaderGroupY);
        this.bullets = new Bullets();
        this.cities = new Cities();
        this.mothership = new Mothership();

        inputHandler.init();

        this.now = 0;
        this.invaderMoveTime = this.invadersConfig.moveTime - this.invadersConfig.speedIncrease;

        this.invaders.build(this.invaderGroupY);
        this.cities.build();
        this.cities.render();

        // resetMothershipTime();
        this.mothershipNewTime = Math.floor((Math.random() * 30000) + 10000); // TODO - Move to Mothership Class

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
    }

    update = (currentTime) => {
        this.purge();

        if (inputHandler.isKeyPressed('Space')) {
            this.onTankBulletFired();
        }

        this.checkCollisions();

        this.tank.move(inputHandler.currentKeysPressed);
        this.bullets.move();
        this.moveInvaders(currentTime);
        this.moveMothership(currentTime);
    }

    checkCollisions = () => {
        this.collisionSystem.checkCollisions();
        const collisions = this.collisionSystem.collisions;

        const collisionHandlers = {
            "Tank vs Invader": (collision) => {
                this.score.increase(collision.target.score);
                collision.target.destroy();
                this.invaderMoveTime -= this.invadersConfig.speedIncrease;
                this.bullets.removeBullet(collision.bulletIndex);
            },
            "Tank vs City": (collision) => {
                collision.target.damage(collision.bullet);
                this.bullets.removeBullet(collision.bulletIndex);
            },
            "Tank vs Mothership": (collision) => {
                this.mothership.destroy();
                this.resetMothershipTime();
                this.bullets.removeBullet(collision.bulletIndex);
                this.score.increase(500);
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
                this.lives.loseLife();
                if (this.lives.currentLives === 0) {
                    this.gameStates.currentState = this.gameStates.over;
                    return;
                }
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
        // console.log("Running render from Game.js");

        this.screen.clear();
        this.tank.render();
        this.invaders.render();
        this.bullets.render();
        this.mothership.render();
        this.score.render();
        this.lives.render();
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

    onStartGame = () => {
        this.init();
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
        this.tank.render();
    }

    onEndGame = () => {
        this.gameLoop.stop();
        this.gameOver.endGame(this.cities);
        this.gameOver.render(this.score, this.startButton);
    }


    createInvaderBullets = () => {
        // Check how many invader bullets are currently in play
        let invaderBullets = this.bullets.bulletList.filter((bullet) => bullet.type === 'invader');

        let invaderIndex;
        let invader;
        let bottomInvIndex;
        let bottomInv;
        let newInvaderBullet;
        // If it's less than 2(? Arbitrary) for example, then create more randomly so there are always 2
        let noBulletsToCreate = 2 - invaderBullets.length;

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

            // Create new bullet
            if (!bottomInv.isAnimating) {
                this.bullets.addBullet('invader', bottomInv.type, bottomInv.x + (bottomInv.width / 2), bottomInv.y + bottomInv.height);
            }
        }
    }

    createMothershipBullets = () => {
        // Create mothership bomb (Fired when mothership is above tank)
        const mothershipCenter = this.mothership.x + (this.mothership.width / 2);
        const tankCenter = this.tank.x + (this.tank.width / 2);

        if (mothershipCenter === tankCenter || (mothershipCenter < tankCenter + 4 && mothershipCenter > tankCenter - 4)) {
            // Create mothership bomb in bullets list if there isn't already one
            const mothershipBullets = this.bullets.bulletList.filter((bullet) => bullet.type === 'mothership');

            if (mothershipBullets.length === 0) {
                this.bullets.addBullet('mothership', null, mothershipCenter, this.mothership.y + this.mothership.height);
            }

            const t = 0;
        }
    }

    onTankBulletFired() {
        this.isTankBullet = this.bullets.bulletList.find((bullet) => {
            return bullet.type === 'tank';
        });
        if (!this.isTankBullet) {
            this.bulletType = "tank";
            this.bulletSubType = null;
            this.bulletX = this.tank.x + (TANK.width / 2) - (TANK.bulletInfo.width / 2);
            this.bulletY = this.tank.y - TANK.bulletInfo.height;
            this.bullets.addBullet(
                this.bulletType,
                this.bulletSubType,
                this.bulletX,
                this.bulletY
            )
            this.tank.animationType = 'shoot';
            this.tank.animationFrame = 1;
        }
    }


    moveMothership = (currentTime) => {
        if (this.mothership.isActive && !this.mothership.isExploding) {
            this.createMothershipBullets();
            this.mothership.move();
            if (this.mothership.x > this.screenConfig.width) {
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
        this.mothershipNewTime = Math.floor((Math.random() * 30000) + 10000);
    }
}