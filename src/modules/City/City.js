import { INVADER, TANK, CITY } from '../../config';
import Sprite from '../Sprite/Sprite';

export default class City {
    constructor(canvasId, x) {
        this.config = CITY;
        this.canvasId = canvasId;
        this.x = x;
        this.y = this.config.y;
        this.ctx = document.getElementById(canvasId).getContext('2d');
        this.sprite = Sprite();
        this.width = this.config.width;
        this.height = this.config.height;
        this.spriteInfo = this.config.spriteInfo;
    }

    damage(collisionObject) { // collisionObject = Bullet tyep that collided with city
        const topLeftX = collisionObject.x - this.x - (this.spriteInfo.damageWidth / 2);
        let topLeftY;
        switch (collisionObject.type) {
            case 'tank':
                topLeftY = collisionObject.y - this.y - this.spriteInfo.damageHeight + TANK.bulletInfo.speed;
                break;
            case 'invader':
                // Establish what type of Invader fired the bullet
                const invaderType = INVADER.find((inv) => inv.type === collisionObject.subType);
                topLeftY = collisionObject.y - this.y + collisionObject.height - invaderType.bulletInfo.height;
                break;
        }
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.drawImage(
            this.sprite,
            this.spriteInfo.damageX,
            this.spriteInfo.damageY,
            this.spriteInfo.damageWidth,
            this.spriteInfo.damageHeight,
            topLeftX,
            topLeftY,
            this.spriteInfo.damageWidth,
            this.spriteInfo.damageHeight

        );
        this.ctx.globalCompositeOperation = 'source-over'; // Change back to default for re-rendering of cities
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    render() {
        this.ctx.drawImage(
            this.sprite,
            this.spriteInfo.x,
            this.spriteInfo.y,
            this.width,
            this.height,
            0,
            0,
            this.width,
            this.height

        );
    }
}