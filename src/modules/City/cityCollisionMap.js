const cityCollisionMap = new Map([
    [
        subType => subType.startsWith('invader'),
        (city, collisionObject, configs) => {
            const bulletConfigs = configs.find(c => c.type === 'bullet').configs[collisionObject.subType];
            const topLeftY = collisionObject.y - city.y + collisionObject.height - bulletConfigs.height;
            return topLeftY;
        }
    ],
    [
        subType => subType === 'tank',
        (city, collisionObject, configs) => {
            const tankConfigs = configs.find(c => c.type === 'tank').configs['main'];
            const topLeftY = collisionObject.y - city.y - city.spriteInfo.damageHeight + tankConfigs.speed;
            return topLeftY;
        }
    ],
    [
        subType => subType === 'mothership',
        (city, collisionObject, configs) => {
            debugger;
        }
    ]
]);

export default cityCollisionMap;