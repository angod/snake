// jshint esversion: 8

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
  CANVAS_HORIZPAD = 2, // gridCvs horizontal padding
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
const
  RIGHT  = 1,
  BOTTOM = 2,
  LEFT   = 3,
  TOP    = 4;

const
  FOOD_COLOR = "#27ae60",
  SNAKE_HEAD_COLOR = "red",
  SNAKE_SEGMENT_COLOR = "black",
  SEGMENT_BORDER_COLOR = "black"

let
  PAUSE  = false,
  SNAKE_LOCK_DIRECTION_CHANGE = false;
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

const getRandomCell = () => {
  return new Cell(
    getRandom(1, GRID_WIDTH),
    getRandom(1, GRID_HEIGHT)
  );
};
// ########################################

const isSnakeSegment = (cell) => {
  return !!Snake.find( (el) => el.x === cell.x && el.y === cell.y);
};
// ########################################

const foodCreate = () => {
  let
    newFood = getRandomCell();

  while (isSnakeSegment(newFood)) {
    console.log("newFood isSnakeSegment: ", newFood.x, newFood.y);
    newFood = getRandomCell();
  }

  return newFood;
};
// ########################################

const foodEat = (head) => {
  if (head.equals(Food)) {
    return true;
  }

  return false;
};
// ########################################

let
  Food = foodCreate();
// ########################################

const cellDraw = (x, y, size, fill) => {
  sceneCtx.strokeStyle = SEGMENT_BORDER_COLOR;
  sceneCtx.fillStyle = fill;

  sceneCtx.beginPath();
  // sceneCtx.rect(x, y, size, size);
  sceneCtx.rect(x + 2, y + 2, size - 4, size - 4);
  sceneCtx.closePath();
  sceneCtx.fill();
  sceneCtx.stroke();
};
// ########################################

const foodDraw = () => {
  let
    startX, startY;

  /*
    x_pos: (X_COORD - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX
    y_pos: (Y_COORD - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX
  */
  startX = (Food.x - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX;
  startY = (Food.y - 1) * CELL_SIZE + CANVAS_VERTPAD + LINE_WIDTH_FIX;
  cellDraw(startX, startY, CELL_SIZE, FOOD_COLOR);

  // restore default stroke: "black"
  sceneCtx.strokeStyle = "black";
};
// ########################################

const snakeDraw = () => {
  let
    startX, startY;

  startX = (Snake[0].x - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX;
  startY = (Snake[0].y - 1) * CELL_SIZE + CANVAS_VERTPAD + LINE_WIDTH_FIX;
  cellDraw(startX, startY, CELL_SIZE, SNAKE_HEAD_COLOR);
  for (let index = 1; index < Snake.length; index++) {
    /*
      x_pos: (X_COORD - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX
      y_pos: (Y_COORD - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX
    */
    startX = (Snake[index].x - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX;
    startY = (Snake[index].y - 1) * CELL_SIZE + CANVAS_VERTPAD + LINE_WIDTH_FIX;

    cellDraw(startX, startY, CELL_SIZE, SNAKE_SEGMENT_COLOR);
  }

  // Snake.forEach( (segment, index) => {
  //   startX = (segment.x - 1) * CELL_SIZE + CANVAS_HORIZPAD + LINE_WIDTH_FIX;
  //   startY = (segment.y - 1) * CELL_SIZE + CANVAS_VERTPAD + LINE_WIDTH_FIX;
  //   cellDraw(startX, startY, CELL_SIZE, SNAKE_SEGMENT_COLOR);
  // });

  // restore default stroke: "black"
  sceneCtx.strokeStyle = "black";
};
// ########################################

// grid size __35x25__
const gridDraw = () => {
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

const snakeHeading = () => {
  let
    prevHead = new Cell(),
    nextHead = new Cell();

  prevHead.copy(Snake[0]);
  nextHead.copy(prevHead);
  // nextHead.copy(Snake[0]);
  // prevHead.toString();

  switch (DIRECTION) {
    // left
    case LEFT:
      if (prevHead.x !== GRID_LEFT_BORDER) {
        nextHead.x = prevHead.x - 1;
      } else {
        // console.log("snake head === GRID_LB");
        nextHead.x = GRID_RIGHT_BORDER;
      }
      break;

    // right
    case RIGHT:
      if (prevHead.x !== GRID_RIGHT_BORDER) {
        nextHead.x = prevHead.x + 1;
      } else {
        // console.log("snake head === GRID_RB");
        nextHead.x = GRID_LEFT_BORDER;
      }
      break;

    // top
    case TOP:
      if (prevHead.y !== GRID_TOP_BORDER) {
        nextHead.y = prevHead.y - 1;
      } else {
        // console.log("snake head === GRID_TB");
        nextHead.y = GRID_BOTTOM_BORDER;
      }
      break;

    // bottom
    case BOTTOM:
      if (prevHead.y !== GRID_BOTTOM_BORDER) {
        nextHead.y = prevHead.y + 1;
      } else {
        // console.log("snake head === GRID_BB");
        nextHead.y = GRID_TOP_BORDER;
      }
      break;
  }

  // nextHead.toString();
  if (isSnakeSegment(nextHead)) {
    // alert("game over");
    restart();

    return;
  }

  Snake.unshift(nextHead);
  if (foodEat(nextHead)) {
    Food = foodCreate();
  } else {
    Snake.pop();
  }

  // snakePrint(Snake);
};
// ########################################

const sceneClear = () => {
  sceneCtx.clearRect(0, 0, gridCvs.width, gridCvs.height);
};
// ########################################

// draw scene objects
const sceneDraw = () => {
  snakeDraw();
  foodDraw();
};
// ########################################

const sceneRedraw = () => {
  sceneClear();
  sceneDraw();
};
// ########################################

const directionChange = (e) => {
  // console.log(e.code);

  if (e.code === "Space") PAUSE = !PAUSE;
  // console.log("pause:", PAUSE ? "on" : "off");

  if (!PAUSE && !SNAKE_LOCK_DIRECTION_CHANGE) {
    let newDirection;
    switch (e.code) {
      case "ArrowLeft":
        newDirection = LEFT;
        break;

      case "ArrowRight":
        newDirection = RIGHT;
        break;

      case "ArrowUp":
        newDirection = TOP;
        break;

      case "ArrowDown":
        newDirection = BOTTOM;
        break;
    } // endswitch

    if (newDirection && newDirection !== DIRECTION && Math.abs(newDirection - DIRECTION) !== 2) {
      DIRECTION = newDirection;
      SNAKE_LOCK_DIRECTION_CHANGE = true;
    }
  } // endif

  // console.log(`DIRECTION: ${DIRECTION}`);
};
// ########################################

const snakePrint = (snake) => {
  for (let i = 0; i < snake.length; i++) {
    console.log(`snake[${i}]: ${snake[i].x} ${snake[i].y}`);
  }
  console.log("##############################################");
};
// ########################################

const delay = (n) => {
  // 1000ms = 1s
  n = n || 1000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n);
  });
};
// ########################################

const gameloop = async () => {
  // await delay(100);
  // await delay(125);
  // await delay(150);
  await delay(175);
  // await delay(200);
  // await delay(225);
  // await delay(250);
  // await delay(500);
  // await delay(750);
  // await delay(1000);

  if (!PAUSE) {
    if (SNAKE_LOCK_DIRECTION_CHANGE) {
      // console.log("in gameloop:", performance.now());
      SNAKE_LOCK_DIRECTION_CHANGE = !SNAKE_LOCK_DIRECTION_CHANGE;
    }

    snakeHeading();
    sceneRedraw();
  }

  requestAnimationFrame(gameloop);
};
// ########################################

const init = () => {
  document.addEventListener("keydown", directionChange);

  gridDraw();
  sceneDraw();

  gameloop();
};
// ########################################

const restart = () => {
  Snake = [
    new Cell(3, 1),
    new Cell(2, 1),
    new Cell(1, 1)
  ];

  DIRECTION = RIGHT;
  PAUSE = true;
};
// ########################################


// everything start here
init();

