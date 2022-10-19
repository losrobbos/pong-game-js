import { getBottomXPos, getLeftPos, getTopXPos, isColliding } from "./lib.js";

const game = {
  score: 0,
  paused: true,
  player: {
    speed: 10, // speed in pixels per keystroke
    active: null, // l = left | r = right
  },
  ball: {
    speed: 3,
    speed_inc: 0.2,
    direction: { 
      x: -1, 
      y: -0.25 
    }
  },
};

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

const movePlayer = (e) => {
  const playerActive = game.player.active;
  let playerXPos;

  switch (e.key) {
    // pause / resume game
    case "p":
      game.paused = !game.paused;
      gameStatus.innerText = game.paused ? "Resume (p)" : "";
      break;

    // move player (up / down)
    case "ArrowUp":
      playerXPos = getTopXPos(playerActive);
      if (playerXPos <= 0) return;

      // clear bottom pos and set top pos
      // playerActive.style.removeProperty("bottom");
      playerActive.style.bottom = "";
      playerActive.style.top = playerXPos - game.player.speed + "px";
      break;
    case "ArrowDown":
      playerXPos = getBottomXPos(playerActive);
      if (playerXPos <= 0) return;

      // clear top pos and set bottom pos
      // playerActive.style.removeProperty("top");
      playerActive.style.top = "";
      playerActive.style.bottom = playerXPos - game.player.speed + "px";
      break;

    // switch player
    case "ArrowLeft":
      game.player.active = player1;
      break;
    case "ArrowRight":
      game.player.active = player2;
      break;
  }
};

// handle player movement
window.onkeydown = movePlayer

/**
 * Game Loop: Move ball and check collisions
 */
const gameLoop = () => {
  if (game.paused) return requestAnimationFrame(gameLoop);

  // move ball
  const { left, right, top, bottom } = getComputedStyle(ball);
  ball.style.left = `${parseFloat(left) + game.ball.speed * game.ball.direction.x}px`;
  ball.style.top = `${parseFloat(top) + game.ball.speed * game.ball.direction.y}px`;


  // check out of scene (left / right)
  if (parseFloat(left) <= 0 || parseFloat(right) <= 0) {
    game.score--;
    score.innerText = game.score;
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
    // speed up ball
    game.ball.speed += game.ball.speed_inc
    game.score++;
    // increase score
    score.innerText = game.score;
  }

  // continue ball movement...
  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
