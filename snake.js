// jshint esversion: 6

const
  gridCvs = document.getElementById("grid"),
  gridCtx = gridCvs.getContext("2d"),
  sceneCvs = document.getElementById("scene"),
  sceneCtx = sceneCvs.getContext("2d");

let
  cvsWidth  = gridCvs.width  = sceneCvs.width  = 670,
  cvsHeight = gridCvs.height = sceneCvs.height = 480;

const lineWidthFix = 0.5;

let
  cell = 19, // cell size
  cvsVP = 2, // gridCvs vertical padding
  cvsHP = 2; // gridCvs horizontal padding

// grid size __35x25__
let drawGrid = () => {
  // vertical lines, 35boxes
  for (let w = cvsHP; w <= gridCvs.width; w += 19) {
    gridCtx.moveTo(w + 0.5, cvsVP);
    gridCtx.lineTo(w + 0.5, gridCvs.height - cvsVP);
  }

  // horizontal lines, 25boxes
  for (let h = cvsVP; h <= gridCvs.height; h += 19) {
    gridCtx.moveTo(cvsHP, h + 0.5);
    gridCtx.lineTo(gridCvs.width - cvsHP, h + 0.5);
  }

  gridCtx.stroke();
};

let snake =
  [
    { start:
      {
        x: cvsHP,
        y: cvsVP
      },
      end:
      {
        x: cvsHP + cell,
        y: cvsVP + cell
      }
    },
    { start:
      {
        x: cvsHP + cell,
        y: cvsVP
      },
      end:
      {
        x: cvsHP + 2 * cell,
        y: cvsVP + cell
      }
    },
    {
      start:
      {
        x: cvsHP + 2 * cell,
        y: cvsVP
      },
      end:
      {
        x: cvsHP + 3 * cell,
        y: cvsVP + cell
      }
    }
  ];

const drawSnake = () => {
  sceneCtx.strokeStyle = "red";
  sceneCtx.fillStyle = "yellow";
  for (const { start: { x: startX, y: startY}, end: { x: endX, y: endY } } of snake) {
    // console.table([["start", startX, startY], ["end", endX, endY]]);
    sceneCtx.beginPath();
    sceneCtx.rect(startX + lineWidthFix, startY + lineWidthFix, cell, cell);
    sceneCtx.closePath();
    sceneCtx.fill();
    sceneCtx.stroke();
  }
  sceneCtx.strokeStyle = "black";
};

const moveSnake = () => {
  let prevHead, nextHead;
  prevHead = snake[snake.length - 1];
  // console.log("pHead: ", prevHead);
  nextHead = {
    start: {
      x: prevHead.start.x + cell,
      y: prevHead.start.y
    },
    end: {
      x: prevHead.end.x + cell,
      y: prevHead.end.y
    }
  };
  // console.log(nextHead);
  snake.push(nextHead);
  snake.shift();
  // console.log(snake);

  sceneCtx.clearRect(0, 0, gridCvs.width, gridCvs.height);
  drawSnake();
};

let counter = 0;

const delay = (n) => {
  n = n || 2000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n);
  });
}

const gameloop = async () => {
  drawSnake();

  if (++counter <= 30) {
    await delay(500);
    moveSnake();
    console.log("gameloop: ", counter);
  }

  requestAnimationFrame(gameloop);
};

drawGrid();
gameloop();