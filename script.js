import { createGameConfig, isColliding, movePlayer } from "./lib.js";

const game = createGameConfig()

// DOM nodes
const player1 = document.querySelector(".bar1");
const player2 = document.querySelector(".bar2");
const ball = document.querySelector(".ball");
const score = document.querySelector(".score");
const gameStatus = document.querySelector(".status");

game.player.active = player1;


// first load - place players vertically centered
const playerHeight = player1.scrollHeight;
player1.style.top = `calc(50% - ${playerHeight / 2}px)`;
player2.style.top = `calc(50% - ${playerHeight / 2}px)`;
ball.style.left = "50%"
ball.style.top = "50%"


// handle player movement
window.onkeydown = (e) => movePlayer(e, game, gameStatus)

/**
 * Game Loop: Move ball and check collisions
 */
const gameLoop = () => {

  // game over?
  if(game.quitted) {
    gameStatus.innerHTML = "<b>PLAYER QUITTED GAME</b><br />(refresh page to restart)";
    gameStatus.style.display = "block";
    return
  }

  // game state (paused / resume)
  if (game.paused) return requestAnimationFrame(gameLoop);

  // move ball
  const { left, right, top, bottom } = getComputedStyle(ball);
  ball.style.left = `${parseFloat(left) + game.ball.speed * game.ball.direction.x}px`;
  ball.style.top = `${parseFloat(top) + game.ball.speed * game.ball.direction.y}px`;


  // check out of scene (left / right)
  if (parseFloat(left) <= 0 || parseFloat(right) <= 0) {
    game.score--;
    score.innerText = game.score;

    // lost?
    if(game.score < 0) {
      game.quitted = true
      gameStatus.innerHTML = "<b>YOU LOST, BRO...</b><br />";
      gameStatus.style.display = "block";
      return // stop game
    }

    // re-move to center
    ball.style.left = "50%";
    return requestAnimationFrame(gameLoop);
  }

  // check collision with top / bottom scene
  if(parseFloat(top) <= 0 || parseFloat(bottom) <= 0) {
    // console.log("Hit ceiling or ground...", { top, bottom })
    game.ball.direction.y = game.ball.direction.y * -1;
    const topNew = parseFloat(top) + game.ball.speed * game.ball.direction.y
    ball.style.top = `${ topNew }px`;
    return requestAnimationFrame(gameLoop);
  }

  // check collision with player
  const isCollidingWithPlayer =
    isColliding(ball, player1) || isColliding(ball, player2);

  // collision with player!
  if (isCollidingWithPlayer) {
    // change direction!
    game.ball.direction.x = game.ball.direction.x * -1;

    // alternate player!
    // if(game.player.active === player1)
    game.player.active = game.player.active === player1 ? player2 : player1;

    // speed up ball
    game.ball.speed += game.ball.speed_inc;

    // increase score
    game.score++;
    score.innerText = game.score;
  }

  // continue ball movement...
  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
