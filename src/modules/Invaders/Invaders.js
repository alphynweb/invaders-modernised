import { INVADER, INVADERS, SCREEN, SOUNDS } from '../../config';
import Invader from '../Invader/Invader';
import Sounds from '../Sounds/Sounds';

export default class Invaders {
    constructor(invadersY) {
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
    }

    build() {
        // Build sounds for invader movement
        let newSound;
        this.moveSounds.forEach((moveSound) => {
            newSound = Sounds(); // Alter when Sounds becomes a class
            newSound.startTime = moveSound.startTime;
            newSound.stopTime = moveSound.stopTime;
            this.moveSounds.push(newSound); // Push audio class into moveSounds array
        });

        // Build rows
        let row = 1;
        let build = true;
        let x;
        let y;

        while (build) {
            const invader_info = INVADER.find((inv) => inv.rows.includes(row)); // Check if row number is in INVADERS info
            if (invader_info) { // If invader is found  
                const type = invader_info.type;
                for (let column = 1; column < INVADERS.columns + 1; column++) {
                    // invaderX = invader_info.width * column;
                    // invaderY = invader_info.height * row;
                    x = (column * INVADERS.columnWidth) + (column * INVADERS.columnGap);
                    y = (row * INVADERS.rowHeight) + (row * INVADERS.rowGap) + this.invadersY;
                    const newInvader = new Invader(
                        type,
                        x,
                        y
                    );
                    this.invaderList.push(newInvader);
                    console.log("Pushing new Invader. Type: ", type, " x:", x, " y:", y, "row:", row, "column:", column);
                }
            } else {
                // Stop
                build = false;
            }
            row++;
        }

        console.log("Invader list", this.invaderList);

        // Build move sounds
        this.moveSounds.forEach((moveSound) => {
            // Create audio object for sound
            const newSound = Sounds();
            newSound.startTime = moveSound.startTime;
            newSound.stopTime = moveSound.stopTime;
            // Push audio object into moveSounds array
            this.moveSounds.push(newSound);
        });

        // Build rows
        // let rowNo = 1;
        // let buildRow = true;

        // while (buildRow) {
        //     // Check if row number is in INVADERS info
        //     const invader_info = INVADER.find((inv) => inv.rows.includes(rowNo));
        //     if (invader_info != undefined) {
        //         // Carry on   
        //         for (let column = 0; column < INVADERS.columns; column++) {
        //             // Work out coordds for invader
        //             const x = column * INVADER.width;
        //             const y = rowNo * INVADER.height;
        //             let invader = Invader(rowNo, column + 1, y); // column + 1 to start them slightly to the right
        //             const newInvader = Object.assign(invader, invader_info);
        //             this.invaderList.push(newInvader);
        //         }
        //     } else {
        //         // Stop
        //         buildRow = false;
        //     }
        //     rowNo++;
        // }
    }

    purge() {
        // Loop trough invaders and remove any where isActive = false
        this.invaderList.forEach((invader, index) => {
            if (!invader.isActive) {
                this.removeInvader(index);
            }
        });
    }

    removeInvader(index) {
        this.invaderList.splice(index, 1);
    }

    move() {
        this.currentMoveSound = this.moveSounds[this.currentMoveSoundIndex];
        // this.currentMoveSound.play();
        this.currentMoveSoundIndex++;

        if (this.currentMoveSoundIndex > this.moveSounds.length - 1) {
            this.currentMoveSoundIndex = 0;
        }

        // Check if invaders are touching right or left walls and reverse direction if they are
        this.isRhWall = this.invaderList.find((invader) => invader.x + invader.width >= SCREEN.width - INVADERS.moveSpeed);
        this.isLhWall = this.invaderList.find((invader) => invader.x <= 0);

        if (this.isRhWall) {
            if (this.direction === 'right') {
                this.shiftDown = true;
            }
            this.direction = 'left';
        }
        if (this.isLhWall) {
            if (this.direction === 'left') {
                this.shiftDown = true;
            }
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