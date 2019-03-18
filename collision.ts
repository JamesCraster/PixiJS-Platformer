function raycast(
  start: {
    x: number;
    y: number;
    height: number;
    width: number;
  },
  direction: number,
  obstacle: {
    x: number;
    y: number;
    height: number;
    width: number;
  },
) {
  //check that the obstacle is correct height
  if (
    (start.y + 0.05 >= obstacle.y &&
      start.y <= obstacle.y + obstacle.height + 0.05) ||
    (start.y + start.height + 0.05 >= obstacle.y &&
      start.y + start.height <= obstacle.y + obstacle.height + 0.05)
  ) {
    if (direction > 0) {
      if (obstacle.x >= start.x + start.width) {
        return obstacle.x - (start.x + start.width);
      }
    } else if (direction < 0) {
      if (obstacle.x + obstacle.width <= start.x) {
        return obstacle.x + obstacle.width - start.x;
      }
    }
  }
  if (direction > 0) {
    return Infinity;
  } else {
    return -Infinity;
  }
}
//swap x and y, and width and height properties, so the code for raycasting in the x-direction
//can be used for raycasting in the y-direction
function flip(input: { x: number; y: number; width: number; height: number }) {
  return { x: input.y, y: input.x, width: input.height, height: input.width };
}
