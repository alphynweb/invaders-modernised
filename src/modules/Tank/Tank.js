import { SCREEN, TANK } from '../../config';
import Ctx from '../Ctx/Ctx';
import Sprite from '../Sprite/Sprite';

export default class Tank {
    constructor() {
        this.config = TANK;
        this.screenConfig = SCREEN;
        this.ctx = Ctx();
        this.sprite = Sprite();
        this.animationFrame = 0;
        this.animationType = null;
        this.destroyAnimationFrames = 100; // TODO - move this to config
        this.shootAnimationFrames = 10; // TODO - move this to config
        this.speed = this.config.speed;
        this.width = this.config.width;
        this.height = this.config.height;
        this.x = this.config.x;
        this.y = this.config.y;
        this.spriteInfo = this.config.spriteInfo;
        this.xSpriteOffset = (this.width - this.spriteInfo.explosionWidth) / 2;
        this.ySpriteOffset = (this.height - this.spriteInfo.explosionHeight) / 2;
    }

    move(currentKeysPressed) {
        if (currentKeysPressed.indexOf('ArrowLeft') !== -1) {
            if (this.x > 0) {
                this.x -= this.speed;
            }
        }

        if (currentKeysPressed.indexOf('ArrowRight') !== -1) {
            if (this.x < this.screenConfig.width - this.width) {
                this.x += this.speed;
            }
        }
    }

    destroy() {
        this.animationFrame = 1;
        this.animationType = 'destroy';
    }

    reset() {
        this.x = this.config.x;
        this.animationFrame = 0;
        this.animationType = null;
    }

    render() {
        if (this.animationFrame === 0) {
            this.ctx.drawImage(
                this.sprite,
                this.spriteInfo.x,
                this.spriteInfo.y,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height

            );
        } else if (this.animationType) {
            switch (this.animationType) {

                case 'destroy':
                    this.ctx.drawImage(
                        this.sprite,
                        this.spriteInfo.explosionX,
                        this.spriteInfo.explosionY,
                        this.spriteInfo.explosionWidth,
                        this.spriteInfo.explosionHeight,
                        this.x + this.xSpriteOffset,
                        this.y + this.ySpriteOffset,
                        this.spriteInfo.explosionWidth,
                        this.spriteInfo.explosionHeight

                    );
                    this.animationFrame++;
                    if (this.animationFrame > this.destroyAnimationFrames) {
                        this.animationFrame = 0;
                        this.animationType = null;
                    }
                    break;
                case 'shoot':
                    this.ctx.drawImage(
                        this.sprite,
                        0,
                        this.height,
                        this.width,
                        this.height,
                        this.x,
                        this.y,
                        this.width,
                        this.height

                    );
                    this.animationFrame++;
                    if (this.animationFrame > this.shootAnimationFrames) {
                        this.animationFrame = 0;
                        this.animationType = null;
                    }
                    break;
                default:
                    break;
            }
        }
    }
}