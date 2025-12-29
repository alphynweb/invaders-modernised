export default class AudioManager {
    constructor(audioSpriteUrl, audioMap) {
        this.audioSpriteUrl = audioSpriteUrl;
        this.audioMap = audioMap;
        this.muted = true;
        this.audioCtx = new AudioContext();
        this.gainControl = this.audioCtx.createGain();
        this.volume = 0;
    }

    init = async () => {
        const response = await fetch(this.audioSpriteUrl);
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
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

        source.connect(this.gainControl).connect(this.audioCtx.destination);

        source.start(this.audioCtx.currentTime, start, duration);
        console.log("Playing sound", sound);
    }

    onSetVolume(volume) {
        this.volume = volume;
        this.gainControl.gain.value = this.volumeClamp(this.volume, 0, 1);
        if (this.volume > 0) this.muted = false;
        if (this.volume === 0) this.muted = true;
    }

    volumeClamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    mute() {
        this.gainControl.gain.value = 0.05;
    }

    unMute() {
        this.gainControl.gain.value = this.volume;
    }

    resumeAudio = async () => {
        this.audioCtx.resume();
    }
}