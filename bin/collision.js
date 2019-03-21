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
function collide(player, colliders, delta) {
    let output = { vx: player.vx, vy: player.vy, up: false, down: false, left: false, right: false };
    const dx = player.vx * delta;
    if (dx != 0) {
        let distances = [];
        for (let i = 0; i < colliders.length; i++) {
            distances.push(raycast(player, dx, colliders[i]));
        }
        if (dx > 0) {
            const minDist = Math.min(...distances);
            if (minDist < dx) {
                output.vx = minDist / delta;
                output.right = true;
            }
        }
        else {
            const maxDist = Math.max(...distances);
            if (maxDist > dx) {
                output.vx = maxDist / delta;
                output.left = true;
            }
        }
    }
    const dy = player.vy * delta;
    if (dy != 0) {
        let distances = [];
        for (let i = 0; i < colliders.length; i++) {
            distances.push(raycast(flip(player), dy, flip(colliders[i])));
        }
        if (dy < 0) {
            const maxDist = Math.max(...distances);
            if (maxDist > dy) {
                output.vy = maxDist / delta;
                output.up = true;
            }
        }
        else {
            const minDist = Math.min(...distances);
            if (minDist < dy) {
                output.vy = minDist / delta;
                output.down = true;
            }
        }
    }
    return output;
}
