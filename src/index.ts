const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

canvas.width = 800;
canvas.height = 600;

enum Direction {
    Up,
    Left,
    Right,
    Down,
}

const gameState = {
    frameTime: 900,
    last: 0,
    snake: {
        direction: Direction.Down,
        unitSize: 40,
        occupiedUnits: [
            { x: 2, y: 7 },
            { x: 2, y: 6 },
            { x: 2, y: 5 },
            { x: 2, y: 4 },
            { x: 2, y: 3 },
            { x: 2, y: 2 },
            { x: 2, y: 1 },
            { x: 2, y: 0 },
            // { x: 2, y: -1 },
        ],
    },
};

const eventManager = {
    e: Direction.Down,
    handleEvents: function () {
        switch (eventManager.e) {
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

document.addEventListener('keydown', (event) => {
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
    const head = {
        x: gameState.snake.occupiedUnits[0].x,
        y: gameState.snake.occupiedUnits[0].y,
    };

    switch (gameState.snake.direction) {
        case Direction.Up:
            head.y--;
            break;
        case Direction.Left:
            head.x--;
            break;
        case Direction.Right:
            head.x++;
            break;
        case Direction.Down:
            head.y++;
            break;
    }

    gameState.snake.occupiedUnits.unshift({ x: head.x, y: head.y });
    gameState.snake.occupiedUnits.pop();
}

function drawRectangle(x: number, y: number, w: number, h: number, color: string) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawSnake() {
    for (let i = 0; i < gameState.snake.occupiedUnits.length; i++) {
        drawRectangle(
            gameState.snake.occupiedUnits[i].x * gameState.snake.unitSize,
            gameState.snake.occupiedUnits[i].y * gameState.snake.unitSize,
            gameState.snake.unitSize,
            gameState.snake.unitSize,
            `rgb(0, 150, 0)`
        );
    }
}

function draw() {
    drawSnake();
}

(function gameLoop(milliSeconds: number) {
    if ((milliSeconds - gameState.last) % 1000 > gameState.frameTime) {
        eventManager.handleEvents();
        update();
        context.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        gameState.last = milliSeconds;
    }
    window.requestAnimationFrame(gameLoop);
})(0);
