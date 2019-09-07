const growSnake = (snake: Array<Array<number>>): Array<Array<number>> => {
  return [
    ...snake,
    [snake[snake.length - 1][0] + 1, snake[snake.length - 1][1] + 1],
  ];
};

const processPosition = (state: GameState): GameState => {
  const {food, snake} = state;
  if (food[1] === snake[0][0] && food[0] === snake[0][1]) {
    return {
      ...state,
      snake: growSnake(snake),
    };
  }
  return state;
};

export default processPosition;
