const colors = {
  magenta: '\x1b[35m',
  green: '\x1b[32m',
  reset: '\x1b[0m',
};

const drawGame = ({snake, food, heading}: GameState): void => {
  const {magenta, green, reset} = colors;
  console.clear();
  const topRow =
    '┌────────────────────────────────────────────────────────────────────┐';
  const middleRows = [];
  for (let i = 0; i < 20; i++) {
    let rowData: Array<string> = Array.from(
      '│                                                                    │',
    );
    if (i === food[0]) rowData[food[1]] = `${magenta}✿${reset}`;
    for (let s = 0; s < snake.length; s++) {
      const [col, row] = snake[s];
      if (row === i) {
        rowData[col] = `${green}█${reset}`;
      }
    }
    middleRows.push(rowData.join(''));
  }
  const bottomRow =
    '└────────────────────────────────────────────────────────────────────┘';
  console.log(
    `${topRow}\n${middleRows.join('\n')}\n${bottomRow}\n\nSnek Length: ${
      snake.length
    }`,
  );
};

export default drawGame;
