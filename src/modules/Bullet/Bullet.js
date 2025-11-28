import Ctx from '../Ctx/Ctx';
import Sprite from '../Sprite/Sprite';

export default class Bullet {
    constructor(type, subType, x, y, width, height, direction, speed, spriteX, spriteY) {
        this.type = type; // Tank, invader, mothership etc
        this.subType = subType; // Variation of type if needed
        this.x = x; // x starting coord
        this.y = y; // y starting coord
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.speed = speed;
        this.ctx = Ctx();
        this.sprite = Sprite();
        this.spriteX = spriteX;
        this.spriteY = spriteY;
    }

    move() {
        this.y = this.direction === 'up' ? this.y - this.speed : this.y + this.speed;
    }

    render() {
        this.ctx.drawImage(
            this.sprite,
            this.spriteX,
            this.spriteY,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height);
    }
}