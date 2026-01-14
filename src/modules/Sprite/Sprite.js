import gameSprite from '/public/graphics/graphicsSprite.png';

const sprite = function() {
    let img = new Image();
    img.src = gameSprite;
    return img;
};

export default sprite;