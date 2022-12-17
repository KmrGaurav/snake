const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

const appleCount = document.getElementById('apple-count')! as HTMLParagraphElement;
const level = document.getElementById('level')! as HTMLParagraphElement;
const snakesLengthElement = document.getElementById('snakes-length')! as HTMLParagraphElement;
const score = document.getElementById('score')! as HTMLParagraphElement;
const best = document.getElementById('best')! as HTMLParagraphElement;

const snakesJumpsAvailableElement = document.getElementById(
    'snakes-jumps-available'
)! as HTMLParagraphElement;
const snakesScissorsAvailableElement = document.getElementById(
    'snakes-scissors-available'
)! as HTMLParagraphElement;

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

function getSnakesInitialOccupiedUnits() {
    return [
        { x: 2, y: 7 },
        { x: 2, y: 6 },
        { x: 2, y: 5 },
        { x: 2, y: 4 },
        { x: 2, y: 3 },
    ];
}

restart.onclick = function () {
    gameState.isGameRunning = true;
    restart.style.visibility = 'hidden';

    eventManager.event = Direction.Down;
    gameState.snake.direction = Direction.Down;
    gameState.snake.occupiedUnits = getSnakesInitialOccupiedUnits();
    gameState.apple.position = getUnOccupiedCoordinate([]);
    gameState.time.frameTime = 900;

    gameState.snake.appleCount = 0;
    gameState.level = 1;
    gameState.score = 0;

    gameState.snake.jumpsAvailable = 0;
    gameState.snake.scissorsAvailable = 0;

    setAppleCount();
    setLevel();
    setScore();
    setSnakesJumpCount();
    setSnakesScissorCount();
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
    time: {
        frameTime: 900,
        last: 0,
    },
    unitSize: 40,
    dimenstions: {
        width: 20,
        height: 15,
    },
    snake: {
        direction: Direction.Down,
        occupiedUnits: getSnakesInitialOccupiedUnits(),
        color: `rgb(100, 150, 100)`,
        appleCount: 0,
        jumpsAvailable: 0,
        scissorsAvailable: 0,
    },
    level: 1,
    score: 0,
    apple: {
        position: getUnOccupiedCoordinate(getSnakesInitialOccupiedUnits()),
        color: `rgb(150, 100, 100)`,
    },
    jump: {
        position: { x: 0, y: 0 },
        color: 'red',
        timeLeft: 0,
    },
    scissor: {
        position: { x: 0, y: 0 },
        color: 'black',
        timeLeft: 0,
    },
};

function setAppleCount() {
    appleCount.textContent = 'Apple Count: ' + gameState.snake.appleCount.toString();
}

function setLevel() {
    level.textContent = 'Level: ' + gameState.level.toString();
}

function setSnakesLength() {
    snakesLengthElement.textContent = 'Length: ' + gameState.snake.occupiedUnits.length;
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

function setSnakesScissorCount() {
    snakesScissorsAvailableElement.textContent =
        'Scissors Available: ' + gameState.snake.scissorsAvailable;
}

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

            gameState.score += 10 * gameState.level;

            gameState.snake.appleCount++;

            if (gameState.snake.appleCount < 5) {
                gameState.time.frameTime = 900;
                gameState.level = 1;
            } else if (gameState.snake.appleCount < 10) {
                gameState.time.frameTime = 700;
                gameState.level = 2;
            } else if (gameState.snake.appleCount < 15) {
                gameState.time.frameTime = 500;
                gameState.level = 3;
            } else if (gameState.snake.appleCount < 20) {
                gameState.time.frameTime = 300;
                gameState.level = 4;
            } else if (gameState.snake.appleCount < 30) {
                gameState.time.frameTime = 200;
                gameState.level = 5;
            } else if (gameState.snake.appleCount < 40) {
                gameState.time.frameTime = 150;
                gameState.level = 6;
            } else {
                gameState.time.frameTime = 100;
                gameState.level = 7;
            }

            setAppleCount();
            setLevel();
            setSnakesLength();
            setScore();

            if (gameState.jump.timeLeft === 0 && gameState.scissor.timeLeft === 0) {
                const random = Math.floor(Math.random() * 100);
                if (random % 20 === 0) {
                    gameState.scissor.position = getUnOccupiedCoordinate([
                        ...gameState.snake.occupiedUnits,
                        gameState.apple.position,
                    ]);
                    gameState.scissor.timeLeft = 20;
                } else if (random % 10 === 0) {
                    gameState.jump.position = getUnOccupiedCoordinate([
                        ...gameState.snake.occupiedUnits,
                        gameState.apple.position,
                    ]);
                    gameState.jump.timeLeft = 20;
                }
            }
        } else {
            gameState.snake.occupiedUnits.pop();
        }

        if (gameState.jump.timeLeft) {
            const jumpsCoordinate = gameState.jump.position;
            if (head.x === jumpsCoordinate.x && head.y === jumpsCoordinate.y) {
                gameState.score += 2 * gameState.jump.timeLeft * gameState.level;
                setScore();

                gameState.jump.timeLeft = 0;
                gameState.snake.jumpsAvailable++;
                setSnakesJumpCount();
            }
        } else if (gameState.scissor.timeLeft) {
            const scissorsCoordinate = gameState.scissor.position;
            if (head.x === scissorsCoordinate.x && head.y === scissorsCoordinate.y) {
                gameState.score += 3 * gameState.scissor.timeLeft * gameState.level;
                setScore();

                gameState.scissor.timeLeft = 0;
                gameState.snake.scissorsAvailable++;
                setSnakesScissorCount();
            }
        }

        for (let i = 4; i < gameState.snake.occupiedUnits.length; i++) {
            if (
                head.x === gameState.snake.occupiedUnits[i].x &&
                head.y === gameState.snake.occupiedUnits[i].y
            ) {
                if (gameState.snake.jumpsAvailable && gameState.snake.scissorsAvailable) {
                    if (i > gameState.snake.occupiedUnits.length / 2) {
                        gameState.snake.jumpsAvailable--;
                        setSnakesJumpCount();
                    } else {
                        gameState.score += (gameState.snake.occupiedUnits.length - i) * 20;
                        setScore();
                        gameState.snake.occupiedUnits = gameState.snake.occupiedUnits.slice(0, i);
                        setSnakesLength();
                        gameState.score += (gameState.snake.occupiedUnits.length - i) * 20;
                        setScore();

                        gameState.snake.scissorsAvailable--;
                        setSnakesScissorCount();
                    }
                } else if (gameState.snake.jumpsAvailable) {
                    gameState.snake.jumpsAvailable--;
                    setSnakesJumpCount();
                } else if (gameState.snake.scissorsAvailable) {
                    gameState.score += (gameState.snake.occupiedUnits.length - i) * 20;
                    setScore();
                    gameState.snake.occupiedUnits = gameState.snake.occupiedUnits.slice(0, i);
                    setSnakesLength();
                    gameState.score += (gameState.snake.occupiedUnits.length - i) * 20;
                    setScore();

                    gameState.snake.scissorsAvailable--;
                    setSnakesScissorCount();
                } else {
                    gameState.isGameRunning = false;
                    restart.style.visibility = 'visible';
                }
            }
        }

        const localBest = window.localStorage.getItem('best')!;
        if (parseInt(localBest) < gameState.score) {
            window.localStorage.setItem('best', gameState.score.toString());
            setBest();
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
            gameState.snake.color
        );
    }
}

function drawApple() {
    drawRectangle(
        gameState.apple.position.x * gameState.unitSize,
        gameState.apple.position.y * gameState.unitSize,
        gameState.unitSize,
        gameState.unitSize,
        gameState.apple.color
    );
}

function drawJump() {
    drawRectangle(
        gameState.jump.position.x * gameState.unitSize,
        gameState.jump.position.y * gameState.unitSize,
        gameState.unitSize,
        gameState.unitSize,
        gameState.jump.color
    );
}

function drawScissor() {
    drawRectangle(
        gameState.scissor.position.x * gameState.unitSize,
        gameState.scissor.position.y * gameState.unitSize,
        gameState.unitSize,
        gameState.unitSize,
        gameState.scissor.color
    );
}

function draw() {
    drawSnake();
    drawApple();
    if (gameState.jump.timeLeft) {
        drawJump();
        gameState.jump.timeLeft--;
    }
    if (gameState.scissor.timeLeft) {
        drawScissor();
        gameState.scissor.timeLeft--;
    }
}

(function initializeGame() {
    setAppleCount();
    setLevel();
    setSnakesLength();
    setScore();
    const localBest = window.localStorage.getItem('best');
    if (localBest === null) {
        window.localStorage.setItem('best', '0');
    }
    setBest();
    setSnakesJumpCount();
    setSnakesScissorCount();
})();

(function gameLoop(now: number) {
    const delta = now - gameState.time.last;
    if (delta > gameState.time.frameTime) {
        eventManager.handleEvents();
        update();
        context.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        gameState.time.last = now;
    }
    window.requestAnimationFrame(gameLoop);
})(0);
