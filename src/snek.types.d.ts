type Direction = 'right' | 'left' | 'up' | 'down';
type Status = 'playing' | 'game_over';

interface GameState {
  status: Status;
  snake: Array<Array<number>>;
  heading: Direction;
  food: Array<number>;
  flashDuration: number;
  flashRotation: boolean;
}
