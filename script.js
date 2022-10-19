const game = {
  player: {
    speed: 10, // speed in pixels per keystroke
    active: null, // l = left | r = right
    score: 0,
  },
  ball: {
    speed: 2,
    direction: -1,
  },
};

// DOM nodes
const player1 = document.querySelector(".bar1");
const player2 = document.querySelector(".bar2");
const ball = document.querySelector(".ball");
const score = document.querySelector(".score");

game.player.active = player1;

const getTopXPos = (element) => {
  return parseInt(getComputedStyle(element).top);
};
const getBottomXPos = (element) => {
  return parseInt(getComputedStyle(element).bottom);
};
const getLeftPos = (element) => {
  return parseInt(getComputedStyle(element).left);
}

// first load - place players vertically centered
const playerHeight = player1.scrollHeight;
player1.style.top = `calc(50% - ${playerHeight / 2}px)`;
player2.style.top = `calc(50% - ${playerHeight / 2}px)`;
ball.style.left = "50%"

// initialize ball movement
const isColliding = (el1, el2) => {  
  // collision with player? => change direction!
  const domRect1 = el1.getBoundingClientRect();
  const domRect2 = el2.getBoundingClientRect();

  return !(
    domRect1.top > domRect2.bottom ||
    domRect1.right < domRect2.left ||
    domRect1.bottom < domRect2.top ||
    domRect1.left > domRect2.right
  );

  // collision with scene border? => reduce score, re-place at middle 
}


// handle player movement
window.onkeydown = (e) => {
  const playerActive = game.player.active;
  let playerXPos;

  switch (e.key) {
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


const gameLoop = () => {
  // move ball
  const leftPos = getLeftPos(ball);
  ball.style.left = `${leftPos + game.ball.speed * game.ball.direction}px`;

  // check out of scene
  const { left, right } = getComputedStyle(ball);

  // check collision with player
  const isCollidingWithPlayer =
    isColliding(ball, player1) || isColliding(ball, player2);
  // console.log({ left, right })

  // collision with player!
  if (isCollidingWithPlayer) {
    // change direction!
    game.ball.direction = game.ball.direction * -1;
    // increase score
    score.innerText = parseInt(score.innerText) + 1;
  }

  // continue ball movement...
  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
