"use strict";
function raycast(start, direction, obstacle) {
    //check that the obstacle is correct height
    if (intersectEdge(start, obstacle)) {
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
function intersectEdge(a, b) {
    return ((a.y > b.y && a.y < b.y + b.height) ||
        (a.y + a.height > b.y &&
            a.y + a.height < b.y + b.height) ||
        (a.y == b.y &&
            a.y + a.height == b.y + b.height));
}
let intersect = (start, obstacle) => {
    return intersectEdge(start, obstacle) && intersectEdge(flip(start), flip(obstacle));
};
function allowedMovement(player, colliders) {
    let output = { dx: player.dx, dy: player.dy, up: false, down: false, left: false, right: false };
    if (player.dx > 0) {
        let distances = [];
        for (let i = 0; i < colliders.length; i++) {
            distances.push(raycast(player, player.dx, colliders[i]));
        }
        const minDist = Math.min(...distances);
        if (minDist < player.dx) {
            output.dx = minDist;
            output.right = true;
        }
    }
    else {
        let distances = [];
        for (let i = 0; i < colliders.length; i++) {
            distances.push(raycast(player, player.dx, colliders[i]));
        }
        const maxDist = Math.max(...distances);
        if (maxDist > player.dx) {
            output.dx = maxDist;
            output.left = true;
        }
    }
    if (player.dy < 0) {
        let distances = [];
        for (let i = 0; i < colliders.length; i++) {
            distances.push(raycast(flip(player), player.dy, flip(colliders[i])));
        }
        const maxDist = Math.max(...distances);
        if (maxDist > player.dy) {
            output.dy = maxDist;
            output.up = true;
        }
    }
    else {
        let distances = [];
        for (let i = 0; i < colliders.length; i++) {
            distances.push(raycast(flip(player), player.dy, flip(colliders[i])));
        }
        const minDist = Math.min(...distances);
        if (minDist < player.dy) {
            output.dy = minDist;
            output.down = true;
        }
    }
    return output;
}
