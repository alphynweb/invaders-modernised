import Ctx from '../Ctx/Ctx';
import Sprite from '../Sprite/Sprite';
import Sounds from '../Sounds/Sounds';
import { MOTHERSHIP } from '../../config';

export default class Mothership {
    constructor() {
        this.config = MOTHERSHIP;
        this.ctx = Ctx();
        this.sprite = Sprite();
        this.currentAnimationFrame = 0; // Current animation frame from animationframes array
        this.animationFrameNo = 0; // Current frame count
        this.isActive = false;
        this.score = Math.ceil(Math.random() * 10) * 100;
        this.width = this.config.width;
        this.height = this.config.height;
        this.speed = this.config.speed;
        this.x = -this.width;
        this.y = this.config.y;
        this.animationFrames = this.config.animationFrames;
        this.spriteX = this.config.spriteX;
        this.spriteY = this.config.spriteY;
        this.isExploding = false;
        this.noExplodingFrames = this.config.noExplodingFrames;
        this.spriteExplosionX = this.config.spriteExplosionX;
        this.spriteExplosionY = this.config.spriteExplosionY;
        this.spriteExplosionWidth = this.config.spriteExplosionWidth;
        this.spriteExplosionHeight = this.config.spriteExplosionHeight;
    }

    move() {
        this.x += this.speed;
    }

    reset() {
        this.x = -this.width;
        this.isActive = true;
        this.score = Math.ceil(Math.random() * 10) * 100;
    }

    remove() {
        this.isActive = false;
    }

    destroy() {
        // destroySound.play();
        // Set isAnimating frame to start animation
        this.isExploding = 0;
    }

    purge() {
        if (!this.isActive) {
            this.remove();
        }
    }

    render() {
            // Centralise explosion sprite
            const xSpriteOffset = (this.width - this.spriteExplosionWidth) / 2;
            const ySpriteOffset = (this.height - this.spriteExplosionHeight) / 2;

            // Centralise explosion score text 
            const scoreText = this.score;
            const scoreTextWidth = this.ctx.measureText(scoreText).width;
            const scoreXOffset = (this.width - scoreTextWidth) / 2;
            const scoreYOffset = 20;

            if (this.isActive) {
                if (this.isExploding === false) {
                    this.animationFrameNo++;

                    if (this.animationFrameNo > this.animationFrames[this.currentAnimationFrame]) {
                        this.animationFrameNo = 0;
                        this.currentAnimationFrame++;
                        if (this.currentAnimationFrame > this.animationFrames.length - 1) {
                            this.currentAnimationFrame = 0;
                        }
                    }

                    this.ctx.drawImage(this.sprite, this.spriteX, this.spriteY + (this.height * this.currentAnimationFrame), this.width, this.height, this.x, this.y, this.width, this.height);
                } else {
                    // Explosion
                    this.ctx.drawImage(this.sprite, this.spriteExplosionX, this.spriteExplosionY, this.spriteExplosionWidth, this.spriteExplosionHeight, this.x + xSpriteOffset, this.y + ySpriteOffset, this.spriteExplosionWidth, this.spriteExplosionHeight);
                    // Score
                    
                    this.ctx.fillText(this.score, this.x + scoreXOffset, this.y + scoreYOffset);
                    this.isExploding++;
                    if (this.isExploding > this.noExplodingFrames) {
                        this.isExploding = false;
                        this.isActive = false;
                    }
                }
            }
        }
}