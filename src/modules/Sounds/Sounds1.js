import audioSprite from '/audio/audioSprite.mp3';

const sounds = () => {
    return {
        soundSrc: audioSprite,
        startTime: null,
        stopTime: null,
        soundObject: document.createElement('audio'),
        play: function (sound) {
            this.soundObject.src = this.soundSrc;
            this.soundObject.currentTime = this.startTime;
            this.soundObject.addEventListener('timeupdate', () => {
                if (this.soundObject.currentTime > this.stopTime) {
                    this.pause();
                }
            });
        },
        pause: function () {
            this.soundObject.pause();
        }
    };
};

export default sounds;