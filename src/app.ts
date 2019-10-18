import * as fs from 'fs';
import drawGame, { drawScreen } from './drawGame';
import move from './move';
import processInput from './processInput';
import processPosition from './processPosition';
import SoundService from './soundService';

const soundService = SoundService.getInstance();

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
if (process.stdin.setRawMode) {
  process.stdin.setRawMode(true);
}

// these should be calculated based of the width & height
const msPerFrameX: number = 66;
const msPerFrameY: number = 100;

const initialState: GameState = {
  status: 'playing',
  snake: [[7, 1], [6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1]],
  heading: 'right',
  food: [10, 10],
  flashDuration: 0,
  flashRotation: false,
  rainbowOffset: 1,
  rainbowLength: 1,
};
// global for now :(
var lastPressed: Direction = 'right';
let rainbowModifier = 0;

const gameOverAnimation = (snake_length: number) => {
  let animation_loop = 5;

  const animate = () => {
    animation_loop--;
    const invert = animation_loop % 2 === 0;
    gameover(snake_length, invert);

    if (animation_loop >= 0) {
      setTimeout(animate, 500);
    } else {
      process.stdout.write('\x07');
      process.exit();
    }
  };

  setTimeout(animate, 250);
};

const gameLoop = (state: GameState): void => {
  setTimeout(
    () => {
      // draw game state
      drawGame(state);

      // update game state
      if (state.status === 'game_over') {
        gameOverAnimation(state.snake.length);
        return;
      }
      let nextState = processInput(state, lastPressed);
      nextState = move(nextState);
      nextState = processPosition(nextState);

      if (nextState.flashDuration > 0) {
        nextState.flashDuration -= ['left', 'right'].includes(state.heading)
          ? msPerFrameX
          : msPerFrameY;
        nextState.flashRotation = !nextState.flashRotation;
      }

      // Rainbow state
      rainbowModifier++;
      const adj = rainbowModifier % 3 == 0 ? 1 : 0;
      nextState.rainbowOffset = (nextState.rainbowOffset + adj) % nextState.snake.length;
      const maxLength = 5 + Math.round(nextState.snake.length / 5) * 5;
      nextState.rainbowLength =
        nextState.rainbowLength < maxLength ? nextState.rainbowLength + 1 : nextState.rainbowLength;

      nextState.rainbowLength = nextState.rainbowOffset === 0 ? 0 : nextState.rainbowLength;

      // repeat!
      gameLoop(nextState);
    },
    ['left', 'right'].includes(state.heading) ? msPerFrameX : msPerFrameY
  );
};

process.stdin.on('keypress', (str, { ctrl, name }) => {
  if (ctrl && name === 'c') process.exit();

  type vimMappingProps = {
    h: Direction;
    j: Direction;
    k: Direction;
    l: Direction;
    [index: string]: Direction;
  };

  if (['left', 'right', 'up', 'down', 'h', 'j', 'k', 'l'].includes(name)) {
    const vimMapping: vimMappingProps = {
      h: 'left',
      l: 'right',
      k: 'up',
      j: 'down',
    };

    let keyName: Direction = vimMapping[name];
    if (!keyName) keyName = name;

    lastPressed = keyName;
  }
});

process.stdout.write('\x1b[?25l');

gameLoop(initialState);

const backgroundSound = soundService.playBackgroundSound();

process.on('exit', () => {
  if (backgroundSound) backgroundSound.kill();
  process.stdout.write('\x1b[?25h');
});

const gameover = (snake_length: number, invert: boolean) => {
  const path = './assets/screens/GAMEOVER.csv';

  const data = fs
    .readFileSync(path)
    .toString()
    .split('\n')
    .map(e => e.trim())
    .map(e => e.split(',').map(e => Number(e.trim())));

  drawScreen(data, snake_length, invert);
};
