import { INVADERS, INVADER } from '../../config';
import Ctx from '../Ctx/Ctx';
import Sprite from '../Sprite/Sprite';
import Sounds from '../Sounds/Sounds';

export default class Invader {
    constructor(type, x, y) {
        this.config = INVADER.find((inv) => inv.type === type);
        this.type = type;
        this.destroySound = Sounds();
        this.destroySound.startTime = 1.305; // Move this to config file
        this.destroySound.stopTime = 1.680; // M<ove this to config file
        this.x = x;
        this.y = y;
        this.ctx = Ctx(); // Convert Ctx to class (?)
        this.sprite = Sprite(); // Convert Sprite to class
        this.isActive = true; // Determines whether invader is active in game (switch to false when animating explosion etc)
        this.isExploding = false;
        this.sound = null;
        this.direction = 'right';
        this.xOffset = (INVADERS.columnWidth - this.width) / 2;
        this.yOffset = (INVADERS.rowHeight - this.height) / 2;
        this.animationFrame = 0;
        this.noAnimationFrames = this.config.noAnimationFrames;
        this.spriteX = this.config.spriteX;
        this.spriteY = this.config.spriteY;
        this.width = this.config.width;
        this.height = this.config.height;
        this.spriteExplosionX = this.config.spriteExplosionX;
        this.spriteExplosionY = this.config.spriteExplosionY;
        this.spriteExplosionWidth = this.config.spriteExplosionWidth;
        this.spriteExplosionHeight = this.config.spriteExplosionHeight;
        this.explosionFrames = this.config.explosionFrames;
        this.xSpriteOffset = (INVADERS.columnWidth - this.spriteExplosionWidth) / 2;
        this.ySpriteOffset = (INVADERS.rowHeight - this.spriteExplosionHeight) / 2;
        this.score = this.config.score;
    }

    move(direction) {
        if (direction !== 'down') {
            this.x += direction === 'right' ? INVADERS.moveSpeed : -INVADERS.moveSpeed;
        } else {
            this.y += INVADERS.shiftDownSpeed;
        }

        this.animationFrame++;

        if (this.animationFrame === this.noAnimationFrames) {
            this.animationFrame = 0;
        }
    }

    destroy() {
        this.isExploding = 0; // Set explodng animation frame to 0 instead of false
        // this.destroySound.play();
    }

    render() {
        // Work out offest of sprite to centralise
        this.xOffset = (INVADERS.columnWidth - this.width) / 2;
        this.yOffset = (INVADERS.rowHeight - this.height) / 2;
        this.xSpriteOffset = (INVADERS.columnWidth - this.spriteExplosionWidth) / 2;
        this.ySpriteOffset = (INVADERS.rowHeight - this.spriteExplosionHeight) / 2;

        if (this.isExploding === false) {
            // Work out which position on sprite to show according to animation frame
            this.ctx.drawImage(
                this.sprite,
                this.spriteX,
                this.spriteY + (this.height * this.animationFrame),
                this.width,
                this.height,
                this.x + this.xOffset,
                this.y + this.yOffset,
                this.width,
                this.height
            );
        } else {
            // Render explosion
            this.ctx.drawImage(
                this.sprite,
                this.spriteExplosionX,
                this.spriteExplosionY,
                this.spriteExplosionWidth,
                this.spriteExplosionHeight,
                this.x + this.xSpriteOffset,
                this.y + this.ySpriteOffset,
                this.spriteExplosionWidth,
                this.spriteExplosionHeight
            );
            this.isExploding++;
            if (this.isExploding > this.explosionFrames) {
                this.isExploding = false;
                this.isActive = false;
            }
        }
    }
}