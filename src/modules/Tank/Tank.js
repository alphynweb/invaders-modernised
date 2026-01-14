import { SCREEN } from '../../config';

export default class Tank {
    constructor(type, subType, configs, x, y, screen) {
        const config = configs[subType];
        this.animationType = 'normal';
        this.type = type;
        this.subType = subType;
        this.width = config.width;
        this.height = config.height;
        this.x = x;
        this.y = y;
        this.isActive = true;
        this.speed = config.speed;
        this.spriteInfo = config.spriteInfo;
        this.screenConfig = SCREEN;
    }

    move(direction) {
        if (direction === 'left') this.x -= this.speed;
        if (direction === 'right') this.x += this.speed;

        if (this.x < 0) this.x = 0;
        if (this.x > this.screenConfig.width - this.width) this.x = this.screenConfig.width - this.width;
    }

    destroy() {
        this.animationFrame = 1;
        this.animationType = 'exploding';
    }

    reset() {
        // this.x = this.config.x;
        // this.animationFrame = 0;
        // this.animationType = null;
    }

    // render() {
    //     if (this.animationFrame === 0) {
    //         this.ctx.drawImage(
    //             this.sprite,
    //             this.spriteInfo.x,
    //             this.spriteInfo.y,
    //             this.width,
    //             this.height,
    //             this.x,
    //             this.y,
    //             this.width,
    //             this.height

    //         );
    //     } else if (this.animationType) {
    //         switch (this.animationType) {

    //             case 'destroy':
    //                 this.ctx.drawImage(
    //                     this.sprite,
    //                     this.spriteInfo.explosionX,
    //                     this.spriteInfo.explosionY,
    //                     this.spriteInfo.explosionWidth,
    //                     this.spriteInfo.explosionHeight,
    //                     this.x + this.xSpriteOffset,
    //                     this.y + this.ySpriteOffset,
    //                     this.spriteInfo.explosionWidth,
    //                     this.spriteInfo.explosionHeight

    //                 );
    //                 this.animationFrame++;
    //                 if (this.animationFrame > this.destroyAnimationFrames) {
    //                     this.animationFrame = 0;
    //                     this.animationType = null;
    //                 }
    //                 break;
    //             case 'shoot':
    //                 this.ctx.drawImage(
    //                     this.sprite,
    //                     0,
    //                     this.height,
    //                     this.width,
    //                     this.height,
    //                     this.x,
    //                     this.y,
    //                     this.width,
    //                     this.height

    //                 );
    //                 this.animationFrame++;
    //                 if (this.animationFrame > this.shootAnimationFrames) {
    //                     this.animationFrame = 0;
    //                     this.animationType = null;
    //                 }
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }
}