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
    }

    update = (currentTime) => {
        this.purge();

        if (inputHandler.isKeyPressed('Space')) {
            this.onTankBulletFired();
        }

        this.handleTankBulletCollisions();
        this.handleInvaderBulletCollisions();
        this.handleMothershipBulletCollisions();

        this.tank.move(inputHandler.currentKeysPressed);
        this.bullets.move();
        this.moveInvaders(currentTime);
        this.moveMothership(currentTime);
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

    handleTankBulletCollisions = () => {
        // Establish whether tank bullet is currently in play
        let tankBulletIndex;
        let collisionInfo;
        let invaderHit;

        if (this.bullets.bulletList.length) {
            tankBulletIndex = this.bullets.bulletList.findIndex((bullet) => {
                return bullet.type === 'tank';
            });
        }

        // Collision detection for tank bullet
        if (tankBulletIndex > -1) {
            // Set collisionDetector obj1 to tank bullet
            const tankBullet = this.bullets.bulletList[tankBulletIndex];

            this.invaders.invaderList.forEach((invader) => {
                collisionInfo = collisionDetector.collisionInfo(tankBullet, invader);

                if (collisionInfo.didCollide) {
                    if (!invader.isExploding) {
                        this.score.increase(invader.score);
                        invader.destroy();
                        this.invaderMoveTime -= this.invadersConfig.speedIncrease;
                        this.bullets.removeBullet(tankBulletIndex);
                    }
                }
            });

            // Tank bulllet vs cities
            for (let i = 0; i < CITY.no; i++) {
                const cityHit = this.cities.cityList[i];
                // collisionDetector.obj2 = cityHit;
                collisionInfo = collisionDetector.collisionInfo(tankBullet, cityHit);

                if (collisionInfo.didCollide) {
                    // Check the area directly above the bullet to see whether it's solid

                    // If bullet y is lower than city y (To stop checking element outside the bounds of the city = error)
                    let damageCity = false;
                    // Area to check imagedata of
                    const topLeftX = tankBullet.x - cityHit.x; // Bullet x
                    const topLeftY = tankBullet.y - cityHit.y - 1; // 1 px above bullet y
                    const width = TANK.bulletInfo.width;
                    const height = 1;
                    const imgData = cityHit.ctx.getImageData(topLeftX, topLeftY, width, height);

                    for (let i = 0; i < imgData.data.length; i += 4) {
                        if (imgData.data[i + 3] === 255) {
                            damageCity = true;
                        }
                    }

                    if (damageCity === true) { // If pixel alpha is 255
                        cityHit.damage(tankBullet);
                        this.bullets.removeBullet(tankBulletIndex);
                    }
                }
            }

            // Tank bullet vs mothership
            if (this.mothership.isActive) {
                // collisionDetector.obj2 = mothership;
                collisionInfo = collisionDetector.collisionInfo(tankBullet, this.mothership);

                if (collisionInfo.didCollide) {
                    this.mothership.destroy();
                    this.resetMothershipTime();
                    this.bullets.removeBullet(tankBulletIndex);
                    this.score.increase(500);
                }
            }
        }
    }

    handleInvaderBulletCollisions = () => {
        // Collision detector for invader bullets
        if (this.bullets.bulletList.length) {
            let invaderType;
            let bulletInfo;
            let cityHit; // City that is hit
            // Area to check imagedata of    
            let topLeftX;
            let topLeftY;
            let width;
            let height;
            let imgData;
            let damageCity = false;

            // Run through any invaders bullets in bulletsList
            this.bullets.bulletList.forEach((bullet, index) => {
                if (bullet.type === 'invader') {
                    invaderType = INVADER.find((inv) => inv.type === bullet.subType);
                    bulletInfo = invaderType.bulletInfo;
                    this.collisionInfo = collisionDetector.collisionInfo(bullet, this.tank);

                    if (this.collisionInfo.didCollide && !this.tank.isAnimating) {
                        // The invaders pause and the tank appears on the left hand side of the screen again
                        // All the invader bullets are deleted
                        // The game pauses while the tank destroy animate happens
                        this.gameStates.currentState = this.gameStates.lose;

                        inputHandler.currentKeysPressed = []; // Clear out the input handler info
                        this.bullets.removeBullet(index);
                        this.tank.destroy();
                        this.lives.loseLife();
                        if (this.lives.currentLives === 0) {
                            this.gameStates.currentState = this.gameStates.over;
                            return;
                        }
                    }
                    // Invader bullet vs cities

                    this.cities.cityList.forEach((city) => {
                        damageCity = false;
                        this.collisionInfo = collisionDetector.collisionInfo(bullet, city);
                        if (this.collisionInfo.didCollide) {

                            // Check the area directly above the bullet to see whether it's solid
                            // Area to check imagedata of
                            topLeftX = bullet.x - city.x; // Bullet x
                            topLeftY = bullet.y - city.y + bulletInfo.height; // 1 px below bullet y
                            width = bulletInfo.width;
                            height = 1;
                            imgData = city.ctx.getImageData(topLeftX, topLeftY, width, height);

                            for (let i = 0; i < imgData.data.length; i += 4) {
                                if (imgData.data[i + 3] === 255) {
                                    damageCity = true;
                                }
                            }

                            if (damageCity) { // If pixel alpha is 255
                                city.damage(bullet);
                                this.bullets.removeBullet(index);
                            }
                        }
                    });
                }
            });
        }
    }

    handleMothershipBulletCollisions = () => {
        this.bullets.bulletList.forEach((bullet, index) => {
            if (bullet.type === 'mothership') {
                this.collisionInfo = collisionDetector.collisionInfo(bullet, this.tank);

                if (this.collisionInfo.didCollide && !this.tank.isAnimating) {
                    // The invaders pause and the tank appears on the left hand side of the screen again
                    // All the invader bullets are deleted
                    // The game pauses while the tank destroy animate happens
                    this.gameStates.currentState = this.gameStates.lose;

                    inputHandler.currentKeysPressed = []; // Clear out the input handler info
                    this.bullets.removeBullet(index);
                    this.tank.destroy();
                    this.lives.loseLife();
                    if (this.lives.currentLives === 0) {
                        this.gameStates.currentState = this.gameStates.over;
                        return;
                    }
                }
            }
        });
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