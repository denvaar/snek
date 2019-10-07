import processPosition from './processPosition'

describe('processPosition', () => {
  it('is defined as function', () => {
    expect(typeof processPosition).toBe('function');
  });

  describe('Eating food', () => {

    it.each`
    heading     | snake                       |  expected
    ${'up'}     | ${[[5, 5], [5, 6], [5, 7]]} | ${[[5, 5], [5, 6], [5, 7], [5, 8]]}
    ${'down'}   | ${[[5, 5], [5, 4], [5, 3]]} | ${[[5, 5], [5, 4], [5, 3], [5, 4]]}
    ${'left'}   | ${[[5, 5], [6, 5], [7, 5]]} | ${[[5, 5], [6, 5], [7, 5], [8, 5]]}
    ${'right'}  | ${[[5, 5], [4, 5], [3, 5]]} | ${[[5, 5], [4, 5], [3, 5], [4, 5]]}
    `('going $heading should grow snake', ({ heading, snake, expected }) => {
      const initialState: GameState = {
        status: 'playing',
        snake: snake,
        heading: heading,
        food: [5, 5],
      };
      const newState = processPosition(initialState)
      expect(JSON.stringify(newState.snake)).toBe(JSON.stringify(expected))
    });

    it('should place new food', () => {
      const initialState: GameState = {
        status: 'playing',
        snake: [[5, 5], [5, 4], [5, 3]],
        heading: 'right',
        food: [5, 5],
      };
      const newState = processPosition(initialState)
      expect(JSON.stringify(newState.food)).not.toBe(JSON.stringify([5, 5]))
    });

    it('ignores unknown direction', () => {
      const initialState: GameState = {
        status: 'playing',
        snake: [[5, 5], [5, 4], [5, 3]],
        heading: 'south' as Direction,
        food: [5, 5],
      };
      const newState = processPosition(initialState);
      expect(JSON.stringify(newState.snake)).toBe(JSON.stringify([[5, 5], [5, 4], [5, 3]]))
    });
  });

  describe('Border collition', () => {
    test.each`
    direction  | snake
    ${'up'}     | ${[[5, 0], [5, 1], [5, 2]]}
    ${'down'}   | ${[[5, 20], [5, 19], [5, 18]]}
    ${'left'}   | ${[[0, 5], [1, 5], [2, 5]]}
    ${'right'}  | ${[[70, 5], [69, 5], [68, 5]]}
    `('checks $direction bonundry', ({ direction, snake }) => {
      const initialState: GameState = {
        status: 'playing',
        snake: snake,
        heading: direction as Direction,
        food: [5, 5],
      };
      const newState = processPosition(initialState);
      expect(newState.status).toBe('game_over');
    })
  });

  describe('Snake collition', () => {
    it('should end game', () => {
      const direction = 'right';
      const snake = [[5, 5], [6, 5], [6, 4], [5, 4], [5, 5]];
      const initialState: GameState = {
        status: 'playing',
        snake: snake,
        heading: direction as Direction,
        food: [7, 2],
      };
      const newState = processPosition(initialState);
      expect(newState.status).toBe('game_over');
    });
  });

  describe('Nothing interesting', () => {
    it('should do nothing to state', () => {
      const direction = 'right';
      const snake = [[5, 5], [4, 5], [3, 5]];
      const initialState: GameState = {
        status: 'playing',
        snake: snake,
        heading: direction as Direction,
        food: [7, 2],
      };
      const newState = processPosition(initialState);
      expect(initialState).toBe(newState);
    });
  });
});