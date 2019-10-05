import drawGame from "./drawGame";
import move from "./move";
import processInput from "./processInput";
import processPosition from "./processPosition";

const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
if (process.stdin.setRawMode) {
  process.stdin.setRawMode(true);
}

// these should be calculated based of the width & height
const msPerFrameX: number = 66;
const msPerFrameY: number = 100;

const initialState: GameState = {
  status: "playing",
  snake: [[7, 1], [6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1]],
  heading: "right",
  food: [10, 10]
};
// global for now :(
var lastPressed: Direction = "right";

const gameLoop = (state: GameState): void => {
  setTimeout(() => {
    // draw game state
    drawGame(state);

    // update game state
    if (state.status === "game_over") {
      process.stdout.write("\x07");
      process.exit();
    }
    let nextState = processInput(state, lastPressed);
    nextState = move(nextState);
    nextState = processPosition(nextState);

    // repeat!
    gameLoop(nextState);
  }, ['left', 'right'].includes(state.heading) ? msPerFrameX : msPerFrameY);
};

process.stdin.on("keypress", (str, { ctrl, name }) => {
  if (ctrl && name === "c") process.exit();

  type vimMappingProps = {
    h: Direction;
    j: Direction;
    k: Direction;
    l: Direction;
    [index: string]: Direction;
  };

  if (["left", "right", "up", "down", "h", "j", "k", "l"].includes(name)) {
    const vimMapping: vimMappingProps = {
      h: "left",
      l: "right",
      k: "up",
      j: "down"
    };

    let keyName: Direction = vimMapping[name];
    if (!keyName) keyName = name;

    lastPressed = keyName;
  }
});

gameLoop(initialState);
