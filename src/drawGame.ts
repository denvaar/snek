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

const getGameInfo = (length: number) => `\n\n┌────────────────────────────┐
│  Snek Length: ${pad(length, 2)}           │
└────────────────────────────┘\n
Move snek with arrow keys, or h,j,k,l`;

const objects = {
  // creates a two dimensional array representing the screen
  // indexing is by screen[y][x] !!! (row first, column second)
  getScreen: (w: number, h: number): Array<Array<String>> => [
    ['┌', ...'─'.repeat(w - 2), '┐'], // top row
    ...Array(h - 2)
      .fill(undefined)
      .map(() => ['│', ...' '.repeat(w - 2), '│']), // mid rows
    ['└', ...'─'.repeat(w - 2), '┘'], // bottom row
    ...getGameInfo(0)
      .split('\n')
      .map(ln => Array.from(ln)), // append game info
  ],
  food: `${colors.magenta}█${colors.reset}`,
  snake: `${colors.green}█${colors.reset}`,
  getSnakeFlash: (white: boolean) => `${white ? '\u001b[37m' : '\u001b[30m'}█${colors.reset}`,
  getSnakeRainbow: (idx: number) => `${getRainbowColor(idx)}█${colors.reset}`,
};

const drawGame = (
  state: GameState,
  setPixel: (x: number, y: number, val: String) => void
): void => {
  // draw food
  const [fx, fy] = state.food;
  setPixel(fx, fy, objects.food);

  // draw snake
  for (let i = 0; i < state.snake.length; i++) {
    const [x, y] = state.snake[i];

    if (i == state.snake.length - 1 && state.flashDuration > 0)
      setPixel(x, y, objects.getSnakeFlash(state.flashRotation));
    else if (
      i >= state.rainbowOffset &&
      i <= state.rainbowOffset + state.rainbowLength &&
      state.snake.length > 10
    )
      setPixel(x, y, objects.getSnakeRainbow(i - state.rainbowOffset));
    else setPixel(x, y, objects.snake);
  }

  // draw snek length
  const lenStr = pad(state.snake.length, 2);
  for (let i = 0; i < lenStr.length; i++)
    setPixel('│  Snek Length: '.length + i, config.screen.height + 3, lenStr[i]);
};

export const drawGameInitial = (state: GameState) => {
  const screen = objects.getScreen(config.screen.width, config.screen.height);

  const setPixel = (x: number, y: number, val: string) => (screen[y][x] = val);
  drawGame(state, setPixel);

  console.clear();
  process.stdout.write(screen.map(ln => ln.join('')).join('\n'));
};

export const drawGameDelta = (oldState: GameState, nextState: GameState) => {
  const writeAt = (x: number, y: number, val: string) =>
    process.stdout.write(`\x1b[${y + 1};${x + 1}f${val}`);
  const clearAt = (x: number, y: number, _: string) => writeAt(x, y, ' ');

  // clear old game objects
  drawGame(oldState, clearAt);
  // draw new game objects
  drawGame(nextState, writeAt);

  // reset the cursor to the end of the screen
  writeAt(0, config.screen.height + 7, '');
};

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
