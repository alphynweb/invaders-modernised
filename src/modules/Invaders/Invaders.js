import { INVADER, INVADERS, SCREEN, SOUNDS } from '../../config';
import Invader from '../Invader/Invader';

export default class Invaders {
    constructor(invadersY, invadersConfig, invaderConfigs) {
        this.config = INVADERS;
        this.moveSounds = SOUNDS.invader.move;
        this.invaderList = [];
        this.moveSounds = [];
        this.currentSoundIndex = 0;
        this.currentMoveSound = null;
        this.direction = "right";
        this.shiftDown = false;
        this.invadersY = invadersY;
        this.isRhWall = false;
        this.isLhWall = false;

        this.invadersConfig = invadersConfig;

        this.invaderConfigs = invaderConfigs;
        this.wave = 'wave1';
    }

    build = () => {
        // Build rows
        let x;
        let y;

        const formation = this.invadersConfig.configs['wave1'].formation;

        formation.forEach((row, index) => {
            const subType = row.subType;
            // const type = row.subType;

            // Find the config for this type of invader for this row
            const config = this.invaderConfigs[subType];

            //TODO - Clean this up and assign wave1 to var
            for (let column = 1; column < this.invadersConfig.configs['wave1'].columns + 1; column++) {
                x = (column * this.invadersConfig.configs['wave1'].columnWidth) + (column * this.invadersConfig.configs['wave1'].columnGap);
                y = (index * this.invadersConfig.configs['wave1'].rowHeight) + (index * this.invadersConfig.configs['wave1'].rowGap) + this.invadersY;
                const newInvader = new Invader(
                    'invader',
                    subType,
                    this.invaderConfigs.configs,
                    x,
                    y
                );
                this.invaderList.push(newInvader);
            }
        })

        // Build move sounds
        this.moveSounds.forEach((moveSound) => {
            // Create audio object for sound
            const newSound = Sounds();
            newSound.startTime = moveSound.startTime;
            newSound.stopTime = moveSound.stopTime;
            // Push audio object into moveSounds array
            this.moveSounds.push(newSound);
        });
    }

    purge() {
        this.invaderList.forEach((invader, index) => {
            if (!invader.isActive) {
                this.removeInvader(index);
            }
        });
    }

    removeInvader(index) {
        this.invaderList.splice(index, 1);
    }

    move = () => {
        this.currentMoveSound = this.moveSounds[this.currentMoveSoundIndex];
        this.currentMoveSoundIndex++;

        if (this.currentMoveSoundIndex > this.moveSounds.length - 1) {
            this.currentMoveSoundIndex = 0;
        }

        // Check if invaders are touching right or left walls and reverse direction if they are
        this.isRhWall = this.invaderList.find((invader) => invader.x + invader.width >= SCREEN.configs['main'].width - INVADERS.configs['wave1'].moveSpeed);
        this.isLhWall = this.invaderList.find((invader) => invader.x <= 0);

        if (this.isRhWall && this.direction === 'right') {
            this.shiftDown = true;
            this.direction = 'left';
        }
        if (this.isLhWall && this.direction === 'left') {
            this.shiftDown = true;
            this.direction = 'right';
        }
        if (this.shiftDown) {
            this.invaderList.forEach((invader) => {
                invader.move('down');
            });
            this.shiftDown = false;
        } else {
            this.invaderList.forEach((invader) => {
                invader.move(this.direction);
            });
        }
        this.shiftDown = false;
    }

    render() {
        this.invaderList.forEach((invader) => {
            invader.render();
        });
    }
}