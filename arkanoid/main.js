let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

const platform = new Image();
platform.src = "./platform.png";
let platformWidth = 100;  
let platformHeight = 20; 
let platformX = canvas.width - platformWidth; 
let platformY = canvas.height - platformHeight; 
let platformSpeed = 10;

const ball = new Image();
ball.src = "./ball.png";
let ballRadius = 50;
let ballX = canvas.width / 2 - ballRadius;
let ballY = canvas.height / 2 - ballRadius;
let ballSpeed = 3;
let ballMoveX = ballSpeed * 1.05;
let ballMoveY = -ballSpeed * 1.05;
let rightMove = false;
let leftMove = false;

const monster = new Image();
monster.src = "./monster.png";
let monsterHCount = 10;
let monsterVCount = 3;
let monsterPadding = 5;
let monsterRadius = canvas.width / monsterHCount - monsterPadding;
let monsters = [];

let score = 0;

document.addEventListener("keydown", keyDownPlatform, false);
document.addEventListener("keyup", keyUpPlatform, false);

for (let c = 0; c < monsterHCount; c++) {
    monsters[c] = [];
    for (let r = 0; r < monsterVCount; r++) {
        monsters[c][r] = { x: 0, y: 0, status: true };
    }
}

function keyDownPlatform(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightMove = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftMove = true;
    }
}

function keyUpPlatform(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightMove = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftMove = false;
    }
}

function drawPlatform() {
    ctx.drawImage(
        platform,
        platformX,
        platformY,
        platformWidth,
        platformHeight
    );
}

function drawBall() {
    ctx.drawImage(ball, ballX, ballY, ballRadius, ballRadius);
}

function drawMonsters() {
    for (let c = 0; c < monsterHCount; c++) {
        for (let r = 0; r < monsterVCount; r++) {
            if (monsters[c][r].status == 1) {
                let X = c * (monsterRadius + monsterPadding);
                let Y = r * (monsterRadius + monsterPadding);
                monsters[c][r].x = X;
                monsters[c][r].y = Y;
                ctx.drawImage(monster, X, Y, monsterRadius, monsterRadius);
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < monsterHCount; c++) {
        for (let r = 0; r < monsterVCount; r++) {
            let m = monsters[c][r];
            if (m.status) {
                if (
                    ballX > m.x &&
                    ballX < m.x + monsterRadius &&
                    ballY > m.y &&
                    ballY < m.y + monsterRadius
                ) {
                    ballMoveY = -ballMoveY;
                    m.status = false;
                    score++;
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, canvas.width / 2 - 40, canvas.height / 2);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatform();
    drawBall();
    drawMonsters();
    collisionDetection();
    drawScore();

    if (ballX > canvas.width - ballRadius || ballX < 0) {
        ballMoveX = -ballMoveX;
    }

    if (ballY < 0) {
        ballMoveY = -ballMoveY;
    } else if (ballY > canvas.height - ballRadius) {
        if (
            ballX > platformX - platformWidth / 2 &&
            ballX < platformX + platformWidth / 2
        ) {
            ballMoveY = -ballMoveY;
        } else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        }
    }

    if (score == monsterHCount * monsterVCount) {
        alert("YOU WIN");
        document.location.reload();
        clearInterval(interval);
    }

    ballX += ballMoveX;
    ballY += ballMoveY;

    if (rightMove && platformX < canvas.width - platformWidth) {
        platformX += platformSpeed;
    } else if (leftMove && platformX > 0) {
        platformX -= platformSpeed;
    }
}

let interval = setInterval(draw, 10);
