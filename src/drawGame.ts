import config from './config';
import { pad } from './utils';

const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
};

const getRainbowColor = (index: number) => {
  const { reset, green, ...rColors } = colors;
  const rainbowColors = Object.values(rColors);

  const moddedIndex = index % rainbowColors.length;

  return rainbowColors[moddedIndex];
};

const getFlashColor = (white: boolean) => (white ? '\u001b[37m' : '\u001b[30m');

const drawGame = ({
  snake,
  food,
  heading,
  flashDuration,
  flashRotation,
  rainbowOffset,
  rainbowLength,
}: GameState): void => {
  const { magenta, green, reset } = colors;
  const topRow = Array.from(
    '┌────────────────────────────────────────────────────────────────────┐'
  );
  const bottomRow = Array.from(
    '└────────────────────────────────────────────────────────────────────┘'
  );
  const screen = [];
  for (let i = 0; i < config.screen.height; i++) {
    let rowData: Array<string> = Array.from(
      '│                                                                    │'
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
        if (s == snake.length - 1 && flashDuration > 0) {
          // last tile
          rowData[col] = `${getFlashColor(flashRotation)}█${reset}`;
        } else if (s >= rainbowOffset && s <= rainbowOffset + rainbowLength && snake.length > 10) {
          const index = s - rainbowOffset;
          rowData[col] = `${getRainbowColor(index)}█${reset}`;
        } else rowData[col] = `${green}█${reset}`;
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
  process.stdout.write(`${screen.join('\n')}\n\n${gameInfo}\n${instructions}`);
};

export default drawGame;
