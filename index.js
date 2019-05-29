import Game from "game.js";
let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d")

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

let lastTime = 0;
let game = new Game(GAME_WIDTH, GAME_HEIGHT);

function gameLoop(timeStamp){
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    gameLoop.update(deltaTime);
    gameLoop.draw(ctx);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);