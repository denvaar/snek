import config from "./config";
import { pad } from "./utils";

let colorSpeed = 0;
let colorModifier = 0;

const colors = {
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  reset: "\x1b[0m"
};

const getRainbowColor = (index: number) => {
  const { reset, ...rColors } = colors;
  const rainbowColors = Object.values(rColors);

  const moddedIndex = (index + colorModifier) % rainbowColors.length;

  return rainbowColors[moddedIndex];
};

const drawGame = ({ snake, food, heading }: GameState): void => {
  const { magenta, green, reset } = colors;
  const topRow = Array.from(
      "┌────────────────────────────────────────────────────────────────────┐"
  );
  const bottomRow = Array.from(
      "└────────────────────────────────────────────────────────────────────┘"
  );
  const screen = [];
  for (let i = 0; i < config.screen.height; i++) {
    let rowData: Array<string> = Array.from(
        "│                                                                    │"
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
        if (snake.length > 10) {
          rowData[col] = `${getRainbowColor(s)}█${reset}`;
        } else rowData[col] = `${green}█${reset}`;
      }
    }

    colorSpeed++;
    if(colorSpeed % 4 === 0)
      colorModifier++;

    screen.push(rowData.join(""));
  }

  const gameInfo = `┌────────────────────────────┐
│  Snek Length: ${pad(snake.length, 2)}           │
└────────────────────────────┘
`;
  const instructions = "Move snek with arrow keys, or h,j,k,l";

  process.stdout.write('\x1Bc');
  process.stdout.write(`${screen.join("\n")}\n\n${gameInfo}\n${instructions}`);
};

export default drawGame;
