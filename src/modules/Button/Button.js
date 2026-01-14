export default class Button {
    constructor(type, subType, configs, x, y) {
        const config = configs[subType];
        this.type = type;
        this.subType = subType;
        this.score = config.score;
        this.width = config.width;
        this.height = config.height;
        this.x = x;
        this.y = y;

        this.animationType = 'normal';
        this.spriteInfo = config.spriteInfo;
    }
}

// import Ctx from '../Ctx/Ctx';

// const button = (x, y, width, height, text, color = '#fff', id, cssClass) => {
//     return {
//         x,
//         y,
//         width,
//         height,
//         text,
//         color,
//         id,
//         cssClass,
//         type: 'startButton',
//         animationType: 'normal',
//         btn: null,
//         onHover: function() {
//             console.log('Hovering on button');
//             this.animationType = 'hover';
//         },
//         onClick: function () {
//             console.log('Button Clicked');
//             this.animationType = 'pressed';
//         }
//     };
// };

// export default button;