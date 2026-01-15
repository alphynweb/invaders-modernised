export default class Mothership {
    constructor(type, subType, configs, x, y) {
        const config = configs[subType];
        this.type = type;
        this.subType = subType;
        this.score = config.score;
        this.width = config.width;
        this.height = config.height;
        this.x = x;
        this.y = y;
        this.isActive = true;
        this.speed = config.speed;
        this.animationType = 'normal';
        this.animationFrame = 0;
        this.spriteInfo = config.spriteInfo;
    }

    move() {
        this.x += this.speed;
    }

    reset() {
        this.x = -this.width;
        this.isActive = true;
        this.score = Math.ceil(Math.random() * 10) * 100;
        this.animationType = 'normal';
    }

    remove() {
        this.isActive = false;
    }

    destroy() {
        // Set isAnimating frame to start animation
        this.animationType = 'exploding';
        this.isActive = false;
    }

    purge() {
        if (!this.isActive) {
            this.remove();
        }
    }
}