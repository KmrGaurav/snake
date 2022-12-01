"use strict";
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Left"] = 1] = "Left";
    Direction[Direction["Right"] = 2] = "Right";
    Direction[Direction["Down"] = 3] = "Down";
})(Direction || (Direction = {}));
var eventManager = {
    e: Direction.Down,
    handleEvents: function () {
        switch (eventManager.e) {
            case Direction.Up:
                if (gameState.direction !== Direction.Down) {
                    gameState.direction = Direction.Up;
                }
                break;
            case Direction.Left:
                if (gameState.direction !== Direction.Right) {
                    gameState.direction = Direction.Left;
                }
                break;
            case Direction.Right:
                if (gameState.direction !== Direction.Left) {
                    gameState.direction = Direction.Right;
                }
                break;
            case Direction.Down:
                if (gameState.direction !== Direction.Up) {
                    gameState.direction = Direction.Down;
                }
                break;
        }
    },
};
var gameState = {
    unitSize: 40,
    direction: Direction.Down,
    frameTime: 900,
    head: {
        x: 2,
        y: 7,
    },
    last: 0,
    snakeOccupiedUnits: [
        { x: 2, y: 7 },
        { x: 2, y: 6 },
        { x: 2, y: 5 },
        { x: 2, y: 4 },
        { x: 2, y: 3 },
    ],
};
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            eventManager.e = Direction.Up;
            break;
        case 'ArrowLeft':
            eventManager.e = Direction.Left;
            break;
        case 'ArrowRight':
            eventManager.e = Direction.Right;
            break;
        case 'ArrowDown':
            eventManager.e = Direction.Down;
            break;
    }
});
function update() {
    switch (gameState.direction) {
        case Direction.Up:
            gameState.head.y--;
            break;
        case Direction.Left:
            gameState.head.x--;
            break;
        case Direction.Right:
            gameState.head.x++;
            break;
        case Direction.Down:
            gameState.head.y++;
            break;
    }
}
function drawRectangle(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
function drawSnake() {
    for (var i = 0; i < gameState.snakeOccupiedUnits.length; i++) {
        drawRectangle(gameState.snakeOccupiedUnits[i].x * gameState.unitSize, gameState.snakeOccupiedUnits[i].y * gameState.unitSize, gameState.unitSize, gameState.unitSize, "rgb(0, 150, 0)");
    }
}
function draw() {
    drawSnake();
    gameState.snakeOccupiedUnits.unshift({ x: gameState.head.x, y: gameState.head.y });
    gameState.snakeOccupiedUnits.pop();
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
