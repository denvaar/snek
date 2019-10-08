import config from './config';
import { pad } from './utils';

let colorSpeed = 0;
let colorModifier = 0;

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
  const { reset, ...rColors } = colors;
  const rainbowColors = Object.values(rColors);

  const moddedIndex = (index + colorModifier) % rainbowColors.length;

  return rainbowColors[moddedIndex];
};

const getFlashColor = (white: boolean) => (white ? '\u001b[37m' : '\u001b[30m');

const drawGame = ({
  snake,
  food,
  heading,
  flashDuration,
  flashRotation,
  status,
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
        } else if (snake.length > 10) {
          rowData[col] = `${getRainbowColor(s)}█${reset}`;
        } else rowData[col] = `${green}█${reset}`;
      }
    }

    colorSpeed++;
    if (colorSpeed % 4 === 0) colorModifier++;

    if (status === 'game_over' && i === Math.floor(config.screen.height / 2)) {
      const MESSAGE = 'Game Over!';

      for (let li = 0; li < MESSAGE.length; li++) {
        const letter = MESSAGE[li];
        const beginIndex = (rowData.length - MESSAGE.length) / 2;

        rowData[beginIndex + li] = letter;
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
