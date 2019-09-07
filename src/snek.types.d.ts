type Direction = 'right' | 'left' | 'up' | 'down';

interface GameState {
  snake: Array<Array<number>>;
  heading: Direction;
  food: Array<number>;
}
