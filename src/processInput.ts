const processInput = (state: GameState): GameState => {
  const {heading, lastPressed } = state;
  if (
    (heading === "left" && lastPressed === "right") ||
    (heading === "right" && lastPressed === "left") ||
    (heading === "up" && lastPressed === "down") ||
    (heading === "down" && lastPressed === "up")
  ) {
    return state;
  }
  return {
    ...state,
    heading: lastPressed
  };
};

export default processInput;
