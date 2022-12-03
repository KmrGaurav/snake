const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;
const restart = document.getElementById('restart')! as HTMLButtonElement;

function getUnOccupiedCoordinate(occupiedUnits: { x: number; y: number }[]) {
    const occupiedUnitsIndexes = [];
    for (let i = 0; i < occupiedUnits.length; i++) {
        occupiedUnitsIndexes.push(occupiedUnits[i].x + occupiedUnits[i].y * 20);
    }

    let random = null;
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
};

canvas.width = 800;
canvas.height = 600;

enum Direction {
    Up,
    Left,
    Right,
    Down,
}

const gameState = {
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
    },
    apple: {
        position: getUnOccupiedCoordinate([]),
    },
};

const eventManager = {
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

document.addEventListener('keydown', (event) => {
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
        const head = {
            x: gameState.snake.occupiedUnits[0].x,
            y: gameState.snake.occupiedUnits[0].y,
        };

        switch (gameState.snake.direction) {
            case Direction.Up:
                if (head.y === 0) {
                    head.y = gameState.dimenstions.height - 1;
                } else {
                    head.y--;
                }
                break;
            case Direction.Left:
                if (head.x === 0) {
                    head.x = gameState.dimenstions.width - 1;
                } else {
                    head.x--;
                }
                break;
            case Direction.Right:
                if ((head.x + 1) % gameState.dimenstions.width === 0) {
                    head.x = 0;
                } else {
                    head.x++;
                }
                break;
            case Direction.Down:
                if ((head.y + 1) % gameState.dimenstions.height === 0) {
                    head.y = 0;
                } else {
                    head.y++;
                }
                break;
        }

        gameState.snake.occupiedUnits.unshift({ x: head.x, y: head.y });

        const apple = gameState.apple.position;
        if (head.x === apple.x && head.y === apple.y) {
            gameState.apple.position = getUnOccupiedCoordinate(gameState.snake.occupiedUnits);
        } else {
            gameState.snake.occupiedUnits.pop();
        }

        for (let i = 4; i < gameState.snake.occupiedUnits.length; i++) {
            if (
                head.x === gameState.snake.occupiedUnits[i].x &&
                head.y === gameState.snake.occupiedUnits[i].y
            ) {
                gameState.isGameRunning = false;
                restart.style.visibility = 'visible';
            }
        }
    }
}

function drawRectangle(x: number, y: number, w: number, h: number, color: string) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawSnake() {
    for (let i = 0; i < gameState.snake.occupiedUnits.length; i++) {
        drawRectangle(
            gameState.snake.occupiedUnits[i].x * gameState.unitSize,
            gameState.snake.occupiedUnits[i].y * gameState.unitSize,
            gameState.unitSize,
            gameState.unitSize,
            `rgb(150, 250, 150)`
        );
    }
}

function drawApple() {
    const apple = gameState.apple.position;
    drawRectangle(
        apple.x * gameState.unitSize,
        apple.y * gameState.unitSize,
        gameState.unitSize,
        gameState.unitSize,
        `rgb(250, 150, 150)`
    );
}

function draw() {
    drawSnake();
    drawApple();
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
