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
        this.explosionTime = config.explosionTime;
        this.x = x;
        this.y = y;
        this.isActive = true; // Determines whether invader is active in game (switch to false when animating explosion etc)
        this.sound = null;
        this.direction = 'right';
        this.animationType = 'normal';
        this.spriteInfo = config.spriteInfo;
    }

    move(direction) {
        if (direction !== 'down') {
            this.x += direction === 'right' ? INVADERS.configs['wave1'].moveSpeed : -INVADERS.configs['wave1'].moveSpeed;
        } else {
            this.y += INVADERS.configs['wave1'].shiftDownSpeed;
        }

        this.animationFrame++;
    }

    destroy() {
        this.animationType = 'exploding';
        this.isActive = false;
    }
}