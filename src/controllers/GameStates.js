import { INVADER, MOTHERSHIP, TANK, CITY, GAME_TEXT } from '../config.js';
import Button from '../modules/Button/Button';
import Screen from '../modules/Screen/Screen';
import Invader from '../modules/Invader/Invader';
import Mothership from '../modules/Mothership/Mothership';

export default class GameStates {
    constructor(update, render, startGame, finishLevel, renderIntroScreen) {
        this.currentState = this.introscreen;
        this.screen = Screen();
        this.invaderConfig = INVADER;
        this.mothershipConfig = MOTHERSHIP;
        this.tankConfig = TANK;
        this.cityConfig = CITY;
        this.gameTextConfig = GAME_TEXT;
        this.canvas = document.querySelector('#screenCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Functions passed in from main Game class
        this.update = update;
        this.render = render;
        this.startGame = startGame;
        this.finishLevel = finishLevel;
        this.renderIntroScreen = renderIntroScreen
    }

    introScreen = (currentTime) => {
       this.renderIntroScreen();
    }

    runGame(currentTime) {
        this.update(currentTime);
        this.render();
    }

    finishLevel(currentTime) {
        this.finishLevel(); 
    }

    loseLife(currentTime) {

    }

    gameOver(currentTime) {

    }
}