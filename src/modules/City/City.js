import { INVADER, TANK, CITY } from '../../config';
import Sprite from '../Sprite/Sprite';

export default class City {
    static cityCollisionMap = new Map([
        [
            subType => subType.startsWith('invader'),
            (city, collisionObject, configs) => {
                const bulletConfigs = configs.find(c => c.type === 'bullet').configs[collisionObject.subType];
                const topLeftY = collisionObject.y - city.y + collisionObject.height - bulletConfigs.height;
                return topLeftY;
                debugger;
            }
        ],
        [
            subType => subType === 'tank',
            (city, collisionObject, configs) => {
                const tankConfigs = configs.find(c => c.type === 'tank').configs['main'];
                const topLeftY = collisionObject.y - city.y - city.spriteInfo.damageHeight + tankConfigs.speed;
                return topLeftY;
                debugger;
            }
        ],
        [
            subType => subType === 'mothership',
            (city, collisionObject, configs) => {
                debugger;
            }
        ]
    ]);

    constructor(canvasId, x, configs) {
        this.configs = configs;
        this.cityConfig = this.configs.find(config => config.type === 'city').configs['main'];
        this.canvasId = canvasId;
        this.x = x;
        this.y = this.cityConfig.y;
        this.ctx = document.getElementById(canvasId).getContext('2d');
        this.sprite = Sprite();
        this.width = this.cityConfig.width;
        this.height = this.cityConfig.height;
        this.spriteInfo = this.cityConfig.spriteInfo;
    }

    damage(collisionObject) { // collisionObject = Bullet tyep that collided with city
        const topLeftX = collisionObject.x - this.x - (this.spriteInfo.damageWidth / 2);
        let topLeftY;
        const subType = collisionObject.subType;

        for (const [matchFn, handlerFn] of City.cityCollisionMap) {
            if (matchFn(subType)) {
                topLeftY = handlerFn(this, collisionObject, this.configs);
                break;
            }
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