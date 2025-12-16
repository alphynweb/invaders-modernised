import { INVADER, INVADERS } from '../config';

export default class FinishLevel {
    constructor(invaders, cities, tank) {
        this.invaderConfig = INVADER;
        this.invadersConfig = INVADERS;
        this.invaders = invaders;
        this.cities = cities;
        this.tank = tank;
    }
    reset() {
        // Implement short pause then re-setup invaders  and cities

        // Implement short pause

        // Setup invaders again - lower the y coord
        const invader_group_y = this.invaderConfig.rowHeight;

        let invaderMoveTime;

        // If invaders are lower than a certain level, reset the invader_group_y but speed up the invaders
        if (invader_group_y > this.invadersConfig.maxY) {
            invader_group_y = this.invadersConfig.y;
            currentLevel += 1;
            invaderMoveTime = this.invadersConfig.moveTime - this.invadersConfig.speedIncrease;
        } else {
            invaderMoveTime = this.invadersConfig.moveTime - this.invadersConfig.speedIncrease;
        }

        this.invaders.build(invader_group_y);

        this.invaders.direction = 'right';
    
        this.cities.build();
        this.tank.reset();
    }
    render() {
        this.cities.render();
    }
}