// jshint esversion: 6

const
  gridCvs = document.getElementById("grid"),
  gridCtx = gridCvs.getContext("2d"),
  sceneCvs = document.getElementById("scene"),
  sceneCtx = sceneCvs.getContext("2d");

const
  cvsWidth  = gridCvs.width  = sceneCvs.width  = 670,
  cvsHeight = gridCvs.height = sceneCvs.height = 480;

const
  CELL = 19, // cell size
  CANVAS_VERTPAD  = 2, // gridCvs vertical padding
  CANVAS_HORIZPAD = 2; // gridCvs horizontal padding
  GRID_WIDTH  = 35,
  GRID_HEIGHT = 25,
  GRID_TOP_BORDER     = 1,
  GRID_LEFT_BORDER    = 1,
  GRID_BOTTOM_BORDER  = GRID_HEIGHT,
  GRID_RIGHT_BORDER   = GRID_WIDTH,
  LINE_WIDTH_FIX = 0.5;

/** snake directions
 * 1: LEFT
 * 2: RIGHT
 * 3: TOP
 * 4: BOTTOM
 */
let
  PAUSE  = false;
  RIGHT  = 1,
  BOTTOM = 2,
  LEFT   = 3,
  TOP    = 4,
  DIRECTION  = RIGHT;

// grid size __35x25__
let drawGrid = () => {
  // vertical lines, 35boxes
  for (let w = CANVAS_HORIZPAD; w <= gridCvs.width; w += 19) {
    gridCtx.moveTo(w + LINE_WIDTH_FIX, CANVAS_VERTPAD);
    gridCtx.lineTo(w + LINE_WIDTH_FIX, gridCvs.height - CANVAS_VERTPAD);
  }

  // horizontal lines, 25boxes
  for (let h = CANVAS_VERTPAD; h <= gridCvs.height; h += 19) {
    gridCtx.moveTo(CANVAS_HORIZPAD, h + LINE_WIDTH_FIX);
    gridCtx.lineTo(gridCvs.width - CANVAS_HORIZPAD, h + LINE_WIDTH_FIX);
  }

  gridCtx.stroke();
};

let snake = [
  { x: 3, y: 1 },
  { x: 2, y: 1 },
  { x: 1, y: 1 }
];
// { start: { x: CANVAS_HORIZPAD + 2 * CELL, y: CANVAS_VERTPAD }, end: { x: CANVAS_HORIZPAD + 3 * CELL, y: CANVAS_VERTPAD + CELL } },
// { start: { x: CANVAS_HORIZPAD + CELL, y: CANVAS_VERTPAD }, end: { x: CANVAS_HORIZPAD + 2 * CELL, y: CANVAS_VERTPAD + CELL } },
// { start: { x: CANVAS_HORIZPAD, y: CANVAS_VERTPAD }, end: { x: CANVAS_HORIZPAD + CELL, y: CANVAS_VERTPAD + CELL} }

const drawSnake = () => {
  let
    startX, startY;

  sceneCtx.strokeStyle = "red";
  sceneCtx.fillStyle = "yellow";
  // for (const { start: { x: startX, y: startY}, end: { x: endX, y: endY } } of snake) {
  for (const { x: xCoord, y: yCoord } of snake) {
    /*
      x_pos: (X_COORD - 1) * CELL + CANVAS_HORIZPAD + LINE_WIDTH_FIX
      y_pos: (Y_COORD - 1) * CELL + CANVAS_HORIZPAD + LINE_WIDTH_FIX
    */
    startX = (xCoord - 1) * CELL + CANVAS_HORIZPAD + LINE_WIDTH_FIX;
    startY = (yCoord - 1) * CELL + CANVAS_VERTPAD + LINE_WIDTH_FIX;
    sceneCtx.beginPath();
    sceneCtx.rect(startX, startY, CELL, CELL);
    sceneCtx.closePath();
    sceneCtx.fill();
    sceneCtx.stroke();
  }
  sceneCtx.strokeStyle = "black";
};

const moveSnake = () => {
  // pause
  if (PAUSE) return;

  let
    nextHead,
    prevHead = snake[0];
  // console.log("pHead: ", prevHead);

  switch (DIRECTION) {
    // left
    case LEFT:
      if (prevHead.x !== GRID_LEFT_BORDER) {
        nextHead = {
          x: prevHead.x - 1,
          y: prevHead.y
        };
      } else {
        console.log("snake head === GRID_LB");
        nextHead = {
          x: GRID_RIGHT_BORDER,
          y: prevHead.y
        };
        // nextHead = {
        //   start: { x: cvsWidth - CANVAS_HORIZPAD - CELL - 1, y: prevHead.start.y },
        //   end:   { x: cvsWidth - CANVAS_HORIZPAD- 1,         y: prevHead.end.y   }
        // };
      }
      break;

    // right
    case RIGHT:
      if (prevHead.x !== GRID_RIGHT_BORDER) {
        nextHead = {
          x: prevHead.x + 1,
          y: prevHead.y
        };
      } else {
        console.log("snake head === GRID_RB");
        nextHead = {
          x: GRID_LEFT_BORDER,
          y: prevHead.y
        };
      }
      break;

    // top
    case TOP:
      if (prevHead.y !== GRID_TOP_BORDER) {
        nextHead = {
          x: prevHead.x,
          y: prevHead.y - 1
        };
      } else {
        console.log("snake head === GRID_TB");
        nextHead = {
          x: prevHead.x,
          y: GRID_BOTTOM_BORDER
        };
      }
      break;

    // bottom
    case BOTTOM:
      if (prevHead.y !== GRID_BOTTOM_BORDER) {
        nextHead = {
          x: prevHead.x,
          y: prevHead.y + 1
        };
      } else {
        console.log("snake head === GRID_BB");
        nextHead = {
          x: prevHead.x,
          y: GRID_TOP_BORDER
        };
      }
      break;
  }


  console.log("nHead: ", nextHead);
  snake.unshift(nextHead);
  snake.pop();

  // printSnake(snake);

  sceneCtx.clearRect(0, 0, gridCvs.width, gridCvs.height);
};

const createFood = () => {
  return {
    x: getRandom(1, GRID_WIDTH),
    y: getRandom(1, GRID_HEIGHT)
  };
};

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const changeDirection = (e) => {
  // console.log(e.code);
  switch (e.code) {
    case "ArrowLeft":
      if (!PAUSE && DIRECTION !== LEFT && DIRECTION !== RIGHT) DIRECTION = LEFT;
      break;

    case "ArrowRight":
      if (!PAUSE && DIRECTION !== RIGHT && DIRECTION !== LEFT) DIRECTION = RIGHT;
      break;

    case "ArrowUp":
      if (!PAUSE && DIRECTION !== TOP && DIRECTION !== BOTTOM) DIRECTION = TOP;
      break;

    case "ArrowDown":
      if (!PAUSE && DIRECTION !== BOTTOM && DIRECTION !== TOP) DIRECTION = BOTTOM;
      break;

    case "Space":
      PAUSE = !PAUSE;
      break;
  }

  console.log(`DIRECTION: ${DIRECTION}`);
};

const printSnake = (snake) => {
  for (let i = 0; i < snake.length; i++) {
    console.log(`snake[${i}]: ${snake[i].start.x} ${snake[i].start.y}`);
  }
  console.log("##############################################");
};

const delay = (n) => {
  n = n || 2000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n);
  });
};

let counter = 0;

const gameloop = async () => {
  drawSnake();

  await delay(400);
  moveSnake();

  requestAnimationFrame(gameloop);
};

document.addEventListener("keydown", changeDirection);

drawGrid();
gameloop();

