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
    (start.y > obstacle.y && start.y < obstacle.y + obstacle.height) ||
    (start.y + start.height > obstacle.y &&
      start.y + start.height < obstacle.y + obstacle.height) ||
    (start.y == obstacle.y &&
      start.y + start.height == obstacle.y + obstacle.height)
  ) {
    if (direction > 0) {
      if (obstacle.x + 0.05 >= start.x + start.width) {
        return obstacle.x - (start.x + start.width);
      }
    } else if (direction < 0) {
      if (obstacle.x + obstacle.width <= start.x + 0.05) {
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

function intersectEdge(
  start: {
    y: number;
    height: number;
  },
  obstacle: {
    y: number;
    height: number;
  },
) {
  return (
    (start.y > obstacle.y && start.y < obstacle.y + obstacle.height) ||
    (start.y + start.height > obstacle.y &&
      start.y + start.height < obstacle.y + obstacle.height)
  );
}

function intersect(
  start: { x: number; y: number; width: number; height: number },
  obstacle: { x: number; y: number; width: number; height: number },
) {
  return (
    intersectEdge(start, obstacle) && intersectEdge(flip(start), flip(obstacle))
  );
}
