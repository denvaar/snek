import config from './config';
import { getRandomInt } from './utils';

const growSnake = (snake: Array<Array<number>>, heading: Direction): Array<Array<number>> => {
  if (heading === 'up' || heading === 'down') {
    return [...snake, [snake[snake.length - 1][0], snake[snake.length - 1][1] + 1]];
  } else if (heading === 'left' || heading === 'right') {
    return [...snake, [snake[snake.length - 1][0] + 1, snake[snake.length - 1][1]]];
  }

  return snake;
};

const processPosition = (state: GameState): GameState => {
  const { food, snake } = state;
  const [snakeCol, snakeRow] = snake[0];

  if (food[1] === snake[0][1] && food[0] === snake[0][0]) {
    return {
      ...state,
      snake: growSnake(snake, state.heading),
      food: [getRandomInt(2, config.screen.width - 2), getRandomInt(2, config.screen.height - 2)],
    };
  }

  const [snakeHeadCol, snakeHeadRow] = snake[0];
  for (let i = 1; i < snake.length; i++) {
    const [snakeCol, snakeRow] = snake[i];

    if (snakeCol === snakeHeadCol && snakeRow === snakeHeadRow) {
      return {
        ...state,
        status: 'game_over',
      };
    }
  }

  if (
    snakeCol <= 0 ||
    snakeCol >= config.screen.width - 1 ||
    snakeRow >= config.screen.height - 1 ||
    snakeRow <= 0
  ) {
    return { ...state, status: 'game_over' };
  }

  return state;
};

export default processPosition;
