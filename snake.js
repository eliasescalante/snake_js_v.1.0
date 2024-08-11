const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configuración inicial
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const box = 30; // Tamaño más grande para la serpiente y la comida
let snake = [{ x: Math.floor(canvas.width / 2 / box) * box, y: Math.floor(canvas.height / 2 / box) * box }];
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
};
let score = 0;
let playerName = "";
let speed = 100; // Velocidad inicial del juego (milisegundos por cuadro)
let gameInterval;

function startGame() {
    gameInterval = setInterval(draw, speed);
}

function increaseSpeed() {
    if (speed > 50) { // Limita la velocidad mínima para evitar que el juego sea demasiado rápido
        speed -= 5; // Reduce el intervalo para aumentar la velocidad
        clearInterval(gameInterval);
        startGame();
    }
}

// Mostrar mensaje de bienvenida y pedir nombre
Swal.fire({
    title: 'Bienvenido a mi proyectito',
    input: 'text',
    inputLabel: 'Ingresa tu nombre',
    inputPlaceholder: 'Tu nombre aquí',
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value) {
            return '¡Necesitas escribir tu nombre!';
        }
    }
}).then((result) => {
    playerName = result.value;
    document.addEventListener("keydown", changeDirection);
    startGame();
});

function changeDirection(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode === 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (event.keyCode === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode === 40 && direction !== "UP") {
        direction = "DOWN";
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar la serpiente
    snake.forEach(segment => {
        ctx.fillStyle = "#fff"; // Color blanco para la serpiente
        ctx.fillRect(segment.x, segment.y, box, box);
    });
    
    // Dibujar la comida
    ctx.fillStyle = "red"; // Color rojo para los puntos
    ctx.fillRect(food.x, food.y, box, box);
    
    // Posición de la cabeza de la serpiente
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // Dirección de la serpiente
    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;
    
    // Si la serpiente come la comida
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        increaseSpeed(); // Aumentar la velocidad
        if (score === 200) {
            clearInterval(gameInterval);
            showEndGameMessage(`${playerName}, ¡Ganaste con un puntaje de ${score}!`);
            return;
        }
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    } else {
        snake.pop();
    }
    
    // Agregar nueva posición de la cabeza
    let newHead = { x: snakeX, y: snakeY };
    
    // Game over si la serpiente choca con los bordes o consigo misma
    if (
        snakeX < 0 || snakeY < 0 || 
        snakeX >= canvas.width || snakeY >= canvas.height || 
        collision(newHead, snake)
    ) {
        clearInterval(gameInterval);
        showEndGameMessage(`${playerName}, ¡Perdiste! Tu puntaje final es ${score}.`);
    }
    
    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function showEndGameMessage(message) {
    Swal.fire({
        title: message,
        showCancelButton: true,
        confirmButtonText: 'Volver a jugar',
        cancelButtonText: 'Salir',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            resetGame();
        } else {
            showThankYouMessage();
        }
    });
}

function resetGame() {
    snake = [{ x: Math.floor(canvas.width / 2 / box) * box, y: Math.floor(canvas.height / 2 / box) * box }];
    direction = "RIGHT";
    score = 0;
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
    speed = 100; // Restablecer la velocidad inicial
    startGame();
}

function showThankYouMessage() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #fff;
            color: #000;
            text-align: center;
            font-size: 24px;
            font-family: Arial, sans-serif;
        ">
            <div>
                <p>Gracias por jugar mi proyecto</p>
                <p>Fue realizado en JavaScript y HTML nativo.</p>
                <p>https://elias-escalante.itch.io/</p>
                <p>https://github.com/eliasescalante/snake_js_v.1.0</p>
            </div>
        </div>
    `;
}
