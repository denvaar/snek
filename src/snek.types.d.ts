type Direction = 'right' | 'left' | 'up' | 'down';
type Status = 'playing' | 'game_over';

interface GameState {
  status: Status;
  snake: Array<Array<number>>;
  heading: Direction;
  food: Array<number>;
  lastPressed: Direction;
}

type vimMappingProps = {
  h: Direction;
  j: Direction;
  k: Direction;
  l: Direction;
  [index: string]: Direction;
};