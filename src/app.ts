import drawGame from "./drawGame";
import move from "./move";
import processInput from "./processInput";
import processPosition from "./processPosition";

const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
if (process.stdin.setRawMode) {
  process.stdin.setRawMode(true);
}

const msPerFrame: number = 66;

const initialState: GameState = {
  status: "playing",
  snake: [[7, 1], [6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1]],
  heading: "right",
  food: [10, 10],
  lastPressed: "right"
};

const vimMapping: vimMappingProps = {
  h: "left",
  l: "right",
  k: "up",
  j: "down"
};

class GameLoop {

  constructor(state: GameState) {
    this.state = state;
    this.addListener();
    this.loop();
  }

  state: GameState;
  
  addListener() {
    process.stdin.on("keypress", (str, { ctrl, name }) => {
      if (ctrl && name === "c") process.exit();
      if (["left", "right", "up", "down", "h", "j", "k", "l"].includes(name)) {
        this.state.lastPressed = vimMapping[name] || name;
      }
    });
  }

  loop() {
    setTimeout(() => {
      // draw game state
      drawGame(this.state);
  
      // update game state
      if (this.state.status === "game_over") {
        process.stdout.write("\x07");
        process.exit();
      }
  
      // repeat!
      this.state = processPosition(move(processInput(this.state)));
      this.loop();
    }, msPerFrame);
  }
}

new GameLoop(initialState);