"use strict";
function raycast(start, direction, obstacle) {
    //check that the obstacle is correct height
    if ((start.y > obstacle.y && start.y < obstacle.y + obstacle.height) ||
        (start.y + start.height > obstacle.y &&
            start.y + start.height < obstacle.y + obstacle.height) ||
        (start.y == obstacle.y &&
            start.y + start.height == obstacle.y + obstacle.height)) {
        if (direction > 0) {
            if (obstacle.x + 0.05 >= start.x + start.width) {
                return obstacle.x - (start.x + start.width);
            }
        }
        else if (direction < 0) {
            if (obstacle.x + obstacle.width <= start.x + 0.05) {
                return obstacle.x + obstacle.width - start.x;
            }
        }
    }
    if (direction > 0) {
        return Infinity;
    }
    else {
        return -Infinity;
    }
}
//swap x and y, and width and height properties, so the code for raycasting in the x-direction
//can be used for raycasting in the y-direction
function flip(input) {
    return { x: input.y, y: input.x, width: input.height, height: input.width };
}
