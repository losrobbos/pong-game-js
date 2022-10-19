export const getTopXPos = (element) => {
  return parseInt(getComputedStyle(element).top);
};
export const getBottomXPos = (element) => {
  return parseInt(getComputedStyle(element).bottom);
};
export const getLeftPos = (element) => {
  return parseInt(getComputedStyle(element).left);
};

// initialize ball movement
export const isColliding = (el1, el2) => {  
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

export const createGameConfig = () => ({
  score: 0,
  paused: true,
  quitted: false,
  player: {
    speed: 10, // speed in pixels per keystroke
    active: null, // l = left | r = right
  },
  ball: {
    speed: 3,
    speed_inc: 0.2,
    direction: { 
      x: -1, 
      y: -1*Math.random()
    }
  },
})

export const movePlayer = (e, game, gameStatusElement) => {
  const playerActive = game.player.active;
  let playerXPos;

  switch (e.key) {

    // quit
    case "q":
      game.quitted = true;
      break;

    // pause / resume game
    case "p":
      game.paused = !game.paused;
      gameStatusElement.innerHTML = game.paused ? "RESUME<br />(p)" : "";
      gameStatusElement.style.display = game.paused ? "block" : "none";
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
    // case "ArrowLeft":
    //   game.player.active = player1;
    //   break;
    // case "ArrowRight":
    //   game.player.active = player2;
    //   break;
  }
};
