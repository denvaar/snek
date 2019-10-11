const fs = require('fs');
import { pad } from './utils';

const gameOverScreen = (snake: any) => {
  console.clear();
  let data = fs.readFileSync('./assets/coordinates/gameOver.csv', 'utf-8');
  let lines = data.split(/\r?\n/);

  lines.forEach((line: string) => {
    let chars = line.split(',');

    chars.forEach((char: string) => {
      if (char === '1') process.stdout.write('█');
      else process.stdout.write(' ');
    });
    process.stdout.write('\n');
  });
  const gameInfo = `┌────────────────────────────┐
│  Snek Length: ${pad(snake.length, 2)}           │
└────────────────────────────┘\n
`;
  process.stdout.write(gameInfo);
};
export default gameOverScreen;
