const board = document.getElementById('game-board');
let snake = [{ x: 10, y: 10 }];
function draw() {
    board.innerHTML = '';
    drawSnake();
}
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
    })
}