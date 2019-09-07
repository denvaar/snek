const processInput = (state: GameState, key: string): GameState => {
  switch (key) {
    case 'right':
      return {
        ...state,
        heading: 'right',
        snake: [
          [state.snake[0][0] + 1, state.snake[0][1]],
          ...state.snake.slice(0, -1),
        ],
      };
    case 'left':
      return {
        ...state,
        heading: 'left',
        snake: [
          [state.snake[0][0] - 1, state.snake[0][1]],
          ...state.snake.slice(0, -1),
        ],
      };
    case 'up':
      return {
        ...state,
        heading: 'up',
        snake: [
          [state.snake[0][0], state.snake[0][1] - 1],
          ...state.snake.slice(0, -1),
        ],
      };
    case 'down':
      return {
        ...state,
        heading: 'down',
        snake: [
          [state.snake[0][0], state.snake[0][1] + 1],
          ...state.snake.slice(0, -1),
        ],
      };
    default:
      return state;
  }
};

export default processInput;
