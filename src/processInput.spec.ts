import processInput from './processInput'

describe('process Input', () => {
  it('should be a function', () => {
    expect(typeof processInput).toBe('function')
  });

  describe('changing direction', () => {
    it.each`
     initial | expected
     ${'right'} | ${'up'}
     ${'right'} | ${'down'}
     ${'right'} | ${'left'}
     ${'up'} | ${'right'}
     ${'up'} | ${'down'}
     ${'up'} | ${'left'}
     ${'down'} | ${'right'}
     ${'down'} | ${'up'}
     ${'down'} | ${'left'}
     ${'left'} | ${'right'}
     ${'left'} | ${'up'}
     ${'left'} | ${'down'}
    `('changes gamestate heading from $initial to $expected', ({ initial, expected }) => {
      const initialState: GameState = {
        status: 'playing',
        snake: [[3, 1], [2, 1], [1, 1]],
        heading: initial as Direction,
        food: [10, 10],
      };
      const newState = processInput(initialState, expected);
      expect(newState.heading).toBe(expected)
    });

    describe('unknown direction', () => {
      it('does not adfect heading', () => {
        const initialState: GameState = {
          status: 'playing',
          snake: [[3, 1], [2, 1], [1, 1]],
          heading: 'left',
          food: [10, 10],
        };
        const newState = processInput(initialState, 'fake');
        expect(newState.heading).toBe('left')
      });
    });
  });

  describe('snake movement', () => {
    describe('changing direction', () => {

      test.each`
     headingInitial | headingCurrent | snakeInitial | snakeCurrent
     ${'right'} | ${'up'}    | ${[[5, 5], [4, 5], [3, 5]]} | ${[[5, 4], [5, 5], [4, 5]]}
     ${'right'} | ${'down'}  | ${[[5, 5], [4, 5], [3, 5]]} | ${[[5, 6], [5, 5], [4, 5]]}
     ${'left'}  | ${'up'}    | ${[[5, 5], [6, 5], [7, 5]]} | ${[[5, 4], [5, 5], [6, 5]]}
     ${'left'}  | ${'down'}  | ${[[5, 5], [6, 5], [7, 5]]} | ${[[5, 6], [5, 5], [6, 5]]}
     ${'up'}    | ${'right'} | ${[[5, 5], [5, 6], [5, 7]]} | ${[[6, 5], [5, 5], [5, 6]]}
     ${'up'}    | ${'left'}  | ${[[5, 5], [5, 6], [5, 7]]} | ${[[4, 5], [5, 5], [5, 6]]}
     ${'down'}  | ${'right'} | ${[[5, 5], [5, 4], [5, 3]]} | ${[[6, 5], [5, 5], [5, 4]]}
     ${'down'}  | ${'left'}  | ${[[5, 5], [5, 4], [5, 3]]} | ${[[4, 5], [5, 5], [5, 4]]}
    `('when changing heading from $headingInitial to $headingCurrent moves snake correctly',
        ({ headingInitial, headingCurrent, snakeInitial, snakeCurrent }) => {
          const initialState: GameState = {
            status: 'playing',
            snake: snakeInitial,
            heading: headingInitial,
            food: [5, 5],
          };
          const newState = processInput(initialState, headingCurrent);
          expect(newState.snake).toEqual(snakeCurrent);
        })
    });
    describe('keeping direction', () => {

      test.each`
     headingInitial | snakeInitial | snakeCurrent
     ${'right'} | ${[[5, 5], [4, 5], [3, 5]]} | ${[[6, 5], [5, 5], [4, 5]]}
     ${'left'}  | ${[[5, 5], [6, 5], [7, 5]]} | ${[[4, 5], [5, 5], [6, 5]]}
     ${'up'}    | ${[[5, 5], [5, 6], [5, 7]]} | ${[[5, 4], [5, 5], [5, 6]]}
     ${'down'}  | ${[[5, 5], [5, 4], [5, 3]]} | ${[[5, 6], [5, 5], [5, 4]]}
    `('when maintaining $headingInitial heading moves snake correctly',
        ({ headingInitial, snakeInitial, snakeCurrent }) => {
          const initialState: GameState = {
            status: 'playing',
            snake: snakeInitial,
            heading: headingInitial,
            food: [5, 5],
          };
          const newState = processInput(initialState, headingInitial);
          expect(JSON.stringify(newState.snake)).toEqual(JSON.stringify(snakeCurrent));
        })
    });
  });
});