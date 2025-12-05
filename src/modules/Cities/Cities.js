import { CITY, SCREEN } from '../../config';
import City from '../City/City';

export default class Cities {
    constructor() {
        this.cityConfig = CITY;
        this.screenConfig = SCREEN;
        this.cityList = [];
        this.noOfCities = this.cityConfig.no;
        this.cityWidth = this.cityConfig.width;
        this.cityXArea = this.screenConfig.width - (this.cityConfig.indent * 2); // Horizontal area that city takes up
        this.cityGap = (this.cityXArea - (this.noOfCities * this.cityWidth)) / (this.noOfCities - 1);
        this.gameArea = document.querySelector('#gameArea');
    }

    build() {
        for (let i = 0; i < this.noOfCities; i++) {

            const gameArea = document.getElementById('gameArea');

            // Work out x coord for city based on no of cities and city gap
            const cityX = (i * this.cityConfig.width) + (i * this.cityGap) + this.cityConfig.indent;

            // Build a seperate canvas for the city
            const cityCanvas = document.createElement('canvas');
            cityCanvas.id = 'cityCanvas' + i;
            cityCanvas.width = CITY.width;
            cityCanvas.height = CITY.height;
            cityCanvas.style.position = "absolute";
            cityCanvas.style.top = (CITY.y) + "px";
            cityCanvas.style.left = cityX + "px";
            cityCanvas.style.zIndex = "999";

            gameArea.appendChild(cityCanvas);

            const newCity = new City(cityCanvas.id, cityX);

            this.cityList.push(newCity);
        }
    }

    clear() {
        this.cityList.forEach((city) => {
            city.clear();
        });
    }

    render() {
        this.cityList.forEach((city) => {
            city.render();
        });
    }
}