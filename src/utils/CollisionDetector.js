class CollisionDetector {
    collisionInfo(obj1, obj2) {
        const collidingSides = [];

        const didCollide =
            // Within horizontal boundaries
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            // Within vertical bounderies
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y;

        if (didCollide) {
            // Work out which sides are closest (which sides are touching)
            // Distance between obj1 right and obj2 left
            const obj1RightObj2Left = (obj2.x) - (obj1.x + obj1.width);
            // Distance betwwen obj1 left and obj2 right
            const obj1LeftObj2Right = (obj1.x) - (obj2.x + obj2.width);
            // Distance between obj1 top and obj2 bottom
            const obj1TopObj2Bottom = (obj2.y + obj2.height) - (obj1.y);
            // Distance between obj1 bottom and obj2 top
            const obj1BottomObj2Top = (obj1.y + obj1.height) - (obj2.y);

            collidingSides.push(
                // Convert negative values to positive ones

                {
                    "sides": "obj1Right", "distance": Math.abs(obj1RightObj2Left)
                },
                {
                    "sides": "obj1Left", "distance": Math.abs(obj1LeftObj2Right)
                },
                {
                    "sides": "obj1Top", "distance": Math.abs(obj1TopObj2Bottom)
                },
                {
                    "sides": "obj1Bottom", "distance": Math.abs(obj1BottomObj2Top)
                }
            );

            collidingSides.sort((a, b) => a.distance - b.distance);
        }

        let collisionInfo = {
            didCollide: didCollide,
            collidingSides: collidingSides[0]
        };
        return collisionInfo;

    }
}

const collisionDetector = new CollisionDetector();
export default collisionDetector;