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

