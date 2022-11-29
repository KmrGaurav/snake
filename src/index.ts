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

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            gameState.direction = Direction.Up;
            break;
        case 'ArrowLeft':
            gameState.direction = Direction.Left;
            break;
        case 'ArrowRight':
            gameState.direction = Direction.Right;
            break;
        case 'ArrowDown':
            gameState.direction = Direction.Down;
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

function drawRectangle(x: number, y: number, w: number, height: number, color: string) {
    context.fillRect(x, y, gameState.unitSize, gameState.unitSize);
    context.fillStyle = color;
    context.fill();
}

function drawSnake() {
    for (let i = 0; i < gameState.snakeOccupiedUnits.length; i++) {
        drawRectangle(
            gameState.snakeOccupiedUnits[i].x * gameState.unitSize,
            gameState.snakeOccupiedUnits[i].y * gameState.unitSize,
            gameState.unitSize,
            gameState.unitSize,
            `rgb(0, 150, 0)`
        );
    }
}

function draw() {
    drawSnake();

    gameState.snakeOccupiedUnits.unshift({ x: gameState.head.x, y: gameState.head.y });
    gameState.snakeOccupiedUnits.pop();
    // console.log(snakeOccupiedUnits);
}

(function gameLoop(milliSeconds: number) {
    if ((milliSeconds - gameState.last) % 1000 > gameState.frameTime) {
        update();
        context.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        gameState.last = milliSeconds;
    }
    window.requestAnimationFrame(gameLoop);
})(0);
