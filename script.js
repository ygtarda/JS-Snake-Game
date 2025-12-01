const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

// Oyun Ayarları
const box = 20; // Her bir karenin boyutu
let score = 0;
let game;

// Yılanın Başlangıç Konumu
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

// Yem Konumu
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let d; // Yön

// Yön Kontrolü
document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (event.keyCode == 38 && d != "DOWN") {
        d = "UP";
    } else if (event.keyCode == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (event.keyCode == 40 && d != "UP") {
        d = "DOWN";
    }
}

// Çarpışma Kontrolü
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// Oyunu Çizme Fonksiyonu
function draw() {
    // Arkaplanı temizle
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Yılanı çiz
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#4CAF50" : "white"; // Baş yeşil, gövde beyaz
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Yemi çiz
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Eski baş pozisyonu
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Yönlendirme
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // Yem yendi mi?
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreEl.innerText = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        }
    } else {
        // Yem yenmediyse kuyruğu sil
        snake.pop();
    }

    // Yeni Baş
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    // Oyun Bitti mi? (Duvarlara veya kendine çarpma)
    if (snakeX < 0 || snakeX > canvas.width - box ||
        snakeY < 0 || snakeY > canvas.height - box ||
        collision(newHead, snake)) {
        clearInterval(game);
        alert("Oyun Bitti! Skorunuz: " + score);
        location.reload(); // Sayfayı yenile
    }

    snake.unshift(newHead);
}

// Oyunu Başlat (Her 100ms'de bir draw fonksiyonunu çağır)
game = setInterval(draw, 100);