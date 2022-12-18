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

type Unit = {
    x: number;
    y: number;
    direction: Direction;
    kind: Kind;
};

function getSnakesInitialOccupiedUnits(): Unit[] {
    return [
        { x: 2, y: 7, direction: Direction.Down, kind: Kind.Vertical },
        { x: 2, y: 6, direction: Direction.Down, kind: Kind.Vertical },
        { x: 2, y: 5, direction: Direction.Down, kind: Kind.Vertical },
        { x: 2, y: 4, direction: Direction.Down, kind: Kind.Vertical },
        { x: 2, y: 3, direction: Direction.Down, kind: Kind.Vertical },
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

function getImage(srcPath: string) {
    const image = new Image();
    image.src = srcPath;
    return image;
}

enum Direction {
    Up,
    Left,
    Right,
    Down,
}

enum Kind {
    Vertical,
    Horizontal,
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
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
        images: {
            head: {
                up: getImage('assets/head_up.png'),
                left: getImage('assets/head_left.png'),
                right: getImage('assets/head_right.png'),
                down: getImage('assets/head_down.png'),
            },
            body: {
                horizontal: getImage('assets/body_horizontal.png'),
                vertical: getImage('assets/body_vertical.png'),
                topLeft: getImage('assets/body_topleft.png'),
                topRight: getImage('assets/body_topright.png'),
                bottomLeft: getImage('assets/body_bottomleft.png'),
                bottomRight: getImage('assets/body_bottomright.png'),
            },
            tail: {
                up: getImage('assets/tail_up.png'),
                left: getImage('assets/tail_left.png'),
                right: getImage('assets/tail_right.png'),
                down: getImage('assets/tail_down.png'),
            },
        },
    },
    level: 1,
    score: 0,
    apple: {
        position: getUnOccupiedCoordinate(getSnakesInitialOccupiedUnits()),
        // color: `rgb(150, 100, 100)`,
        image: getImage('assets/apple.png'),
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
        const newHead = {
            x: gameState.snake.occupiedUnits[0].x,
            y: gameState.snake.occupiedUnits[0].y,
        } as Unit;

        switch (gameState.snake.direction) {
            case Direction.Up:
                if (newHead.y === 0) {
                    newHead.y = gameState.dimenstions.height - 1;
                } else {
                    newHead.y--;
                }
                newHead.direction = Direction.Up;
                newHead.kind = Kind.Vertical;
                break;
            case Direction.Left:
                if (newHead.x === 0) {
                    newHead.x = gameState.dimenstions.width - 1;
                } else {
                    newHead.x--;
                }
                newHead.direction = Direction.Left;
                newHead.kind = Kind.Horizontal;
                break;
            case Direction.Right:
                if ((newHead.x + 1) % gameState.dimenstions.width === 0) {
                    newHead.x = 0;
                } else {
                    newHead.x++;
                }
                newHead.direction = Direction.Right;
                newHead.kind = Kind.Horizontal;
                break;
            case Direction.Down:
                if ((newHead.y + 1) % gameState.dimenstions.height === 0) {
                    newHead.y = 0;
                } else {
                    newHead.y++;
                }
                newHead.direction = Direction.Down;
                newHead.kind = Kind.Vertical;
                break;
        }

        /* Setting the body corners */
        let oldHead = gameState.snake.occupiedUnits[0];
        const secondUnit = gameState.snake.occupiedUnits[1];
        if (secondUnit.y === oldHead.y) {
            if (secondUnit.x + 1 === oldHead.x || secondUnit.x === oldHead.x + 19) {
                if (oldHead.y === newHead.y + 1 || oldHead.y + 14 === newHead.y) {
                    oldHead.kind = Kind.BottomRight;
                } else if (oldHead.y === newHead.y - 1 || oldHead.y - 14 === newHead.y) {
                    oldHead.kind = Kind.TopRight;
                }
            } else if (secondUnit.x - 1 === oldHead.x || secondUnit.x === oldHead.x - 19) {
                if (oldHead.y === newHead.y + 1 || oldHead.y + 14 === newHead.y) {
                    oldHead.kind = Kind.BottomLeft;
                } else if (oldHead.y === newHead.y - 1 || oldHead.y - 14 === newHead.y) {
                    oldHead.kind = Kind.TopLeft;
                }
            }
        } else {
            if (secondUnit.y + 1 === oldHead.y || secondUnit.y === oldHead.y + 14) {
                if (oldHead.x === newHead.x + 1 || oldHead.x + 19 === newHead.x) {
                    oldHead.kind = Kind.BottomRight;
                } else if (oldHead.x === newHead.x - 1 || oldHead.x - 19 === newHead.x) {
                    oldHead.kind = Kind.BottomLeft;
                }
            } else if (secondUnit.y - 1 === oldHead.y || secondUnit.y === oldHead.y - 14) {
                if (oldHead.x === newHead.x + 1 || oldHead.x + 19 === newHead.x) {
                    oldHead.kind = Kind.TopRight;
                } else if (oldHead.x === newHead.x - 1 || oldHead.x - 19 === newHead.x) {
                    oldHead.kind = Kind.TopLeft;
                }
            }
        }
        oldHead.direction = newHead.direction;
        gameState.snake.occupiedUnits[0] = oldHead;
        /* Setting the body corners */

        gameState.snake.occupiedUnits.unshift(newHead);

        const apple = gameState.apple.position;
        if (newHead.x === apple.x && newHead.y === apple.y) {
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
            if (newHead.x === jumpsCoordinate.x && newHead.y === jumpsCoordinate.y) {
                gameState.score += 2 * gameState.jump.timeLeft * gameState.level;
                setScore();

                gameState.jump.timeLeft = 0;
                gameState.snake.jumpsAvailable++;
                setSnakesJumpCount();
            }
        } else if (gameState.scissor.timeLeft) {
            const scissorsCoordinate = gameState.scissor.position;
            if (newHead.x === scissorsCoordinate.x && newHead.y === scissorsCoordinate.y) {
                gameState.score += 3 * gameState.scissor.timeLeft * gameState.level;
                setScore();

                gameState.scissor.timeLeft = 0;
                gameState.snake.scissorsAvailable++;
                setSnakesScissorCount();
            }
        }

        for (let i = 4; i < gameState.snake.occupiedUnits.length; i++) {
            if (
                newHead.x === gameState.snake.occupiedUnits[i].x &&
                newHead.y === gameState.snake.occupiedUnits[i].y
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
    function getHeadsImageAccordingToDirection() {
        switch (gameState.snake.direction) {
            case Direction.Up:
                return gameState.snake.images.head.up;
            case Direction.Left:
                return gameState.snake.images.head.left;
            case Direction.Right:
                return gameState.snake.images.head.right;
            case Direction.Down:
                return gameState.snake.images.head.down;
        }
    }

    context.drawImage(
        getHeadsImageAccordingToDirection(),
        gameState.snake.occupiedUnits[0].x * gameState.unitSize,
        gameState.snake.occupiedUnits[0].y * gameState.unitSize,
        gameState.unitSize,
        gameState.unitSize
    );

    function getBodysImage(unit: Unit) {
        const bodyImages = gameState.snake.images.body;
        let image: HTMLImageElement;
        switch (unit.kind) {
            case Kind.Vertical:
                image = bodyImages.vertical;
                break;
            case Kind.Horizontal:
                image = bodyImages.horizontal;
                break;
            case Kind.TopLeft:
                image = bodyImages.topLeft;
                break;
            case Kind.TopRight:
                image = bodyImages.topRight;
                break;
            case Kind.BottomLeft:
                image = bodyImages.bottomLeft;
                break;
            case Kind.BottomRight:
                image = bodyImages.bottomRight;
                break;
        }
        return image;
    }

    const length = gameState.snake.occupiedUnits.length;

    for (let i = 1; i < length - 1; i++) {
        // drawRectangle(
        //     gameState.snake.occupiedUnits[i].x * gameState.unitSize,
        //     gameState.snake.occupiedUnits[i].y * gameState.unitSize,
        //     gameState.unitSize,
        //     gameState.unitSize,
        //     gameState.snake.color
        // );
        context.drawImage(
            getBodysImage(gameState.snake.occupiedUnits[i]),
            gameState.snake.occupiedUnits[i].x * gameState.unitSize,
            gameState.snake.occupiedUnits[i].y * gameState.unitSize,
            gameState.unitSize,
            gameState.unitSize
        );
    }

    function getTailsImage() {
        let image: HTMLImageElement;

        const tailUnit = gameState.snake.occupiedUnits[length - 1];
        switch (tailUnit.direction) {
            case Direction.Up:
                image = gameState.snake.images.tail.up;
                break;
            case Direction.Left:
                image = gameState.snake.images.tail.left;
                break;
            case Direction.Right:
                image = gameState.snake.images.tail.right;
                break;
            case Direction.Down:
                image = gameState.snake.images.tail.down;
                break;
        }

        return image;
    }

    context.drawImage(
        getTailsImage(),
        gameState.snake.occupiedUnits[length - 1].x * gameState.unitSize,
        gameState.snake.occupiedUnits[length - 1].y * gameState.unitSize,
        gameState.unitSize,
        gameState.unitSize
    );
}

function drawApple() {
    // drawRectangle(
    //     gameState.apple.position.x * gameState.unitSize,
    //     gameState.apple.position.y * gameState.unitSize,
    //     gameState.unitSize,
    //     gameState.unitSize,
    //     gameState.apple.color
    // );
    context.drawImage(
        gameState.apple.image,
        gameState.apple.position.x * gameState.unitSize,
        gameState.apple.position.y * gameState.unitSize,
        gameState.unitSize,
        gameState.unitSize
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
