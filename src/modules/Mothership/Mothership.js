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
        this.animationFrames = config.spriteInfo[this.animationType].length;
        this.frameTimer = 0;
        this.frameLengths = config.frameLengths;
        this.spriteInfo = config.spriteInfo;
        this.explosionDuration = config.explosionDuration;
        this.explosionTimer = 0;
    }

    move() {
        if (this.animationType === 'exploding') return;
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
        this.animationType = 'exploding';
    }

    purge() {
        if (!this.isActive) {
            this.remove();
        }
    }

    update = (delta) => {
        if (this.animationType === 'normal') {
            this.frameTimer += delta;

            const currentFrame = this.spriteInfo[this.animationType][this.animationFrame];
            const currentFrameDuration = currentFrame.frameLength ?? this.frameLengths[this.animationType];

            if (this.frameTimer >= currentFrameDuration) {
                this.frameTimer = 0;
                this.animationFrame = (this.animationFrame + 1) % this.animationFrames;

            }
        }
        if (this.animationType === 'exploding') {
            this.explosionTimer += delta;
            if (this.explosionTimer >= this.explosionDuration) {
                this.explosionTimer = 0;
                this.remove();
            }
        }
    }
}