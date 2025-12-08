class InputHandler {
    constructor() {
        this.currentKeysPressed = [];
        this.isInitialised = false;
    }

    init() {
        if (this.isInitialised) {
            return;
        }

        this.isInitialised = true;

        document.addEventListener('keydown', (event) => {
            const keyCode = event.code;

            // prevent default for game keys
            const gameKeys = ['ArrowLeft', 'ArrowRight', 'Space'];

            if (gameKeys.includes(keyCode)) {
                event.preventDefault();
            }

            if (!this.currentKeysPressed.includes(keyCode)) {
                this.currentKeysPressed.push(keyCode);
            }
        });
        document.addEventListener('keyup', (event) => {
            const keyCode = event.code;
            const keyIndex = this.currentKeysPressed.indexOf(keyCode);

            if (keyIndex !== -1) {
                this.currentKeysPressed.splice(keyIndex, 1);
            }
        });
    }

    isKeyPressed(keyCode) {
        return this.currentKeysPressed.includes(keyCode);
    }
}

const inputHandler = new InputHandler();
export default inputHandler;