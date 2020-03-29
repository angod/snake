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
  CELL_SIZE = 19,
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

// ########################################
class Cell {
  constructor(x, y) {
    this._x = x || 0;
    this._y = y || 0;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  set x(value) {
    this._x = value;
  }

  set y(value) {
    this._y = value;
  }

  setCoords(x, y) {
    this._x = x;
    this._y = y;
  }

  copy(source) {
    this._x = source.x;
    this._y = source.y;
  }

  equals(cell) {
    if (this._x === cell.x && this._y === cell.y) {
      return true;
    }

    return false;
  }

  toString() {
    console.log(`x: ${this._x}, y: ${this._y}`);
  }
}
// ########################################

let Snake = [
  new Cell(3, 1),
  new Cell(2, 1),
  new Cell(1, 1)
];
// ########################################

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
// ########################################

const createFood = () => {
  return new Cell(
    getRandom(1, GRID_WIDTH),
    getRandom(1, GRID_HEIGHT)
  );
};
// ########################################

const eatFood = (head) => {
  if (head.equals(Food)) {
    return true;
  }

  return false;
};
// ########################################

let
  Food = createFood();

Food.toString();
// TODO: implement drawCell()
const drawFood = () => {
  let
    startX, startY;

  sceneCtx.strokeStyle = "red";
  sceneCtx.fillStyle = "orange";
  /*
    x_pos: (X_COORD - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX
    y_pos: (Y_COORD - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX
  */
  startX = (Food.x - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX;
  startY = (Food.y - 1) * CELL_SIZE + CANVAS_VERTPAD + LINE_WIDTH_FIX;
  sceneCtx.beginPath();
  sceneCtx.rect(startX, startY, CELL_SIZE, CELL_SIZE);
  sceneCtx.closePath();
  sceneCtx.fill();
  sceneCtx.stroke();

  sceneCtx.strokeStyle = "black";
};
// ########################################

// grid size __35x25__
const drawGrid = () => {
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
// ########################################

const drawSnake = () => {
  let
    startX, startY;

  sceneCtx.strokeStyle = "red";
  sceneCtx.fillStyle = "yellow";
  // for (const { start: { x: startX, y: startY}, end: { x: endX, y: endY } } of snake) {
  for (const { x: xCoord, y: yCoord } of Snake) {
    /*
      x_pos: (X_COORD - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX
      y_pos: (Y_COORD - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX
    */
    startX = (xCoord - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX;
    startY = (yCoord - 1) * CELL_SIZE + CANVAS_VERTPAD + LINE_WIDTH_FIX;
    sceneCtx.beginPath();
    sceneCtx.rect(startX, startY, CELL_SIZE, CELL_SIZE);
    sceneCtx.closePath();
    sceneCtx.fill();
    sceneCtx.stroke();
  }
  sceneCtx.strokeStyle = "black";
};
// ########################################

const moveSnake = () => {
  let
    prevHead = new Cell(),
    nextHead = new Cell();

  prevHead.copy(Snake[0]);
  nextHead.copy(prevHead);
  // prevHead.toString();

  switch (DIRECTION) {
    // left
    case LEFT:
      if (prevHead.x !== GRID_LEFT_BORDER) {
        nextHead.x = prevHead.x - 1;
      } else {
        console.log("snake head === GRID_LB");
        nextHead.x = GRID_RIGHT_BORDER;
      }
      break;

    // right
    case RIGHT:
      if (prevHead.x !== GRID_RIGHT_BORDER) {
        nextHead.x = prevHead.x + 1;
      } else {
        console.log("snake head === GRID_RB");
        nextHead.x = GRID_LEFT_BORDER;
      }
      break;

    // top
    case TOP:
      if (prevHead.y !== GRID_TOP_BORDER) {
        nextHead.y = prevHead.y - 1;
      } else {
        console.log("snake head === GRID_TB");
        nextHead.y = GRID_BOTTOM_BORDER;
      }
      break;

    // bottom
    case BOTTOM:
      if (prevHead.y !== GRID_BOTTOM_BORDER) {
        nextHead.y = prevHead.y + 1;
      } else {
        console.log("snake head === GRID_BB");
        nextHead.y = GRID_TOP_BORDER;
      }
      break;
  }

  // nextHead.toString();

  Snake.unshift(nextHead);
  if (eatFood(nextHead)) {
    Food = createFood();
  } else {
    Snake.pop();
  }

  // printSnake(Snake);

  sceneCtx.clearRect(0, 0, gridCvs.width, gridCvs.height);
};
// ########################################

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
    console.log(`snake[${i}]: ${snake[i].x} ${snake[i].y}`);
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
  drawFood();
  drawSnake();

  // pause
  if (!PAUSE) {
    await delay(250);
    moveSnake();
  }

  requestAnimationFrame(gameloop);
};

document.addEventListener("keydown", changeDirection);

drawGrid();
gameloop();

