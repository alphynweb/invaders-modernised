import { TEXT } from '../../config';
import Ctx from '../Ctx/Ctx';

const score = () => {
    return {
        x: 20,
        y: TEXT.y,
        currentScore: 0,
        ctx: Ctx(),
        font: TEXT.font,
        increase: function (points) {
            this.currentScore += points;
        },
        reset: function () {
            this.currentScore = 0;
        },
        render: function () {
            this.ctx.fillStyle = 'white';
            this.ctx.font = TEXT.font;
            this.ctx.fillText('SCORE', this.x, this.y);

            this.ctx.fillStyle = '#36ff00';
            this.ctx.font = TEXT.font;
            this.ctx.fillText(this.currentScore, this.x + 80, this.y);
        }
    };
};

export default score;