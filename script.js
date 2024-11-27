const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 20;
const gridSize = canvas.width / tileSize;

let snake = [{ x: 5, y: 5 }];
let direction = 'RIGHT';
let food = { x: 10, y: 10 };
let speed = 200; // Initial speed (milliseconds per frame)
let gameInterval;

// Start the game
function startGame() {
    document.addEventListener('keydown', changeDirection);
    gameInterval = setInterval(updateGame, speed);

    // Set up control buttons
    document.getElementById('speedUp').addEventListener('click', increaseSpeed);
    document.getElementById('slowDown').addEventListener('click', decreaseSpeed);
    document.getElementById('stop').addEventListener('click', stopGame);
}

// Change the direction of the snake
function changeDirection(event) {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

// Update the game state
function updateGame() {
    moveSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    if (snake[0].x === food.x && snake[0].y === food.y) {
        eatFood();
    }
    drawGame();
}

// Move the snake
function moveSnake() {
    const head = { ...snake[0] };
    if (direction === 'UP') head.y -= 1;
    if (direction === 'DOWN') head.y += 1;
    if (direction === 'LEFT') head.x -= 1;
    if (direction === 'RIGHT') head.x += 1;

    snake.unshift(head);
    if (snake[0].x === food.x && snake[0].y === food.y) {
        // Do not remove tail if we ate food
    } else {
        snake.pop();
    }
}

// Check for collisions
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) return true;
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

// Handle eating food
function eatFood() {
    snake.push({ ...snake[snake.length - 1] });
    placeFood();
}

// Place food at a new location
function placeFood() {
    food.x = Math.floor(Math.random() * gridSize);
    food.y = Math.floor(Math.random() * gridSize);
}

// Increase the speed of the game
function increaseSpeed() {
    if (speed > 50) { // Set a minimum speed limit
        clearInterval(gameInterval);
        speed -= 20; // Decrease the interval to increase speed
        gameInterval = setInterval(updateGame, speed);
    }
}

// Decrease the speed of the game
function decreaseSpeed() {
    clearInterval(gameInterval);
    speed += 20; // Increase the interval to decrease speed
    gameInterval = setInterval(updateGame, speed);
}

// Stop the game
function stopGame() {
    clearInterval(gameInterval);
}

// Draw the game on the canvas
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 50, canvas.height / 2);
}

// Start the game loop
startGame();
