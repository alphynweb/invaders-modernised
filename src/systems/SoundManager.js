export default class AudioManager {
    constructor(audioSprite, audioMap, audioCtx) {
        this.audioSprite = audioSprite;
        this.audioMap = audioMap;
        this.muted = false;
        this.audioContext = audioCtx;
        this.audioCtx = audioCtx;
    }

    setAudioBuffer(audioBuffer) {
        this.audioBuffer = audioBuffer;
    }

    play(sound) {

        const audioInfo = this.audioMap.get(sound);

        if (!audioInfo) return;
        if (this.muted) return;

        const start = audioInfo.start;
        const stop = audioInfo.stop;
        const duration = stop - start;

        const source = this.audioCtx.createBufferSource();
        source.buffer = this.audioBuffer;
        source.connect(this.audioCtx.destination);
        source.start(this.audioCtx.currentTime, start, duration);
    }

    pause() {
        this.soundObject.pause();
    }

    stop() {

    }

    mute() {

    }

    unMute() {

    }
}