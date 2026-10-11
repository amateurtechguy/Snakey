const board = document.getElementById('game-board');
const gridSize = 20;
const instruction = document.getElementById('instruction');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highscore');

let snake = [
    { x: 10, y: 9 },
    { x: 10, y: 10 }
];
let food = generateFood();
let highScore = Number(localStorage.getItem('snakeHighScore')) || 0;
let direction = 'right';
let nextDirection = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

highScoreText.textContent = highScore.toString().padStart(3, '0');

function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}
function drawFood() {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}
function generateFood() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * gridSize) + 1,
            y: Math.floor(Math.random() * gridSize) + 1
        };
    } while (snake.some((segment) => segment.x === position.x && segment.y === position.y));
    return position;
}
function move() {
    direction = nextDirection;
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    const ateFood = head.x === food.x && head.y === food.y;
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
        return;
    }
    const bodyToCheck = ateFood ? snake : snake.slice(0, -1);
    if (bodyToCheck.some((segment) => segment.x === head.x && segment.y === head.y)) {
        resetGame();
        return;
    }
    snake.unshift(head);
    if (ateFood) {
        updateHighScore();
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            if (gameStarted) {
                draw();
            }
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}
function startGame() {
    if (gameStarted) {
        return;
    }
    gameStarted = true;
    instruction.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        if (gameStarted) {
            draw();
        }
    }, gameSpeedDelay);
}
function handleKeyPress(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        if (!gameStarted) {
            startGame();
        }
        return;
    }
    if (event.key === 'ArrowUp' && direction !== 'down') {
        nextDirection = 'up';
    } else if (event.key === 'ArrowDown' && direction !== 'up') {
        nextDirection = 'down';
    } else if (event.key === 'ArrowLeft' && direction !== 'right') {
        nextDirection = 'left';
    } else if (event.key === 'ArrowRight' && direction !== 'left') {
        nextDirection = 'right';
    }
}
document.addEventListener('keydown', handleKeyPress);
function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}
function resetGame() {
    updateHighScore();
    clearInterval(gameInterval);
    snake = [
        { x: 10, y: 9 },
        { x: 10, y: 10 }
    ];
    food = generateFood();
    direction = 'right';
    nextDirection = 'right';
    gameSpeedDelay = 200;
    gameStarted = false;
    draw();
    stopGame();
}
function updateScore() {
    const currentScore = Math.max(0, snake.length - 2);
    score.textContent = currentScore.toString().padStart(3, '0');
}
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instruction.style.display = 'block';
    logo.style.display = 'block';
}
function updateHighScore() {
    const currentScore = Math.max(0, snake.length - 2);
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
        localStorage.setItem('snakeHighScore', highScore);
    }
}
draw();

