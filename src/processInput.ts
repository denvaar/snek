const processInput = (state: GameState, desiredHeading: Direction): GameState => {
  const heading = state.heading;
  if (
    (heading === "left" && desiredHeading === "right") ||
    (heading === "right" && desiredHeading === "left") ||
    (heading === "up" && desiredHeading === "down") ||
    (heading === "down" && desiredHeading === "up")
  ) {
    return state;
  }
  return {
    ...state,
    heading: desiredHeading
  };
};

export default processInput;
