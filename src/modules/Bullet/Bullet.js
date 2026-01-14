import Ctx from '../Ctx/Ctx';
import Sprite from '../Sprite/Sprite';

export default class Bullet {
    constructor(type, subType, configs, x, y) {
        this.configs = configs;
        this.type = type;
        this.subType = subType; 
        const config = configs[subType];
        this.x = x; 
        this.y = y; 
        this.width = config.width;
        this.height = config.height;
        this.direction = config.direction;
        this.speed = config.speed;
        this.animationType = 'normal';
    }

    move() {
        this.y = this.direction === 'up' ? this.y - this.speed : this.y + this.speed;
    }
}