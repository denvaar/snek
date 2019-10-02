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
     ${'right'} | ${'left'} | ${[[1, 1], [2, 1], [3, 1]]} | ${[[0, 1], [1, 1], [2, 1]]}
     ${'right'} | ${'up'} | ${[[1, 1], [2, 1], [3, 1]]} | ${[[1, 0], [1, 1], [2, 1]]}
     ${'right'} | ${'down'} | ${[[1, 1], [2, 1], [3, 1]]} | ${[[1, 2], [1, 1], [2, 1]]}
     ${'left'} | ${'right'} | ${[[3, 1], [2, 1], [1, 1]]} | ${[[4, 1], [3, 1], [2, 1]]}
     ${'left'} | ${'up'} | ${[[3, 1], [2, 1], [1, 1]]} | ${[[3, 0], [3, 1], [2, 1]]}
     ${'left'} | ${'down'} | ${[[3, 1], [2, 1], [1, 1]]} | ${[[3, 2], [3, 1], [2, 1]]}
     ${'up'} | ${'right'} | ${[[3, 1], [2, 1], [1, 1]]} | ${[[4, 1], [3, 1], [2, 1]]}
     ${'up'} | ${'left'} | ${[[3, 1], [2, 1], [1, 1]]} | ${[[2, 1], [3, 1], [2, 1]]}
     ${'up'} | ${'down'} | ${[[3, 1], [2, 1], [1, 1]]} | ${[[3, 2], [3, 1], [2, 1]]}
     ${'down'} | ${'right'} | ${[[3, 1], [2, 1], [1, 1]]} | ${[[4, 1], [3, 1], [2, 1]]}
     ${'down'} | ${'left'} | ${[[3, 1], [2, 1], [1, 1]]} | ${[[2, 1], [3, 1], [2, 1]]}
     ${'down'} | ${'up'} | ${[[3, 1], [2, 1], [1, 1]]} | ${[[3, 0], [3, 1], [2, 1]]}
    `('when changing heading from $headingInitial to $headingCurrent moves snake correctly',
        ({ headingInitial, headingCurrent, snakeInitial, snakeCurrent }) => {
          const initialState: GameState = {
            status: 'playing',
            snake: snakeInitial,
            heading: headingInitial,
            food: [10, 10],
          };
          const newState = processInput(initialState, headingCurrent);
          expect(newState.snake).toEqual(snakeCurrent);
        })
    });
  });
});