import { INVADER, MOTHERSHIP, SCREEN, TANK } from '../../config';
import Bullet from '../Bullet/Bullet';
import Sounds from '../Sounds/Sounds';

export default class Bullets {
    constructor() {
        this.bulletList = [];
        this.shootSound = Sounds();
        this.shootSound.startTime = 0.008;
        this.shootSound.stopTime = 0.307;
    }

    addBullet(bulletType, bulletSubType, x, y) {
        let newBullet,
            bulletWidth,
            bulletHeight,
            bulletDirection,
            bulletSpeed,
            spriteX,
            spriteY;

        switch (bulletType) {
            case "tank":
                const tankBulletInfo = TANK.bulletInfo;
                console.log("Tank bullet inf", tankBulletInfo);
                this.shootSound.play();
                bulletWidth = tankBulletInfo.width;
                bulletHeight = tankBulletInfo.height;
                bulletDirection = "up";
                bulletSpeed = tankBulletInfo.speed;
                spriteX = tankBulletInfo.spriteX;
                spriteY = tankBulletInfo.spriteY;
                // newBullet = new Bullet(
                //     "tank",
                //     bulletSubType,
                //     x,
                //     y,
                //     tankBulletInfo.width,
                //     tankBulletInfo.height,
                //     "up",
                //     tankBulletInfo.speed
                // );
                break;
            case "invader":
                const invaderInfo = INVADER.find((inv) => inv.type === bulletSubType);
                const invaderBulletInfo = invaderInfo.bulletInfo;
                // newBullet = new Bullet(
                //     "invader",
                //     bulletSubType,
                //     x,
                //     y,
                //     invaderBulletInfo.width,
                //     invaderBulletInfo.y,
                //     "down",
                //     invaderBulletInfo.speed
                // );
                break;
            case "mothership":
                const mothershipBulletInfo = MOTHERSHIP.bulletInfo;
                // newBullet = new Bullet(
                //     "mothership",
                //     bulletSubType,
                //     x,
                //     y,
                //     mothershipBulletInfo.width,
                //     mothershipBulletInfo.height,
                //     "down",
                //     mothershipBulletInfo.speed
                // );
                break;
            default:
                break;
        }
        newBullet = new Bullet(
            bulletType,
            bulletSubType,
            x,
            y,
            bulletWidth,
            bulletHeight,
            bulletDirection,
            bulletSpeed,
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