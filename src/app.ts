import drawGame from './drawGame';
import processInput from './processInput';
import processPosition from './processPosition';

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
if (process.stdin.setRawMode) {
  process.stdin.setRawMode(true);
}

const msPerFrame: number = 66;
const initialState: GameState = {
  snake: [[4, 5], [3, 5], [2, 5], [1, 5]],
  heading: 'right',
  food: [10, 5],
};
// global for now :(
var lastPressed: Direction = 'right';

const gameLoop = (state: GameState): void => {
  setTimeout(() => {
    // draw game state
    drawGame(state);

    // update game state
    let nextState = processInput(state, lastPressed);
    nextState = processPosition(nextState);

    // repeat!
    gameLoop(nextState);
  }, msPerFrame);
};

process.stdin.on('keypress', (str, {ctrl, name}) => {
  if (ctrl && name === 'c') process.exit();

  if (['left', 'right', 'up', 'down'].includes(name)) {
    if (
      (lastPressed === 'left' && name === 'right') ||
      (lastPressed === 'right' && name === 'left') ||
      (lastPressed === 'up' && name === 'down') ||
      (lastPressed === 'down' && name === 'up')
    ) {
      return;
    }
    lastPressed = name;
  }
});

gameLoop(initialState);
