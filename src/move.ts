const move = (state: GameState): GameState => {
  switch (state.heading) {
    case 'right':
      return {
        ...state,
        snake: [[state.snake[0][0] + 1, state.snake[0][1]], ...state.snake.slice(0, -1)],
      };
    case 'left':
      return {
        ...state,
        snake: [[state.snake[0][0] - 1, state.snake[0][1]], ...state.snake.slice(0, -1)],
      };
    case 'up':
      return {
        ...state,
        snake: [[state.snake[0][0], state.snake[0][1] - 1], ...state.snake.slice(0, -1)],
      };
    case 'down':
      return {
        ...state,
        snake: [[state.snake[0][0], state.snake[0][1] + 1], ...state.snake.slice(0, -1)],
      };
    default:
      return state;
  }
};

export default move;
