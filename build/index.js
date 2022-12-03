"use strict";
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var restart = document.getElementById('restart');
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
    gameState.apple.position = (function () {
        var random = Math.floor(Math.random() * 20 * 15);
        return { x: random % 20, y: Math.floor(random / 20) };
    })();
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
    snake: {
        direction: Direction.Down,
        occupiedUnits: [
            { x: 2, y: 7 },
            { x: 2, y: 6 },
            { x: 2, y: 5 },
            { x: 2, y: 4 },
            { x: 2, y: 3 },
            // { x: 2, y: 2 },
            // { x: 2, y: 1 },
            // { x: 2, y: 0 },
            // { x: 2, y: -1 },
        ],
    },
    apple: {
        position: (function () {
            var random = Math.floor(Math.random() * 20 * 15);
            return { x: random % 20, y: Math.floor(random / 20) };
        })(),
    },
};
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
                    head.y = 14;
                }
                else {
                    head.y--;
                }
                break;
            case Direction.Left:
                if (head.x === 0) {
                    head.x = 19;
                }
                else {
                    head.x--;
                }
                break;
            case Direction.Right:
                if ((head.x + 1) % 20 === 0) {
                    head.x = 0;
                }
                else {
                    head.x++;
                }
                break;
            case Direction.Down:
                if ((head.y + 1) % 15 === 0) {
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
            gameState.apple.position = getUnOccupiedCoordinate();
        }
        else {
            gameState.snake.occupiedUnits.pop();
        }
        for (var i = 4; i < gameState.snake.occupiedUnits.length; i++) {
            if (head.x === gameState.snake.occupiedUnits[i].x &&
                head.y === gameState.snake.occupiedUnits[i].y) {
                gameState.isGameRunning = false;
                restart.style.visibility = 'visible';
            }
        }
    }
}
function drawRectangle(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
function drawSnake() {
    for (var i = 0; i < gameState.snake.occupiedUnits.length; i++) {
        drawRectangle(gameState.snake.occupiedUnits[i].x * gameState.unitSize, gameState.snake.occupiedUnits[i].y * gameState.unitSize, gameState.unitSize, gameState.unitSize, "rgb(150, 250, 150)");
    }
}
function getUnOccupiedCoordinate() {
    var occupiedUnitsArray = [];
    var occupiedUnits = gameState.snake.occupiedUnits;
    for (var i = 0; i < occupiedUnits.length; i++) {
        occupiedUnitsArray.push(occupiedUnits[i].x + occupiedUnits[i].y * 20);
    }
    var random = null;
    while (random === null || occupiedUnitsArray.includes(random)) {
        random = Math.floor(Math.random() * 20 * 15);
    }
    return { x: random % 20, y: Math.floor(random / 20) };
}
function drawApple() {
    var apple = gameState.apple.position;
    drawRectangle(apple.x * gameState.unitSize, apple.y * gameState.unitSize, gameState.unitSize, gameState.unitSize, "rgb(250, 150, 150)");
}
function draw() {
    drawSnake();
    drawApple();
}
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