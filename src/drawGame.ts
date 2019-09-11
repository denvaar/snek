import config from './config';
import {pad} from './utils';

const colors = {
  magenta: '\x1b[35m',
  green: '\x1b[32m',
  reset: '\x1b[0m',
};

const drawGame = ({snake, food, heading}: GameState): void => {
  const {magenta, green, reset} = colors;
  const topRow = Array.from(
    '┌────────────────────────────────────────────────────────────────────┐',
  );
  const bottomRow = Array.from(
    '└────────────────────────────────────────────────────────────────────┘',
  );
  const screen = [];
  for (let i = 0; i < config.screen.height; i++) {
    let rowData: Array<string> = Array.from(
      '│                                                                    │',
    );
    if (i === 0) {
      rowData = topRow;
    }
    if (i === config.screen.height - 1) {
      rowData = bottomRow;
    }
    if (i === food[1]) rowData[food[0]] = `${magenta}█${reset}`;

    for (let s = 0; s < snake.length; s++) {
      const [col, row] = snake[s];
      if (row === i) {
        rowData[col] = `${green}█${reset}`;
      }
    }

    screen.push(rowData.join(''));
  }

  const gameInfo = `┌────────────────────────────┐
│  Snek Length: ${pad(snake.length, 2)}           │
└────────────────────────────┘
`;
  const instructions = 'Move snek with arrow keys, or h,j,k,l';

  console.clear();
  console.log(`${screen.join('\n')}\n\n${gameInfo}\n${instructions}`);
};

export default drawGame;
