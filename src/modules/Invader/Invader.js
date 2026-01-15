import { INVADERS } from '../../config';

export default class Invader {
    constructor(type, subType, configs, x, y) {
        // const config = configs.find(config => config.subType === subType);
        const config = configs[subType];
        this.type = type;
        this.subType = subType;
        this.score = config.score;
        this.width = config.width;
        this.height = config.height;
        this.explosionDuration = config.explosionDuration;
        this.explosionTimer = 0;
        this.x = x;
        this.y = y;
        this.isActive = true; // Determines whether invader is active in game (switch to false when animating explosion etc)
        this.sound = null;
        this.direction = 'right';
        this.animationType = 'normal';
        this.spriteInfo = config.spriteInfo;
        this.animationFrame = 0;
    }

    move(direction) {
        if (direction !== 'down') {
            this.x += direction === 'right' ? INVADERS.configs['wave1'].moveSpeed : -INVADERS.configs['wave1'].moveSpeed;
        } else {
            this.y += INVADERS.configs['wave1'].shiftDownSpeed;
        }

        if (this.animationFrame < (this.spriteInfo[this.animationType].length - 1)) {
            this.animationFrame++;
        } else {
            this.animationFrame = 0;
        }
    }

    destroy() {
        this.animationType = 'exploding';
    }

    update(delta) {
        if (this.animationType === 'exploding') {
            this.explosionTimer += delta;
            if (this.explosionTimer >= this.explosionDuration) {
                this.explosionTimer = 0;
                this.isActive = false;
            }
        }

    }
}