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
  GRID_RIGHT_BORDER   = CANVAS_HORIZPAD + GRID_WIDTH * CELL,
  GRID_LEFT_BORDER    = CANVAS_HORIZPAD,
  GRID_TOP_BORDER     = CANVAS_VERTPAD,
  GRID_BOTTOM_BORDER  = CANVAS_VERTPAD + GRID_HEIGHT * CELL,
  LINE_WIDTH_FIX = 0.5;

/** snake directions
 * 1: LEFT
 * 2: RIGHT
 * 3: TOP
 * 4: BOTTOM
 */
let
  LEFT   = 1,
  RIGHT  = 2,
  TOP    = 3,
  BOTTOM = 4,
  DIRECTION  = LEFT;

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
  { start: { x: CANVAS_HORIZPAD + 2 * CELL, y: CANVAS_VERTPAD }, end: { x: CANVAS_HORIZPAD + 3 * CELL, y: CANVAS_VERTPAD + CELL } },
  { start: { x: CANVAS_HORIZPAD + CELL, y: CANVAS_VERTPAD }, end: { x: CANVAS_HORIZPAD + 2 * CELL, y: CANVAS_VERTPAD + CELL } },
  { start: { x: CANVAS_HORIZPAD, y: CANVAS_VERTPAD }, end: { x: CANVAS_HORIZPAD + CELL, y: CANVAS_VERTPAD + CELL} }
];

const drawSnake = () => {
  sceneCtx.strokeStyle = "red";
  sceneCtx.fillStyle = "yellow";
  for (const { start: { x: startX, y: startY}, end: { x: endX, y: endY } } of snake) {
    // console.table([["start", startX, startY], ["end", endX, endY]]);
    sceneCtx.beginPath();
    sceneCtx.rect(startX + LINE_WIDTH_FIX, startY + LINE_WIDTH_FIX, CELL, CELL);
    sceneCtx.closePath();
    sceneCtx.fill();
    sceneCtx.stroke();
  }
  sceneCtx.strokeStyle = "black";
};

const moveSnake = () => {
  let prevHead, nextHead;
  prevHead = snake[0];
  // console.log("pHead: ", prevHead);

  // if snake head === GRID_RB && direction === RIGHT
  if (prevHead.end.x === GRID_RIGHT_BORDER && DIRECTION === LEFT) {
    console.log("snake head === GRID_RB");
    nextHead = {
      start: {
        x: CANVAS_HORIZPAD,
        y: prevHead.start.y
      },
      end: {
        x: CANVAS_HORIZPAD + CELL,
        y: prevHead.end.y
      }
    }
  } else {
    nextHead = {
      start: {
        x: prevHead.start.x + CELL,
        y: prevHead.start.y
      },
      end: {
        x: prevHead.end.x + CELL,
        y: prevHead.end.y
      }
    };
  }

  // console.log("nHead: ", nextHead);
  snake.unshift(nextHead);
  snake.pop();

  sceneCtx.clearRect(0, 0, gridCvs.width, gridCvs.height);
};

// rewrite for compact view
let printSnake = (snake) => {
  console.log("##############################################");
  for (const { start: { x: startX, y: startY}, end: { x: endX, y: endY } } of snake) {
    console.table([["start", startX, startY], ["end", endX, endY]]);
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
}

let counter = 0;

const gameloop = async () => {
  drawSnake();

  // if (++counter <= 35) {
    await delay(400);
    moveSnake();
    // console.log("gameloop tick: ", counter);
  // }

  requestAnimationFrame(gameloop);
};

drawGrid();
gameloop();