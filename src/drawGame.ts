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

const getGameInfo = (length: number) => {
  const gameInfo = `┌────────────────────────────┐
│  Snek Length: ${pad(length, 2)}           │
└────────────────────────────┘
`;
  const instructions = 'Move snek with arrow keys, or h,j,k,l';

  return `\n\n${gameInfo}\n${instructions}`;
};

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

  console.clear();
  process.stdout.write(`${screen.join('\n')}${getGameInfo(snake.length)}`);
};

export default drawGame;

const centerAndPadScreen = (screen: Array<Array<number>>, padVal: number = 2) => {
  let newScreen: Array<Array<number>> = [];
  const originalWidth = screen[0].length;
  const originalHeight = screen.length;
  const widthOffset = Math.round((config.screen.width - originalWidth) / 2);
  const heightOffset = Math.round((config.screen.height - originalHeight) / 2);

  for (let i = 0; i < config.screen.height; i++) {
    if (i < heightOffset || i > config.screen.height - heightOffset - 1) {
      newScreen[i] = new Array(config.screen.width).fill(padVal);
    } else {
      const paddedOffset = new Array(widthOffset).fill(padVal);
      const rightOffset =
        originalWidth % 2 == 0 ? paddedOffset : new Array(widthOffset - 1).fill(padVal);
      newScreen[i] = [...paddedOffset, ...screen[i - heightOffset], ...rightOffset];
    }
  }

  return newScreen;
};

export const drawScreen = (_screen: Array<Array<number>>, length: number, invert: boolean) => {
  const screen = centerAndPadScreen(_screen);
  let screenData: Array<string> = [];

  for (let r = 0; r < screen.length; r++) {
    const row = screen[r];
    let rowData: Array<string> = [];
    for (let c = 0; c < row.length; c++) {
      let color = row[c] === 1 ? colors.magenta : colors.green;

      if (invert) {
        color = color === colors.magenta ? colors.green : colors.magenta;
      }

      rowData.push(`${color}█${colors.reset}`);
    }
    screenData.push(rowData.join(''));
  }
  console.clear();
  process.stdout.write(`${screenData.join('\n')}${getGameInfo(length)}`);
};
