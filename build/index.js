"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var appleCount = document.getElementById('apple-count');
var level = document.getElementById('level');
var score = document.getElementById('score');
var best = document.getElementById('best');
var snakesJumpsAvailableElement = document.getElementById('snakes-jumps-available');
var restart = document.getElementById('restart');
function getUnOccupiedCoordinate(occupiedUnits) {
    var occupiedUnitsIndexes = [];
    for (var i = 0; i < occupiedUnits.length; i++) {
        occupiedUnitsIndexes.push(occupiedUnits[i].x + occupiedUnits[i].y * 20);
    }
    var random = null;
    while (random === null || occupiedUnitsIndexes.includes(random)) {
        random = Math.floor(Math.random() * 20 * 15);
    }
    return { x: random % 20, y: Math.floor(random / 20) };
}
restart.onclick = function () {
    gameState.isGameRunning = true;
    restart.style.visibility = 'hidden';
    eventManager.event = Direction.Down;
    gameState.snake.direction = Direction.Down;
    gameState.snake.occupiedUnits = [
        { x: 2, y: 7 },
        { x: 2, y: 6 },
        { x: 2, y: 5 },
        { x: 2, y: 4 },
        { x: 2, y: 3 },
    ];
    gameState.apple.position = getUnOccupiedCoordinate([]);
    gameState.frameTime = 900;
    gameState.snake.appleCount = 0;
    gameState.level = 1;
    gameState.score = 0;
    gameState.snake.jumpsAvailable = 0;
    setAppleCount();
    setLevel();
    setScore();
    setSnakesJumpCount();
};
canvas.width = 800;
canvas.height = 600;
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Left"] = 1] = "Left";
    Direction[Direction["Right"] = 2] = "Right";
    Direction[Direction["Down"] = 3] = "Down";
})(Direction || (Direction = {}));
var gameState = {
    isGameRunning: true,
    frameTime: 900,
    last: 0,
    unitSize: 40,
    dimenstions: {
        width: 20,
        height: 15,
    },
    snake: {
        direction: Direction.Down,
        occupiedUnits: [
            { x: 2, y: 7 },
            { x: 2, y: 6 },
            { x: 2, y: 5 },
            { x: 2, y: 4 },
            { x: 2, y: 3 },
        ],
        color: "rgb(100, 150, 100)",
        appleCount: 0,
        jumpsAvailable: 0,
    },
    apple: {
        position: getUnOccupiedCoordinate([]),
        color: "rgb(150, 100, 100)",
    },
    jump: {
        position: { x: 0, y: 0 },
        color: 'red',
        timeLeft: 0,
    },
    level: 1,
    score: 0,
};
function setAppleCount() {
    appleCount.textContent = 'Apple Count: ' + gameState.snake.appleCount.toString();
}
function setLevel() {
    level.textContent = 'Level: ' + gameState.level.toString();
}
function setScore() {
    score.textContent = 'Score: ' + gameState.score.toString();
}
function setBest() {
    best.textContent = 'Best: ' + window.localStorage.getItem('best');
}
function setSnakesJumpCount() {
    snakesJumpsAvailableElement.textContent = 'Jumps Available: ' + gameState.snake.jumpsAvailable;
}
var eventManager = {
    event: Direction.Down,
    handleEvents: function () {
        switch (eventManager.event) {
            case Direction.Up:
                if (gameState.snake.direction !== Direction.Down) {
                    gameState.snake.direction = Direction.Up;
                }
                break;
            case Direction.Left:
                if (gameState.snake.direction !== Direction.Right) {
                    gameState.snake.direction = Direction.Left;
                }
                break;
            case Direction.Right:
                if (gameState.snake.direction !== Direction.Left) {
                    gameState.snake.direction = Direction.Right;
                }
                break;
            case Direction.Down:
                if (gameState.snake.direction !== Direction.Up) {
                    gameState.snake.direction = Direction.Down;
                }
                break;
        }
    },
};
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            eventManager.event = Direction.Up;
            break;
        case 'ArrowLeft':
            eventManager.event = Direction.Left;
            break;
        case 'ArrowRight':
            eventManager.event = Direction.Right;
            break;
        case 'ArrowDown':
            eventManager.event = Direction.Down;
            break;
    }
});
function update() {
    if (gameState.isGameRunning) {
        var head = {
            x: gameState.snake.occupiedUnits[0].x,
            y: gameState.snake.occupiedUnits[0].y,
        };
        switch (gameState.snake.direction) {
            case Direction.Up:
                if (head.y === 0) {
                    head.y = gameState.dimenstions.height - 1;
                }
                else {
                    head.y--;
                }
                break;
            case Direction.Left:
                if (head.x === 0) {
                    head.x = gameState.dimenstions.width - 1;
                }
                else {
                    head.x--;
                }
                break;
            case Direction.Right:
                if ((head.x + 1) % gameState.dimenstions.width === 0) {
                    head.x = 0;
                }
                else {
                    head.x++;
                }
                break;
            case Direction.Down:
                if ((head.y + 1) % gameState.dimenstions.height === 0) {
                    head.y = 0;
                }
                else {
                    head.y++;
                }
                break;
        }
        gameState.snake.occupiedUnits.unshift({ x: head.x, y: head.y });
        var apple = gameState.apple.position;
        if (head.x === apple.x && head.y === apple.y) {
            gameState.apple.position = getUnOccupiedCoordinate(gameState.snake.occupiedUnits);
            gameState.snake.appleCount++;
            if (gameState.snake.appleCount < 5) {
                gameState.frameTime = 900;
                gameState.level = 1;
            }
            else if (gameState.snake.appleCount < 10) {
                gameState.frameTime = 700;
                gameState.level = 2;
            }
            else if (gameState.snake.appleCount < 15) {
                gameState.frameTime = 500;
                gameState.level = 3;
            }
            else if (gameState.snake.appleCount < 20) {
                gameState.frameTime = 300;
                gameState.level = 4;
            }
            else if (gameState.snake.appleCount < 30) {
                gameState.frameTime = 200;
                gameState.level = 5;
            }
            else if (gameState.snake.appleCount < 40) {
                gameState.frameTime = 150;
                gameState.level = 6;
            }
            else {
                gameState.frameTime = 100;
                gameState.level = 7;
            }
            if (gameState.snake.appleCount <= 5) {
                gameState.score += 10;
            }
            else if (gameState.snake.appleCount <= 10) {
                gameState.score += 20;
            }
            else if (gameState.snake.appleCount <= 15) {
                gameState.score += 30;
            }
            else if (gameState.snake.appleCount <= 20) {
                gameState.score += 40;
            }
            else if (gameState.snake.appleCount <= 30) {
                gameState.score += 50;
            }
            else if (gameState.snake.appleCount <= 40) {
                gameState.score += 60;
            }
            else {
                gameState.score += 70;
            }
            setAppleCount();
            setLevel();
            setScore();
            if (gameState.jump.timeLeft === 0) {
                if (Math.floor(Math.random() * 100) % 10 === 0) {
                    gameState.jump.position = getUnOccupiedCoordinate(__spreadArray(__spreadArray([], gameState.snake.occupiedUnits, true), [
                        gameState.apple.position,
                    ], false));
                    gameState.jump.timeLeft = 20;
                }
            }
        }
        else {
            gameState.snake.occupiedUnits.pop();
        }
        var jumpsCoordinate = gameState.jump.position;
        if (head.x === jumpsCoordinate.x && head.y === jumpsCoordinate.y) {
            gameState.jump.timeLeft = 0;
            gameState.snake.jumpsAvailable++;
            setSnakesJumpCount();
        }
        for (var i = 4; i < gameState.snake.occupiedUnits.length; i++) {
            if (head.x === gameState.snake.occupiedUnits[i].x &&
                head.y === gameState.snake.occupiedUnits[i].y) {
                if (gameState.snake.jumpsAvailable === 0) {
                    gameState.isGameRunning = false;
                    restart.style.visibility = 'visible';
                }
                else {
                    gameState.snake.jumpsAvailable--;
                    setSnakesJumpCount();
                }
            }
        }
        var localBest = window.localStorage.getItem('best');
        if (parseInt(localBest) < gameState.score) {
            window.localStorage.setItem('best', gameState.score.toString());
            setBest();
        }
    }
}
function drawRectangle(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
function drawSnake() {
    for (var i = 0; i < gameState.snake.occupiedUnits.length; i++) {
        drawRectangle(gameState.snake.occupiedUnits[i].x * gameState.unitSize, gameState.snake.occupiedUnits[i].y * gameState.unitSize, gameState.unitSize, gameState.unitSize, gameState.snake.color);
    }
}
function drawApple() {
    var apple = gameState.apple.position;
    drawRectangle(apple.x * gameState.unitSize, apple.y * gameState.unitSize, gameState.unitSize, gameState.unitSize, gameState.apple.color);
}
function drawJump() {
    var jump = gameState.jump.position;
    drawRectangle(jump.x * gameState.unitSize, jump.y * gameState.unitSize, gameState.unitSize, gameState.unitSize, "rgb(0, 255, 0)");
}
function draw() {
    drawSnake();
    drawApple();
    if (gameState.jump.timeLeft) {
        drawJump();
        gameState.jump.timeLeft--;
    }
}
(function initializeGame() {
    setAppleCount();
    setLevel();
    setScore();
    var localBest = window.localStorage.getItem('best');
    if (localBest === null) {
        window.localStorage.setItem('best', '0');
    }
    setBest();
    setSnakesJumpCount();
})();
(function gameLoop(milliSeconds) {
    if ((milliSeconds - gameState.last) % 1000 > gameState.frameTime) {
        eventManager.handleEvents();
        update();
        context.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        gameState.last = milliSeconds;
    }
    window.requestAnimationFrame(gameLoop);
})(0);
