import { INVADER, MOTHERSHIP, SCREEN, TANK } from '../../config';
import Bullet from '../Bullet/Bullet';

export default class Bullets {
    constructor() {
        this.bulletList = [];
    }

    addBullet(type, subType, x, y) {
        let newBullet,
            bulletInfo,
            width,
            height,
            direction,
            speed,
            spriteX,
            spriteY;

        switch (type) {
            case "tank":
                bulletInfo = TANK.bulletInfo;
                direction = "up";
                break;
            case "invader":
                const invaderInfo = INVADER.find((inv) => inv.type === subType);
                bulletInfo = invaderInfo.bulletInfo;
                direction = "down";
                break;
            case "mothership":
                bulletInfo = MOTHERSHIP.bulletInfo;
                direction = "down";
                break;
            default:
                break;
        }

        width = bulletInfo.width;
        height = bulletInfo.height;
        speed = bulletInfo.speed;
        spriteX = bulletInfo.spriteX;
        spriteY = bulletInfo.spriteY;

        newBullet = new Bullet(
            type,
            subType,
            x,
            y,
            width,
            height,
            direction,
            speed,
            spriteX,
            spriteY
        );
        this.bulletList.push(newBullet);
    }

    removeBullet(index) {
        this.bulletList.splice(index, 1);
    }

    reset() {
        this.bulletList = [];
    }

    move() {
        this.bulletList.forEach((bullet, index) => {
            // If tank bullet reaches top of screen, remove it from bulletList
            if (bullet.type === 'tank' && bullet.y < 0) {
                this.removeBullet(index);
            }
            // If invader bullet reaches bottom of screen, remove it from bulletList
            if ((bullet.type === 'invader' || bullet.type === 'mothership') && bullet.y > SCREEN.height) {
                this.removeBullet(index);
            }
            bullet.move();
        });
    }

    render() {
        this.bulletList.forEach((bullet) => {
            bullet.render();
        });
    }
}